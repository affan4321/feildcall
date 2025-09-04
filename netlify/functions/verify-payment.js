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
    const { session_id } = JSON.parse(event.body);

    if (!session_id) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing session_id' }),
      };
    }

    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    // Check if payment was successful
    const paid = session.payment_status === 'paid';

    let formData = null;
    let selectedPlan = null;

    if (paid && session.metadata) {
      try {
        formData = JSON.parse(session.metadata.formData);
        selectedPlan = session.metadata.selectedPlan;
      } catch (parseError) {
        console.error('Error parsing form data from session metadata:', parseError);
      }
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        paid,
        formData,
        selectedPlan,
        customer_email: session.customer_email,
        amount_total: session.amount_total,
      }),
    };
  } catch (error) {
    console.error('Error verifying payment:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to verify payment',
        details: error.message 
      }),
    };
  }
};