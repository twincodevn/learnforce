#!/bin/bash

# LearnForce Database Setup Script
echo "🚀 Setting up LearnForce database..."

# Check if environment variables are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Error: Supabase environment variables not set"
    echo "Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local"
    exit 1
fi

# Load environment variables
source .env.local

echo "📁 Creating database schema..."

# Execute the schema using psql (requires Supabase CLI or direct psql connection)
# Extract connection details from Supabase URL
SUPABASE_HOST=$(echo $NEXT_PUBLIC_SUPABASE_URL | sed 's/https:\/\///' | sed 's/\.supabase\.co.*//')

echo "🔗 Connecting to Supabase database..."
echo "Host: ${SUPABASE_HOST}.supabase.co"

# Note: This script assumes you have psql installed and configured
# Alternative: Use Supabase SQL Editor to execute supabase-schema.sql manually

echo "⚠️  Manual setup required:"
echo "1. Go to your Supabase dashboard: $NEXT_PUBLIC_SUPABASE_URL"
echo "2. Navigate to SQL Editor"
echo "3. Copy and paste the contents of supabase-schema.sql"
echo "4. Click 'Run' to execute the schema"
echo ""
echo "Once complete, test the connection with:"
echo "npm run dev"
echo "curl http://localhost:3000/api/test-supabase"

echo "✅ Setup instructions complete!"