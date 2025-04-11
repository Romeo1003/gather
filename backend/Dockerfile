FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Create a script to fix database issues
RUN echo '#!/bin/sh\nnode scripts/fix-schema.js' > /app/fix-db.sh && chmod +x /app/fix-db.sh

EXPOSE 5001

CMD ["npm", "run", "dev"] 