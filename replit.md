# AfricTivistes ADISA - Refine Admin Dashboard

## Overview
This is a Refine-based admin dashboard application built with React, TypeScript, and Ant Design. It uses Supabase as the backend database and authentication provider.

## Project Setup
- **Framework**: Refine (React-based admin framework)
- **UI Library**: Ant Design
- **Build Tool**: Vite
- **Language**: TypeScript
- **Backend**: Supabase
- **Routing**: React Router

## Current Status
✅ **Fully configured for Replit environment**
- Development server runs on port 5000
- Vite configured to allow all hosts for proxy compatibility
- Dependencies installed
- Deployment configuration set up

## Required Configuration

### Supabase Environment Variables
To enable database functionality, you need to add these environment variables in the Replit Secrets tab:

1. `VITE_SUPABASE_URL` - Your Supabase project URL
2. `VITE_SUPABASE_KEY` - Your Supabase anon/public key

**How to get these values:**
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one)
3. Go to Settings → API
4. Copy the "Project URL" for `VITE_SUPABASE_URL`
5. Copy the "anon public" key for `VITE_SUPABASE_KEY`

## Available Scripts
- `npm run dev` - Start development server (already configured in workflow)
- `npm run build` - Build for production
- `npm run start` - Start production server

## Features
The application includes:
- Blog posts management (CRUD)
- Categories management (CRUD)
- Authentication with Supabase
- Responsive design with Ant Design
- Real-time updates via Supabase

## Deployment
The project is configured for Replit deployment with:
- Build command: `npm run build`
- Start command: `npm run start`
- Target: Autoscale (suitable for web apps)

## Recent Changes (September 25, 2025)
- Initial project import and setup
- Fixed Vite configuration for Replit proxy compatibility
- Configured development workflow on port 5000
- Set up deployment configuration
- Added project documentation

## Next Steps
1. Add your Supabase credentials to the Secrets tab
2. The application will be fully functional for data operations
3. Ready for deployment when needed