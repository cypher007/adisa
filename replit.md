# AfricTivistes ADISA - Refine Admin Dashboard

## Overview
This is a Refine-based admin dashboard application built with React, TypeScript, and Ant Design. It uses **Replit Auth** for authentication and **Supabase** for data operations.

## Architecture
- **Frontend**: React with Refine framework (Port 5000)
- **Backend**: Express.js auth server (Port 4000)
- **UI Library**: Ant Design
- **Build Tool**: Vite
- **Language**: TypeScript
- **Authentication**: Replit Auth (OpenID Connect)
- **User Database**: PostgreSQL (Replit built-in)
- **Data Backend**: Supabase
- **Routing**: React Router

## Current Status
✅ **Fully configured for Replit environment**
- Replit Auth integrated with Express backend
- PostgreSQL database for user sessions and profiles
- Development workflow runs both servers concurrently
- Vite configured to proxy API requests to auth backend
- All environment variables configured automatically

## Authentication Setup

### Replit Auth (Already Configured ✓)
The app uses Replit Auth for user authentication, which provides:
- Login with Google, GitHub, X, Apple, and email/password
- Automatic user management in the Auth pane
- Secure session management with PostgreSQL
- All required environment variables are pre-configured

**To customize the login page:**
1. Go to the **Auth pane** in your Replit workspace
2. Click **Configure**
3. Customize app name, icon, and login methods

### How It Works
1. User authentication is handled by the Express backend (port 4000)
2. User sessions are stored in PostgreSQL
3. User profiles are stored in the database
4. Frontend communicates with backend via `/api/auth/*` endpoints

## Data Operations (Supabase - Optional)

If you want to use Supabase for data operations, add these environment variables:

1. `VITE_SUPABASE_URL` - Your Supabase project URL
2. `VITE_SUPABASE_KEY` - Your Supabase anon/public key

**Note**: Currently the app uses Replit Auth for authentication, so Supabase auth is not needed.

## Available Scripts
- `npm run dev` - Start both auth server and frontend (concurrent)
- `npm run dev:server` - Start auth server only (port 4000)
- `npm run dev:client` - Start frontend only (port 5000)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio for database management

## Features
The application includes:
- **Replit Auth**: Secure authentication with multiple providers
- User profile management
- Blog posts management (CRUD)
- Categories management (CRUD)
- Responsive design with Ant Design
- Session-based authentication with PostgreSQL

## Database Schema
The app uses PostgreSQL with the following tables:
- `users` - User profiles (id, email, firstName, lastName, profileImageUrl)
- `sessions` - User session storage for authentication

## Deployment
The project is configured for Replit deployment with:
- Build command: `npm run build`
- Start command: `npm run start`
- Target: Autoscale (suitable for web apps)

## Recent Changes (October 16, 2025)
- **Integrated Replit Auth** with Express backend
- Added PostgreSQL database for users and sessions
- Created custom Refine auth provider for Replit Auth
- Set up concurrent development workflow
- Configured Vite proxy for API requests
- Updated authentication flow to use Replit Auth

## Development Notes
- The frontend runs on port 5000
- The auth backend runs on port 4000
- API requests to `/api/*` are proxied from frontend to backend
- Both servers run concurrently during development
- Environment variables are automatically configured by Replit