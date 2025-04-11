#!/bin/bash

echo "Starting Gather development container..."

# Kill existing containers
docker stop gather-dev 2>/dev/null || true
docker rm gather-dev 2>/dev/null || true

# Run a new container with the project mounted
docker run -it --name gather-dev -p 5001:5001 -p 5173:5173 \
  -v "$(pwd)":/app \
  -w /app \
  node:16 \
  /bin/bash -c "echo 'Welcome to the Gather development container!' && bash"

echo "Container stopped." 