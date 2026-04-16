# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sunningdale Tech Ltd corporate website - a full-stack React application with Express backend, featuring a public-facing corporate site and an admin portal for managing content, jobs, events, and HR workflows.

**Tech Stack:**
- Frontend: React 19 + Vite + TailwindCSS 4 + Framer Motion
- Backend: Express 5 + Node.js
- Database: Supabase (PostgreSQL)
- Auth: JWT + Azure AD (MSAL) integration
- Cloud: AWS S3 (resume storage), AWS Bedrock (AI resume analysis)

## Development Commands

```bash
# Development (runs both backend and frontend concurrently)
npm run dev

# Development with network access (accessible on LAN)
npm run dev:host

# Backend only
npm run server
npm start

# Frontend only
npx vite

# Build for production
npm run build

# Lint
npm run lint

# Preview production build
npm preview
```

## Architecture

### Frontend Structure

The application uses a **Context-based architecture** with multiple React contexts providing state management:

- **AuthContext** (`src/context/AuthContext.jsx`): Handles authentication via JWT tokens and Azure AD MSAL. Manages users, role-based permissions, and login/logout. Permissions are stored in Supabase and loaded dynamically.
- **ContentContext** (`src/context/ContentContext.jsx`): Manages editable content for the public site (currently uses localStorage, can be migrated to backend).
- **JobContext** (`src/context/JobContext.jsx`): Manages job postings, applications, and CRUD operations via Supabase.
- **EventContext** (`src/context/EventContext.jsx`): Manages company events.
- **LanguageContext**: Internationalization support.

### Backend Architecture (server.js)

The backend is a **monolithic Express server** (~3000 lines) handling:

1. **Authentication & Authorization**
   - JWT token-based auth with bcrypt password hashing
   - Azure AD MSAL integration for SSO
   - `authenticateToken` middleware for protected routes
   - Role-based access control (super_admin, site_admin, hr_user, marketing, hr)

2. **Core API Routes**
   - `/api/auth/*` - Login, Azure auth, session verification
   - `/api/users/*` - User management (CRUD)
   - `/api/contact` - Contact form submissions
   - `/api/events/*` - Event management
   - `/api/applications/*` - Job application management
   - `/api/schedule-interview` - Interview scheduling
   - `/api/book-interview` - Interview booking by candidates

3. **HR Workflow Features**
   - Resume analysis using AWS Bedrock (AI-powered)
   - Interview scheduling with Exchange calendar integration
   - Onboarding/offboarding workflows with Power Automate integration
   - Active Directory provisioning endpoints

4. **Integrations**
   - **Exchange Calendar** via Graph API for room booking
   - **Power Automate** for HR workflow automation
   - **AWS Bedrock** for resume analysis
   - **Supabase** for database and file storage
   - **Nodemailer** for email notifications

### Database (Supabase)

Key tables (see `migrations/` directory):
- `users` - Admin users with role-based permissions
- `jobs` - Job postings with soft delete support
- `applications` - Job applications with resume storage
- `interview_slots` - Interview availability and bookings
- `role_permissions` - Dynamic role-permission mappings (JSONB)
- `page_views` - Analytics tracking
- `locations` - Global office locations
- `audit_logs` - Security audit trail

### Security Features

- **CORS whitelist** for production origins (configurable in `server.js`)
- **Content Security Policy (CSP)** headers
- **TLS 1.2+ enforcement**
- **JWT token authentication** for admin routes
- **Row-level security (RLS)** on Supabase tables
- **File upload validation** (PDF, DOCX only for resumes)
- **Audit logging** for sensitive operations

### Routing

**Public Routes** (wrapped in `<Layout>`):
- Home, About, Business, Capabilities, Careers, Contact
- Job listings and details (`/careers/job-opportunities/:id`)
- Interview booking (`/schedule/:applicationId`)
- Candidate onboarding (`/onboarding/:applicationId`)

**Admin Routes** (wrapped in `<ProtectedRoute>`):
- Dashboard, Content Editor, Analytics, Job Manager, Event Manager, User Manager, Settings
- All under `/admin/*` prefix

### State Management Pattern

The app uses **React Context + Supabase** for real-time state:
1. Context providers wrap the entire app in `App.jsx`
2. Contexts expose CRUD functions that update both local state and Supabase
3. Authentication state persists in localStorage + JWT tokens
4. Admin permissions are dynamically loaded from Supabase on login

## Important Notes

### Environment Variables

Required variables (see `.env.example`):
- **SMTP_*** - Email configuration (Office 365)
- **AWS_*** - AWS credentials for S3 and Bedrock
- **SUPABASE_*** - Database connection
- **AZURE_*** - Azure AD configuration for SSO
- **POWER_AUTOMATE_WORKFLOW_URL** - HR workflow integration
- **VITE_*** - Frontend environment variables (exposed to client)

### API Proxy Configuration

Vite dev server proxies `/api/*` requests to `http://localhost:3000` (see `vite.config.js`). In production, the Express server serves the built React app as static files.

### Authentication Flow

1. User logs in via `/admin/login` with username/password OR Azure AD MSAL
2. Server validates credentials and returns JWT token
3. Token stored in localStorage and sent in `Authorization: Bearer <token>` header
4. `authenticateToken` middleware verifies JWT on protected routes
5. User object stored in localStorage for fast hydration

### File Uploads

Resumes are uploaded via `multer` middleware to temporary storage, then uploaded to Supabase Storage bucket. URLs are stored in the database.

### Role Permissions

Roles and their allowed routes are stored in Supabase `role_permissions` table as JSONB. The `AuthContext` loads and caches permissions on mount. Admins can modify permissions via Settings page.

### AI Resume Analysis

The `/api/generate-questions/:id` endpoint uses AWS Bedrock (Claude model) to analyze candidate resumes and generate interview questions. Requires resume text extraction (PDF/DOCX parsing).

### Migrations

SQL migrations are in `migrations/` directory. Apply manually to Supabase via SQL editor or CLI.

## Development Workflow

1. **Start development**: `npm run dev` (runs backend + frontend concurrently)
2. **Environment setup**: Copy `.env.example` to `.env` and fill in credentials
3. **Database setup**: Run migrations in `migrations/` folder against Supabase
4. **Test auth**: Create a test admin user in Supabase `users` table (password must be bcrypt hashed)
5. **Admin portal**: Navigate to `https://localhost:5173/admin/login`

## Code Style

- ESLint configured with React hooks and React Refresh plugins
- TailwindCSS 4 with Vite plugin for styling
- Unused variables starting with uppercase or underscore are ignored by linter
- Component structure: Context Providers → Layout → Pages → Components
