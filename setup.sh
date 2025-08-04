#!/bin/bash

echo "🚀 Setting up AI-Powered Receipt Scanner & Expense Tracker"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env file and add your OpenAI API key"
    echo "   Get your API key from: https://platform.openai.com/api-keys"
else
    echo "✅ .env file already exists"
fi

# Create uploads directory
echo "📁 Creating uploads directory..."
mkdir -p backend/uploads

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file and add your OpenAI API key"
echo "2. Run 'npm run dev' to start the application"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "Happy receipt scanning! 📸" 