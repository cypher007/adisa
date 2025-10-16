# Authentication Routes Documentation

## Overview
This application uses **Replit Auth** with **OpenID Connect** for authentication. Multiple authentication flows are available through different API endpoints.

## Backend API Routes

### Login Routes

#### Standard Login
```
GET /api/login
```
- **Purpose**: Standard user login
- **OpenID Prompt**: `login`
- **Scopes**: `openid`, `email`, `profile`, `offline_access`
- **Use Case**: Regular user sign-in

#### OpenID Login with Consent
```
GET /api/login/openid
```
- **Purpose**: Login with explicit user consent
- **OpenID Prompt**: `consent`
- **Scopes**: `openid`, `email`, `profile`, `offline_access`
- **Use Case**: When you need explicit consent from users

### Registration Routes

#### User Registration
```
GET /api/register
```
- **Purpose**: New user registration
- **OpenID Prompt**: `select_account`
- **Scopes**: `openid`, `email`, `profile`, `offline_access`
- **Use Case**: Sign up new users

### Password Recovery Routes

#### Forgot Password
```
GET /api/forgot-password
```
- **Purpose**: Password reset flow
- **OpenID Prompt**: `login`
- **Scopes**: `openid`, `email`, `profile`, `offline_access`
- **Use Case**: Password recovery

### Session Management Routes

#### Logout
```
GET /api/logout
```
- **Purpose**: Sign out user and clear session
- **Action**: Destroys session and redirects to Replit Auth logout

#### OAuth Callback
```
GET /api/callback
```
- **Purpose**: OAuth callback handler (internal use)
- **Action**: Processes authentication response and creates session

### User Information Routes

#### Check Authentication
```
GET /api/auth/check
```
- **Purpose**: Check if user is authenticated
- **Returns**: `200 OK` if authenticated, `401 Unauthorized` if not

#### Get User Profile
```
GET /api/auth/user
```
- **Purpose**: Get current user information
- **Returns**: User object with `id`, `email`, `firstName`, `lastName`, `profileImageUrl`
- **Requires**: Active authenticated session

## Frontend Routes

### Authentication Pages

#### Login Page
```
/login
```
- Auto-redirects to `/api/login`
- Displays "Redirecting to login..." message

#### Registration Page
```
/register
```
- Auto-redirects to `/api/register`
- Displays "Redirecting to registration..." message

#### Forgot Password Page
```
/forgot-password
```
- Auto-redirects to `/api/forgot-password`
- Displays "Redirecting to password reset..." message

#### Enhanced Login Page (Optional)
```
/login-enhanced
```
- Beautiful UI with multiple login options
- Buttons for:
  - Standard Sign In
  - OpenID Sign In
  - Create Account
  - Forgot Password

## Authentication Flow

### Standard Login Flow
1. User visits `/login` or clicks login button
2. Frontend redirects to `/api/login`
3. Backend initiates OpenID Connect flow with Replit Auth
4. User authenticates with Replit (Google, GitHub, X, Apple, or email/password)
5. Replit redirects back to `/api/callback`
6. Backend creates session and stores user in PostgreSQL
7. User is redirected to `/` (dashboard)

### Registration Flow
1. User visits `/register` or clicks "Create Account"
2. Frontend redirects to `/api/register`
3. Backend initiates OpenID Connect with `select_account` prompt
4. User creates new account or selects existing account
5. Callback processes authentication
6. User profile is created in database
7. User is redirected to dashboard

### Password Recovery Flow
1. User visits `/forgot-password` or clicks "Forgot Password?"
2. Frontend redirects to `/api/forgot-password`
3. Backend initiates OpenID Connect flow
4. User resets password through Replit Auth
5. User is redirected back after password reset

## Refine Auth Provider Methods

The custom auth provider implements:

- **`login()`** - Redirects to `/api/login`
- **`register()`** - Redirects to `/api/register`
- **`forgotPassword()`** - Redirects to `/api/forgot-password`
- **`logout()`** - Redirects to `/api/logout`
- **`check()`** - Calls `/api/auth/check` to verify authentication
- **`getIdentity()`** - Calls `/api/auth/user` to get user profile

## Session Management

- Sessions are stored in PostgreSQL using `connect-pg-simple`
- Session cookie is HTTP-only and secure
- Sessions include OAuth tokens for API access
- Automatic token refresh using refresh tokens
- Session expiry is managed automatically

## Security Features

- **OpenID Connect**: Industry-standard authentication protocol
- **Secure Sessions**: HTTP-only cookies with secure flags
- **Token Refresh**: Automatic refresh token handling
- **PostgreSQL Storage**: Secure session storage
- **CSRF Protection**: Session-based CSRF protection
- **Multiple Auth Providers**: Google, GitHub, X, Apple, Email/Password

## Customization

To customize authentication:

1. **Change Login Page Appearance**: Edit `src/pages/login-enhanced.tsx`
2. **Modify Auth Flow**: Edit `server/replitAuth.ts`
3. **Add Custom Scopes**: Update scope arrays in auth routes
4. **Change Prompts**: Modify `prompt` parameter in authentication calls

## Testing Authentication

1. Visit your app at the Replit URL
2. You'll be automatically redirected to login
3. Choose your authentication method (Google, GitHub, etc.)
4. After successful authentication, you'll be redirected to the dashboard
5. Your user profile will be automatically created in the database

## Troubleshooting

**Problem**: "Unknown authentication strategy" error
- **Solution**: Ensure `REPLIT_DOMAINS` environment variable is set correctly

**Problem**: User not logged in after callback
- **Solution**: Check that sessions table exists in PostgreSQL
- Run `npm run db:push` to create tables

**Problem**: Token expired errors
- **Solution**: Refresh tokens are handled automatically, check that refresh_token is stored in session

**Problem**: Can't access protected routes
- **Solution**: Verify that `/api/auth/check` returns `200 OK` when authenticated
