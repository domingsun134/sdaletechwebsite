# Security Configuration Guide

This document outlines the security features implemented in the Sunningdale Tech website and provides guidance for maintaining and improving security.

## Current Security Features

### 1. Content Security Policy (CSP)

The application implements a strict Content Security Policy with the following directives:

#### Script Sources
- `'self'` - Only scripts from the same origin
- `'nonce-{random}'` - Cryptographic nonce for inline scripts (generated per request)
- `https://www.googletagmanager.com` - Google Analytics
- `https://www.google-analytics.com` - Google Analytics
- `https://plausible.io` - Plausible Analytics

#### Style Sources
- `'self'` - Styles from same origin
- `'nonce-{random}'` - Cryptographic nonce for inline styles
- `'unsafe-inline'` - **Fallback only** for older browsers (modern browsers ignore this when nonce is present)
- `https://fonts.googleapis.com` - Google Fonts

#### Additional Protections
- `object-src 'none'` - Blocks plugins (Flash, Java, etc.)
- `base-uri 'self'` - Prevents base tag injection
- `form-action 'self'` - Restricts form submissions to same origin
- `frame-ancestors 'none'` - Prevents clickjacking (site cannot be framed)
- `upgrade-insecure-requests` - Forces HTTPS for all resources

### 2. CORS Configuration

**Whitelist-based CORS** allows requests only from:
- `https://test.sdaletech.com`
- `https://www.sdaletech.com`
- `https://sdaletech.com`
- `http://localhost:5173` (development only)

### 3. Security Headers

The following headers are set on all responses:

```
Content-Security-Policy: (see CSP section above)
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### 4. Authentication & Authorization

- **JWT tokens** with bcrypt password hashing
- **Azure AD MSAL** integration for Single Sign-On
- **Token-based authentication** for all admin routes
- **Role-based access control** (RBAC) with 6 roles:
  - `super_admin` - Full system access including Settings
  - `site_admin` - All admin functions except Settings
  - `hr_user` - Dashboard, Content, Jobs, Events
  - `admin` - Same as super_admin
  - `marketing` - Dashboard, Content, Analytics, Events
  - `hr` - Dashboard, Content, Jobs, Events

### 5. TLS Configuration

- **TLS 1.2+ enforced** (TLS 1.0 and 1.1 disabled)
- HSTS enabled with 1-year max-age and preload directive

### 6. Input Validation & Sanitization

- **File upload restrictions**: Only PDF and DOCX allowed for resumes
- **JSON payload validation** on all POST/PUT endpoints
- **Multer middleware** for secure multipart form handling

### 7. Audit Logging

All sensitive operations are logged to the `audit_logs` table:
- User creation, updates, deletions
- Login attempts (success/failure)
- Role permission changes
- Job application status changes

### 8. Database Security (Supabase)

- **Row-Level Security (RLS)** enabled on all tables
- **Service role key** used server-side only (not exposed to client)
- **Anon key** with limited permissions for public API access

## Known Security Limitations

### 1. 'unsafe-inline' in CSP (MITIGATED)

**Status**: ✅ **Partially Mitigated**

The application uses `'unsafe-inline'` in `style-src` as a fallback for older browsers. Modern browsers that support CSP nonces will ignore this directive and only allow styles with the correct nonce.

**Why it exists**: React + TailwindCSS generate dynamic inline styles at runtime.

**Mitigation**:
- Nonces are generated per request (16 bytes of cryptographic randomness)
- Nonces are injected into all `<style>` and `<script>` tags in the HTML
- Modern browsers prioritize nonces over `'unsafe-inline'`

**Future improvement**: Migrate to CSS-in-JS solutions that support CSP nonces natively (e.g., Emotion, styled-components with CSP plugins).

### 2. Third-Party Script Dependencies

**Status**: ⚠️ **Requires Monitoring**

The application loads scripts from:
- Google Analytics (gtag.js)
- Plausible Analytics
- Azure AD MSAL

**Risk**: If these third-party domains are compromised, malicious scripts could be served.

**Mitigation**:
- All third-party scripts are loaded via HTTPS
- Consider implementing Subresource Integrity (SRI) hashes for CDN scripts
- Regularly audit third-party dependencies

### 3. Resume File Storage

**Status**: ✅ **Secure**

- Resumes are stored in Supabase Storage (private bucket)
- Presigned URLs are generated server-side with short expiration
- File type validation prevents executable uploads
- No direct public access to storage bucket

## Security Checklist for Deployment

Before deploying to production, ensure:

- [ ] All environment variables are set (see `.env.example`)
- [ ] `NODE_ENV=production` is set
- [ ] CORS whitelist only includes production domains
- [ ] TLS certificates are valid and auto-renewing
- [ ] Database credentials use service role key (not exposed to client)
- [ ] AWS credentials have minimal IAM permissions (S3 + Bedrock only)
- [ ] SMTP credentials are rotated regularly
- [ ] Azure AD app registration is restricted to company tenant
- [ ] Supabase RLS policies are enabled on all tables
- [ ] Audit logs are being monitored

## Monitoring & Incident Response

### Security Monitoring Tools

- **SecurityScorecard**: Continuous external security scanning
- **Supabase Logs**: Database access logs
- **Server Logs**: `server.log` file contains all console output
- **Audit Logs**: Database table tracking admin actions

### Incident Response Plan

1. **Detection**: Monitor SecurityScorecard alerts and server logs
2. **Containment**:
   - Revoke compromised JWT tokens (clear `localStorage` on client)
   - Rotate database credentials
   - Temporarily disable affected admin accounts
3. **Investigation**: Review audit logs and server logs
4. **Recovery**: Apply security patches and redeploy
5. **Post-Incident**: Update this document with lessons learned

## Security Updates & Maintenance

### Regular Tasks

- **Weekly**: Review SecurityScorecard reports
- **Monthly**:
  - Update npm dependencies (`npm audit fix`)
  - Review Supabase RLS policies
  - Rotate SMTP credentials
- **Quarterly**:
  - Penetration testing
  - Security training for developers
  - Review and update CORS whitelist
  - Audit third-party integrations

### Security Contact

For security issues or questions, contact:
- **Email**: [security contact email]
- **Internal**: IT Security Team

## Compliance

This application handles:
- **Personal Data**: Candidate resumes, contact information
- **Employment Data**: Job applications, onboarding forms

**Compliance Requirements**:
- GDPR (General Data Protection Regulation) - for EU candidates
- PDPA (Personal Data Protection Act) - for Singapore operations

**Data Retention**:
- Job applications: Retained for 1 year, then soft-deleted
- Audit logs: Retained indefinitely (consider archiving after 2 years)
- Resumes: Deleted when associated application is deleted

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Web Security](https://developer.mozilla.org/en-US/docs/Web/Security)
- [CSP Evaluator](https://csp-evaluator.withgoogle.com/)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/platform/going-into-prod#security)

---

**Last Updated**: March 2026
**Version**: 1.0
