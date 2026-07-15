#!/bin/bash

# Start both backend and frontend in development mode

echo "🚀 Starting AI Document Intelligence Platform"

# Start backend in the background
echo "Starting backend..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 2

# Start frontend
echo "Starting frontend..."
cd frontend
npm start

# Kill backend when frontend stops
kill $BACKEND_PID 2>/dev/null || true
