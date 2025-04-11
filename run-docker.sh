#!/bin/bash

# Kill any existing containers to avoid port conflicts
echo "Stopping existing containers..."
docker stop gather-backend gather-frontend 2>/dev/null || true
docker rm gather-backend gather-frontend 2>/dev/null || true

# Create a Docker network for the containers
echo "Creating Docker network..."
docker network create gather-network 2>/dev/null || true

# Build and run backend
echo "Building and starting backend container..."
cd backend
docker build -t gather-backend .
docker run -d --name gather-backend \
  --network gather-network \
  -p 5001:5001 \
  -v "$(pwd):/app" \
  gather-backend

# Build and run frontend
echo "Building and starting frontend container..."
cd ../frontend
docker build -t gather-frontend .
docker run -d --name gather-frontend \
  --network gather-network \
  -p 5173:5173 \
  -v "$(pwd):/app" \
  gather-frontend

echo "Application is running!"
echo "- Frontend: http://localhost:5173"
echo "- Backend: http://localhost:5001"
echo ""
echo "To fix database schema issues, run:"
echo "docker exec gather-backend /app/fix-db.sh" 