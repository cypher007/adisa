# AfricTivistes ADISA - Refine Admin Dashboard

## Overview
This is a Refine-based admin dashboard application built with React, TypeScript, and Ant Design. It uses a custom **invitation-only authentication system** with **mandatory 2FA** for all users. Administrators can invite users via email, and users must configure 2FA to complete their registration.

## Architecture
- **Frontend**: React with Refine framework (Port 5000)
- **Backend**: Express.js auth server (Port 4000)
- **UI Library**: Ant Design
- **Build Tool**: Vite
- **Language**: TypeScript
- **Authentication**: Custom invitation-based system with 2FA
- **User Database**: PostgreSQL (Replit built-in)
- **Data Backend**: Supabase
- **Routing**: React Router

## Current Status
✅ **Backend Complètement Implémenté**
- ✅ Système d'invitation uniquement par email
- ✅ Authentification 2FA obligatoire (OTPAuth + Google Authenticator)
- ✅ Compte administrateur créé
- ✅ Envoi d'emails automatique (Replit Mail)
- ✅ Gestion des organisations
- ✅ Séparation stricte des rôles (admin/user)
- ⏳ Frontend à compléter (voir IMPLEMENTATION_GUIDE.md)

## Authentication System

### Invitation-Only Access
L'application utilise un système d'invitation uniquement. Les utilisateurs ne peuvent pas s'inscrire directement.

**Workflow**:
1. Admin invite un utilisateur par email
2. Utilisateur reçoit un email avec lien d'invitation
3. Utilisateur crée son compte (username/password)
4. **2FA obligatoire**: Scan QR code avec Google Authenticator
5. Vérification du code 2FA
6. Accès au système

### Admin Account (Déjà Créé ✓)

```
Username: cheikhfall7
Password: Nazim@2207
Email: admin@adisa.local
Role: admin
```

L'admin peut:
- Inviter des utilisateurs
- Voir tous les comptes
- Accéder à tous les audits
- Gérer les organisations

### API Routes

#### Public Routes
- `POST /api/login` - Login username/password
- `POST /api/register` - Register with invitation token
- `GET /api/invitation/validate/:token` - Validate invitation token

#### Authenticated Routes
- `GET /api/auth/check` - Check authentication status
- `GET /api/auth/user` - Get current user profile
- `GET /api/logout` - Logout
- `POST /api/2fa/generate` - Generate 2FA secret
- `POST /api/2fa/verify` - Verify and enable 2FA
- `POST /api/2fa/authenticate` - Authenticate with 2FA code
- `GET /api/organization` - Get user organization
- `POST /api/organization` - Create/update organization

#### Admin Only Routes
- `POST /api/admin/invite` - Send invitation email
- `GET /api/admin/users` - List all users

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
- **Invitation System**: Only invited users can register
  - Email invitations sent automatically
  - Secure tokens (7-day expiration)
  - One-time use tokens
- **Two-Factor Authentication (2FA)**:
  - Mandatory for all users
  - Google Authenticator compatible
  - QR code generation
  - Time-based OTP (TOTP)
- **Role-Based Access Control**:
  - Admin: Full access, can invite users
  - User: Limited to own data and audits
- **Organization Management**:
  - Users can configure organization details
  - Sector, size, country information
- **Email Notifications**:
  - Invitation emails
  - Account notifications (via Replit Mail)
- User profile management
- Audit trail management (CRUD)
- Questions management (CRUD)
- Responsive design with Ant Design
- Session-based authentication with PostgreSQL

## Database Schema
The app uses PostgreSQL with the following tables:
- `users` - User profiles (id, username, email, password, role, 2FA fields, etc.)
- `invitations` - Invitation tokens (email, token, used, expires_at)
- `organizations` - Organization details (userId, name, sector, size, country)
- `sessions` - User session storage for authentication

## Deployment
The project is configured for Replit deployment with:
- Build command: `npm run build`
- Start command: `npm run start`
- Target: Autoscale (suitable for web apps)

## Recent Changes (October 28, 2025)

### 🚀 Major System Overhaul - Invitation System

- **Replaced Replit Auth** with custom invitation-only authentication
- **Implemented 2FA** mandatory for all users using OTPAuth
- **Created admin account**: cheikhfall7 (see credentials above)
- **Integrated Replit Mail** for automatic invitation emails
- **Database schema extended**:
  - Added user roles (admin/user)
  - Added invitation system tables
  - Added 2FA secret storage
  - Added organization management
- **Backend APIs implemented**:
  - Invitation system (generate, validate, register)
  - 2FA (generate QR, verify, authenticate)
  - Admin routes (invite users, list users)
  - Organization management
- **Email system**: Automatic invitation emails with branded templates
- **Security**: bcrypt password hashing, secure sessions, 2FA tokens
- **Documentation**: Complete implementation guide created (IMPLEMENTATION_GUIDE.md)

## Development Notes
- The frontend runs on port 5000
- The auth backend runs on port 4000
- API requests to `/api/*` are proxied from frontend to backend
- Both servers run concurrently during development
- Environment variables are automatically configured by Replit