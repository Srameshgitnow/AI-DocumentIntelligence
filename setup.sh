#!/bin/bash

# AI Document Intelligence - Setup Script

set -e

echo "🚀 Setting up AI Document Intelligence Platform"

# Create backend environment file
echo "📝 Creating backend configuration..."
if [ ! -f backend/.env ]; then
  cp backend/.env.example backend/.env
  echo "✓ backend/.env created. Please edit with your OpenAI API key."
else
  echo "✓ backend/.env already exists"
fi

# Create frontend environment file
echo "📝 Creating frontend configuration..."
if [ ! -f frontend/.env ]; then
  echo "REACT_APP_API_URL=http://localhost:5000/api" > frontend/.env
  echo "✓ frontend/.env created"
else
  echo "✓ frontend/.env already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."

echo "  Installing backend dependencies..."
cd backend && npm install && cd ..

echo "  Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "  1. Edit backend/.env and add your OpenAI API key"
echo "  2. Run: docker-compose up (for Docker)"
echo "  3. Or run: npm run dev in backend/ and frontend/ separately"
echo ""
echo "📖 Documentation: See README.md"
