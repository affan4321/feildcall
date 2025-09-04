exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Check if Stripe secret key is available
  if (!process.env.STRIPE_SECRET_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Stripe secret key not configured' }),
    };
  }

  // Initialize Stripe with the secret key
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  try {
    const { formData, selectedPlan } = JSON.parse(event.body);

    // Validate required data
    if (!formData || !selectedPlan) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing form data or selected plan' }),
      };
    }

    // Define plan prices
    const planPrices = {
      starter: 9900, // $99.00 in cents
      pro: 37500,    // $375.00 in cents
    };

    const amount = planPrices[selectedPlan];
    if (!amount) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Invalid plan selected' }),
      };
    }

    // Get the site URL from the request
    const siteUrl = event.headers.origin || 'https://fieldcall.ai';

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `FieldCall™ ${selectedPlan === 'starter' ? 'Starter' : 'Pro'} Plan`,
              description: `Monthly subscription - ${selectedPlan === 'starter' ? '40 calls included' : '160 calls included'}`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${siteUrl}/signup?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/signup?payment=cancelled`,
      customer_email: formData.email,
      metadata: {
        // Store form data in metadata for retrieval after payment
        formData: JSON.stringify(formData),
        selectedPlan: selectedPlan,
      },
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        sessionId: session.id,
        url: session.url 
      }),
    };
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to create payment session',
        details: error.message 
      }),
    };
  }
};