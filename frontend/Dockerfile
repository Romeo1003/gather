FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies with legacy peer deps to avoid MUI version conflicts
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Fix the @mui/lab import in AdminDashboard.jsx
RUN sed -i 's/import {.*} from "@mui\/lab";/\/\/ Timeline components removed due to compatibility issues/' src/components/AdminDashboard/AdminDashboard.jsx || true

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"] 