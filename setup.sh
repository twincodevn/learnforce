#!/bin/bash

echo "🚀 Setting up LearnForce - Duolingo-style Learning Platform"
echo "=========================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🗄️ Setting up database..."
npx prisma generate

# Push database schema
echo "📊 Creating database..."
npx prisma db push

# Create some sample data
echo "🌱 Seeding sample data..."
npm run db:seed

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Create an account and start learning!"
echo ""
echo "📚 Available pages:"
echo "- / (Landing page)"
echo "- /auth/signin (Sign in)"
echo "- /auth/signup (Sign up)"
echo "- /dashboard (Main dashboard)"
echo "- /learn (Learning interface)"
echo ""
echo "Happy learning! 🎓"
