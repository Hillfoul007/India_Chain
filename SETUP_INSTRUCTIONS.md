# IndiaChain - Setup Instructions

This document contains step-by-step instructions to set up the IndiaChain application.

## Prerequisites

- Supabase account (https://supabase.com)
- Google Gemini API key (https://ai.google.dev)
- Node.js 18+ and pnpm installed

## Step 1: Supabase Database Setup

### 1.1 Create the Database Schema

1. Go to your Supabase project dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the entire contents from `SUPABASE_SCHEMA.sql` file
5. Paste it into the SQL editor
6. Click "Run"
7. Wait for all tables to be created successfully

### 1.2 Verify Tables

After running the schema, verify these tables exist in the "Tables" section:
- `profiles`
- `user_roles`
- `wallets`
- `kyc_verifications`
- `shipments`
- `credit_scores`
- `chat_messages`

## Step 2: Deploy Edge Functions

### 2.1 Set Up Supabase CLI (Optional but Recommended)

```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
```

### 2.2 Configure Secrets

In your Supabase dashboard:

1. Go to Settings → Secrets/Environment Variables
2. Add `GEMINI_API_KEY` with your Google Gemini API key value
3. Save

### 2.3 Deploy Edge Functions

Option A: Using Supabase CLI
```bash
supabase functions deploy ai-chat --project-ref YOUR_PROJECT_REF
supabase functions deploy ai-credit-score --project-ref YOUR_PROJECT_REF
```

Option B: Via Dashboard
1. Go to Edge Functions in the Supabase dashboard
2. Click "Create a new function"
3. Name: `ai-chat`
4. Copy content from `supabase/functions/ai-chat/index.ts`
5. Deploy
6. Repeat for `ai-credit-score`

## Step 3: Environment Variables

The environment variables are already set in your development environment:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `GEMINI_API_KEY`

## Step 4: Test the Application

1. Start the development server:
```bash
pnpm dev
```

2. Open http://localhost:8080 in your browser

3. Test the workflow:
   - Go to home page
   - Click "Sign Up"
   - Create an account with email and password
   - You should be redirected to dashboard
   - A wallet with DID address will be auto-created
   - Test KYC verification (3-second delay to simulate ZK-KYC)
   - Create shipments
   - Check credit score
   - Chat with AI assistant

## Step 5: Database Security

All tables have Row Level Security (RLS) enabled:
- ✅ Users can only access their own data
- ✅ Users can create, read, and update their own records
- ✅ Automatic profile/wallet creation on signup via trigger

## Troubleshooting

### Issue: "Invalid Supabase credentials"
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
- Check that the keys haven't changed in Supabase dashboard

### Issue: "Edge function not found"
- Make sure the function is deployed in Supabase
- Check that `GEMINI_API_KEY` is set in Supabase secrets
- Verify the function names are exactly: `ai-chat` and `ai-credit-score`

### Issue: "Auth fails after signup"
- Ensure "Auto confirm" is disabled in Supabase Auth settings
- Check that the `on_auth_user_created` trigger is active
- Verify profiles table exists with correct schema

### Issue: "Chat returns mock data"
- Check that the edge function is deployed
- Verify `GEMINI_API_KEY` is valid
- Check browser console for specific error messages

## Production Deployment

### Option 1: Netlify
1. Connect your GitHub repo to Netlify
2. Set environment variables in Netlify UI
3. Push to trigger automatic deployment

### Option 2: Vercel
1. Import project to Vercel
2. Add environment variables
3. Deploy

### Option 3: Docker
```bash
pnpm build
docker build -t indiachain .
docker run -p 3000:3000 indiachain
```

## Architecture Overview

```
IndiaChain Application
├── Frontend (React + TypeScript)
│   ├── Pages
│   │   ├── Landing (Index)
│   │   ├── Auth (Signup/Login)
│   │   └── Dashboard (5 sections)
│   └── Components
├── Backend (Supabase)
│   ├── PostgreSQL Database
│   ├── Edge Functions (AI features)
│   ├── Auth (JWT-based)
│   └── RLS Policies (Security)
└── External APIs
    └── Google Gemini (AI)
```

## Key Features Implemented

- ✅ Email/Password Authentication
- ✅ DID Wallet Generation (auto-created on signup)
- ✅ ZK-KYC Verification (with 3-second simulation)
- ✅ Smart Shipment Tracking with auto-generated tracking numbers
- ✅ AI Credit Score with animated gauge and factor breakdown
- ✅ Streaming AI Chat Assistant
- ✅ Row Level Security for all data
- ✅ Dark theme with glassmorphism design
- ✅ Responsive layout (mobile, tablet, desktop)
- ✅ Framer Motion animations throughout

## Support

For issues:
1. Check the browser console for error messages
2. Verify all environment variables are set correctly
3. Ensure Supabase tables exist with correct schema
4. Check that edge functions are deployed and secrets are configured
