# Supabase Setup Instructions

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization (if needed)
4. Create a new project:
   - **Name**: `learnforce-production`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is sufficient for development

## Step 2: Get Project Credentials

1. Go to Project Settings → API
2. Copy the following:
   - **Project URL**: `https://your-project.supabase.co`
   - **Anon Key**: `eyJ...` (public key)
   - **Service Role Key**: `eyJ...` (private key)

## Step 3: Create Environment Variables

Create a `.env.local` file in your project root with:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
```

## Step 4: Execute Database Schema

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the entire `supabase-schema.sql` file
4. Click "Run" to execute the schema

## Step 5: Test the Application

1. Start the development server: `npm run dev`
2. Try registering a new user
3. Test login functionality
4. Verify the dashboard loads correctly

## Troubleshooting

### Common Issues

1. **Environment Variables**: Make sure all environment variables are set correctly
2. **Database Schema**: Ensure the schema was executed successfully
3. **CORS**: Check CORS settings in Supabase dashboard
4. **RLS Policies**: Verify Row Level Security policies are enabled

### Next Steps

Once the basic setup is working:
1. Migrate your existing data (if any)
2. Test all features thoroughly
3. Deploy to production
4. Set up monitoring and analytics

## Support

- Supabase Documentation: [supabase.com/docs](https://supabase.com/docs)
- Community Discord: [discord.supabase.com](https://discord.supabase.com)
- GitHub Issues: [github.com/supabase/supabase](https://github.com/supabase/supabase)
