#!/bin/bash

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                  ║"
echo "║              🚀 InvoiceAI - Quick Start                         ║"
echo "║                                                                  ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js first."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

echo "🚀 Starting development server..."
echo ""
echo "📱 The app will open at: http://localhost:3002"
echo "📖 Read START_HERE.md for deployment instructions"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Start the dev server
PORT=3002 npm run dev
