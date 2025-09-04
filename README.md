# FieldCall™ - 24/7 Voice AI for Contractors

FieldCall™ is a comprehensive voice AI solution designed specifically for contractors and field professionals. It provides 24/7 call handling, lead qualification, and job booking while you focus on the work that matters.

## 🏗️ Project Overview

FieldCall™ was built by contractors, for contractors, after 40 years in the trades. It's not a lab experiment - it's a real-world solution to the problem of missed calls and lost leads in the contracting industry.

### Key Features

- **24/7 Voice AI Agent**: Never miss another call, even when you're on the job
- **Lead Qualification**: Automatically screens and qualifies potential customers
- **Job Booking**: Handles appointment scheduling and booking
- **CRM Integration**: Syncs with GoHighLevel for seamless lead management
- **Custom Voice Models**: Choose from multiple professional voice options
- **Real-time Dashboard**: Monitor calls, leads, and bookings
- **Pay-as-you-go Pricing**: No monthly commitments required

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for development and building
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons

### Backend & Services
- **Supabase** for authentication and database
- **GoHighLevel** for CRM integration and lead management
- **Stripe** for payment processing
- **Retell AI** for voice agent functionality
- **Netlify Functions** for serverless backend operations

### Deployment
- **Netlify** for hosting and deployment
- **Netlify Functions** for serverless API endpoints

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   React App     │    │  Netlify         │    │   Supabase      │
│   (Frontend)    │◄──►│  Functions       │◄──►│   (Database)    │
│                 │    │  (Serverless)    │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│     Stripe      │    │   GoHighLevel    │    │   Retell AI     │
│   (Payments)    │    │     (CRM)        │    │   (Voice AI)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- GoHighLevel account with API access
- Stripe account for payments
- Netlify account for deployment

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# GoHighLevel Integration
VITE_GHL_API_KEY=your_ghl_api_key_here
VITE_GHL_LOCATION_ID=your_ghl_location_id_here
VITE_GHL_WEBHOOK_URL=your_ghl_webhook_url_here

# Stripe Configuration (CRITICAL - Required for payment processing)
STRIPE_SECRET_KEY=sk_test_or_sk_live_your_stripe_secret_key_here
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_or_pk_live_your_stripe_publishable_key_here

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key_here
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here

# Optional: Environment
VITE_ENVIRONMENT=development
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fieldcall
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open http://localhost:5173 in your browser

## 🔧 Development Workflow

### Local Development

1. **Frontend Development**
   ```bash
   npm run dev          # Start Vite dev server
   npm run build        # Build for production
   npm run preview      # Preview production build
   ```

2. **Code Quality**
   ```bash
   npm run lint         # Run ESLint
   ```

### Database Management

The project uses Supabase with the following key tables:

- `user_profiles` - User account information and business details
- `stripe_customers` - Links Supabase users to Stripe customers
- `stripe_subscriptions` - Manages subscription data
- `stripe_orders` - Stores order/purchase information

### Authentication Flow

1. **User Registration**
   - User fills out comprehensive signup form
   - Payment processing via Stripe
   - Account creation in Supabase
   - Profile data sync to GoHighLevel

2. **User Login**
   - Email/password authentication via Supabase
   - Session management with auto-logout
   - Protected routes for dashboard access

3. **Dashboard Access**
   - Real-time profile data
   - Retell AI phone number assignment
   - Agent customization options

## 🔌 Integrations

### Supabase Integration

**Purpose**: Authentication, user profiles, and data storage

**Key Features**:
- User authentication with email/password
- Row Level Security (RLS) policies
- Real-time data synchronization
- Secure API access

**Tables**:
- `user_profiles` - Complete user and business information
- `stripe_*` tables - Payment and subscription management

### GoHighLevel Integration

**Purpose**: CRM and lead management

**Key Features**:
- Automatic contact creation
- Custom field mapping for business data
- Lead tracking and management
- Retell AI phone number assignment

**API Endpoints Used**:
- `POST /contacts/` - Create new contacts
- `GET /contacts/` - Retrieve contact information
- `PUT /contacts/{id}` - Update contact custom fields

**Custom Fields**:
- Years in business
- Average job value
- Call volume
- Business challenges
- Preferred start date
- Marketing source
- Selected plan
- Business type
- Agent configuration (voice model, STT, LLM, prompt)

### Stripe Integration

**Purpose**: Payment processing and subscription management

**Key Features**:
- Secure checkout sessions
- Subscription management
- Payment verification
- Customer data synchronization

**Implementation**:
- Frontend: Stripe.js for secure payment forms
- Backend: Netlify Functions for server-side operations
- Webhooks: Payment confirmation and subscription updates

### Retell AI Integration

**Purpose**: Voice AI agent functionality

**Key Features**:
- Dedicated phone numbers for each customer
- Customizable voice models
- Speech-to-text configuration
- AI language model selection
- Custom prompt configuration

