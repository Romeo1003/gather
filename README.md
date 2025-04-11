# Gather - Event Management Application

Gather is a comprehensive event management platform that allows users to create, manage, and track events. The application offers different interfaces for customers and administrators, with robust features for both roles.

## Project Structure

The project follows a standard client-server architecture:

- `frontend/` - React-based web client
- `backend/` - Express-based server with SQLite database

## Prerequisites

- Node.js (v16+)
- npm or yarn

## Getting Started

### Setting up the Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file based on `.env.example` if it doesn't exist:
   ```
   cp .env.example .env
   ```

4. Start the development server:
   ```
   npm run dev
   ```

The server will start on http://localhost:5001.

### Setting up the Frontend

1. In a new terminal, navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

The frontend will be accessible at http://localhost:5173.

## Features

- **User Authentication**:
  - Customer and admin login paths
  - Admin PIN security
  - Account management

- **Event Management**:
  - Create, edit, and manage events
  - Book tickets
  - Track attendance

- **Venue Management**:
  - Predefined venues with capacity limits
  - Venue selection in event creation

- **Time Slot Selection**:
  - Morning, afternoon, and evening blocks
  - Prevents schedule conflicts

- **Location Features**:
  - Google Maps integration
  - Custom location selection
  - Address search and geocoding

- **Admin Dashboard**:
  - User management
  - Event approvals
  - Analytics

## Default Admin Login

- Email: admin@gather.com
- Password: admin123
- Admin PIN: 1234

## Default User Login

- Email: user@gather.com
- Password: user123

## Developer Notes

- Backend API documentation is available at http://localhost:5001/api/test when the server is running.
- The application uses SQLite for ease of development. No additional database setup is required.