**Voice Models Available**:
- ElevenLabs (Adriel, Bella, Charlie, Domi)
- OpenAI (Alloy, Echo, Nova)

**STT Models**:
- Deepgram Nova 2 (Recommended)
- Deepgram Enhanced
- AssemblyAI Best
- OpenAI Whisper Large

**LLM Models**:
- GPT-4o (Most Advanced)
- GPT-4 Turbo
- GPT-3.5 Turbo
- Claude 3 Sonnet
- Claude 3 Haiku

## 📱 User Journey

### 1. Landing Page Experience
- Hero section with value proposition
- Live demo phone number: (888) 440-9613
- Video overview (55 seconds)
- How it works explanation
- Social proof and testimonials
- Pricing information
- FAQ section

### 2. Signup Process
- Comprehensive form with personal and business information
- Plan selection (Starter $99/month, Pro $375/month)
- Stripe payment processing
- Account creation and verification
- GoHighLevel contact creation

### 3. Dashboard Experience
- Welcome message with user's name
- Retell AI phone number display (assigned within 48 hours)
- Agent customization form:
  - Voice model selection
  - STT model configuration
  - LLM model selection
  - Custom prompt creation
- Personal and business information display
- Real-time configuration updates

### 4. Agent Activation
- 48-hour setup process
- Custom voice identity creation
- CRM sync configuration
- Calendar integration
- Full testing and optimization
- Dedicated onboarding specialist

## 🎯 Business Model

### Pricing Plans

1. **Pay-as-you-go** (Coming Soon)
   - $2.60 per call
   - No monthly commitment
   - Auto-billed at $100 usage

2. **Starter Plan** - $99/month
   - 40 calls included
   - $2.48 per call after
   - Cancel anytime

3. **Growth Plan** (Coming Soon) - $189/month
   - 80 calls included
   - $2.36 per call after
   - CRM sync included

4. **Pro Plan** - $375/month
   - 160 calls included
   - $2.34 per call after
   - CRM sync included
   - Cancel anytime

### Setup Fee
- One-time $199 setup fee
- Includes custom voice identity
- CRM sync setup
- Calendar integration
- Full testing & optimization
- Dedicated onboarding specialist

## 🚀 Deployment

### Netlify Deployment

1. **Connect Repository**
   - Link your Git repository to Netlify
   - Configure build settings

2. **Environment Variables**
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   VITE_GHL_API_KEY=your_ghl_api_key
   VITE_GHL_LOCATION_ID=your_ghl_location_id
   ```

3. **Build Configuration**
   ```toml
   [build]
   functions = "netlify/functions"
   publish = "dist"
   command = "npx vite build"

   [functions]
   node_bundler = "esbuild"

   [[redirects]]
   from = "/*"
   to = "/index.html"
   status = 200
   ```

4. **Deploy**
   - Push to main branch for automatic deployment
   - Monitor build logs for any issues

## 🔒 Security

### Authentication
- Supabase Auth with email/password
- Row Level Security (RLS) policies
- Session management with auto-logout
- Protected routes for sensitive areas

### Data Protection
- All API calls use authentication tokens
- Environment variables for sensitive data
- HTTPS enforcement
- Secure payment processing via Stripe

### Privacy
- User data stored securely in Supabase
- GDPR-compliant data handling
- Clear privacy policy and terms of service

## 🧪 Testing

### Local Testing
- Test signup flow with development mode bypass
- Verify authentication flows
- Check dashboard functionality
- Test responsive design

### Production Testing
- End-to-end payment processing
- GoHighLevel integration verification
- Retell AI phone number assignment
- Email notifications and confirmations

## 📊 Analytics & Monitoring

### User Tracking
- Google Analytics integration
- Form submission tracking
- Conversion funnel analysis
- User engagement metrics

### Error Monitoring
- Console error logging
- Payment failure tracking
- API error monitoring
- User feedback collection

## 🤝 Contributing

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Implement proper error handling
- Write clear, descriptive commit messages
- Test thoroughly before deployment

### Code Structure
```
src/
├── components/          # React components
├── contexts/           # React contexts (Auth, etc.)
├── lib/               # Utility libraries (Supabase)
├── pages/             # Page components
└── main.tsx           # Application entry point

netlify/
└── functions/         # Serverless functions

supabase/
└── migrations/        # Database migrations

public/               # Static assets
```

## 📞 Support

### Demo
Call (888) 440-9613 to hear FieldCall™ in action

### Contact
- Email: onboarding@fieldcall.ai
- Website: https://fieldcall.ai

### Documentation
- This README for technical setup
- In-app help and tooltips
- FAQ section on website

## 📄 License

Copyright © 2024 FieldCall™. All rights reserved.

---

**Built by contractors, for contractors.** 🔨