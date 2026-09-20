# EstateSocial Pakistan

> A social-first MERN property marketplace built around Pakistani real-estate workflows.

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Build Status](https://img.shields.io/badge/Build-Passing-emerald)](https://github.com/MAhsaanUllah/estate-social)

---

![EstateSocial Pakistan Marketplace](docs/screenshots/marketplace.png)

---

## Overview

**EstateSocial Pakistan** is a full-stack real-estate web application connecting property buyers, direct owners, agents, and agencies across Pakistan. The platform bridges the gap between conventional property listing boards and modern social discovery by combining category-specific real estate schemas, public creator profiles (`/@username`), direct WhatsApp lead generation, and an administrative verification review workflow.

The application is structured to address the specific domain realities of Pakistani real estate: handling localized area measurements (Marla, Kanal, Sq. Yd.), currency scales (PKR Lakh and Crore), society-specific taxonomy (DHA, Bahria Town, Gulberg, CDA Sectors), and direct owner 0% commission deals alongside verified agency stock.

---

## Why I Built This

I built EstateSocial as a comprehensive, end-to-end capstone project to move beyond isolated tutorial exercises and build a complete, resilient MERN application from scratch. My goal was to engineer the full lifecycle of a production-style web service: designing domain-driven Mongoose schemas, structuring Redux state management across multi-step user journeys, implementing server-side role-based access controls and IDOR protection, handling sensitive data projection, writing automated adversarial API test suites, and preparing the architecture for cloud deployment.

---

## Product Walkthrough

*Screenshots below showcase the core interfaces across buyer, seller, and administrator flows.*

### 1. Marketplace Discovery & Filtering
![Marketplace Discovery](docs/screenshots/marketplace.png)
*Multi-parameter search engine supporting city, society, price range, area size, property category, and direct owner vs. agency filters.*

### 2. Property Details & Direct Contact
![Property Details View](docs/screenshots/property-details.png)
*Comprehensive listing breakdown featuring dynamic property specifications, photo gallery, installment plans, location map, and direct 1-click WhatsApp lead CTA.*

### 3. Dynamic Property Listing Creation
![Add Property Form](docs/screenshots/add-property.png)
*Context-aware listing creation form that adapts its fields based on selected property type (Commercial, House, Plot, Apartment, Farmhouse).*

### 4. Agent Creator Profile (`/@username`)
![Agent Creator Profile](docs/screenshots/agent-profile.png)
*Sharable social profile for verified realtors with active inventory, video tour embeds (YouTube/TikTok), deal metrics, and direct WhatsApp contact buttons.*

### 5. Owner & Agent CRM Dashboard
![User Dashboard](docs/screenshots/dashboard.png)
*Portfolio and inquiry management hub where users track received buyer leads, manage listing statuses, update profile settings, and submit identity verification documents.*

### 6. Admin Moderation & Verification Console
![Admin Console](docs/screenshots/admin-console.png)
*Restricted administrative portal for reviewing submitted CNIC and FBR NTN documentation, approving agent verification badges, and monitoring platform metrics.*

---

## Core Features

### 🏢 Marketplace & Discovery
- **Multi-Filter Search**: Filter by purpose (Sale/Rent), property type, city, society/phase, price boundaries, and area units.
- **Direct Owner Deals**: Dedicated filter to discover 100% direct-owner properties with zero broker commissions.
- **Interactive Calculators**: Integrated tools for Bank Home Loans (Meezan/HBL Islamic financing), Construction Cost estimations (Grey structure vs. Finishing), and Land Unit conversions.

### ✍️ Listing Management
- **Category-Aware Attributes**: Dynamic input fields that adjust depending on whether the listing is a Commercial Plaza, Residential Villa, Residential Plot, or Farmhouse.
- **Media Upload Pipeline**: Support for Cloudinary cloud hosting with local filesystem upload fallbacks and MIME/extension validation.
- **Listing Lifecycle**: Full CRUD capabilities with status tracking (`Active`, `UnderOffer`, `Sold`).

### 📱 Social Distribution
- **Custom Handle Routing**: Unique handle URLs (`/@username`) allowing agents to link their portfolio directly in their TikTok, Instagram, and YouTube bios.
- **One-Click WhatsApp Integration**: Auto-formats Pakistani phone numbers (`03xx` to `923xx`) and pre-populates inquiries with property title, price, and URL.

### 🛡️ Identity & Moderation
- **KYC Submission Workflow**: Authenticated users can submit CNIC numbers, FBR NTN registration numbers, and housing society member certificates for verification.
- **Admin Review Queue**: Role-guarded endpoints allowing administrators to inspect pending verifications, approve trust badges, or reject submissions with feedback.

---

## Pakistan-Specific Engineering

Modeling Pakistani real estate required addressing non-standard domain constraints:

### 1. Area Measurement System
Traditional international real estate software assumes Square Feet or Square Meters. Pakistani property transactions primarily operate on **Marla** and **Kanal**:
- **Marla variations**: 225 sq. ft. (standard LDA/commercial societies) vs. 272 sq. ft. (traditional revenue records).
- **Kanal**: Exactly 20 Marlas.
- **Square Yards (`Guz`)**: Commonly used for plots and residential land in Karachi and Sindh.

### 2. South Asian Currency Scale (`PKR`)
Instead of standard millions/billions formatting, Pakistani currency is displayed in **Lakh** and **Crore**:
$$\text{1 Lakh (Lac)} = 100,000 \text{ PKR } (10^5)$$
$$\text{1 Crore (Cr)} = 10,000,000 \text{ PKR } (10^7)$$
$$\text{1 Arab} = 1,000,000,000 \text{ PKR } (10^9)$$

The formatting engine dynamically converts raw integer prices into readable, localized denominations (e.g., `85000000` $\rightarrow$ `PKR 8.50 Cr`).

### 3. Specialized Property Schemas
Different property categories require distinct physical attributes:
- **Commercial Plazas**: Monthly rental income yield, total floors, road width exposure, standby generator power backup.
- **Residential Houses**: Servant quarters, dirty/clean kitchen separation, covered car porch capacity, solar net metering.
- **Plots & Land**: Corner plot status, Main Boulevard frontage, Park facing orientation, possession readiness.

---

## Engineering Highlights

```
┌─────────────────────────────────────────────────────────┐
│                     Client (React 18)                   │
│   Vite PWA • Redux Toolkit • React Router • Tailwind   │
└────────────────────────────┬────────────────────────────┘
                             │  HTTPS / REST API
┌────────────────────────────▼────────────────────────────┐
│                  Server (Express / Node.js)             │
│   JWT Auth • Rate Limiters • Sanitization • Controllers │
└────────────────────────────┬────────────────────────────┘
                             │  Mongoose ODM
┌────────────────────────────▼────────────────────────────┐
│                       MongoDB Atlas                     │
│    Users • Listings • Inquiries • Reviews • Favorites   │
└─────────────────────────────────────────────────────────┘
```

### 1. Dynamic Property Schema Modeling
Rather than forcing sparse or untyped structures, the Mongoose `Listing` schema models polymorphic property types with dedicated sub-attributes (e.g., `rentalIncome`, `roadWidth`, `powerBackup` for commercial; `kitchens`, `servantQuarters` for residential).

### 2. Strict IDOR Authorization
All mutating endpoints (`PUT /api/listings/:id`, `DELETE /api/listings/:id`) enforce server-side ownership checks:
```javascript
if (listing.creator.toString() !== req.user.id && req.user.role !== 'admin') {
  return res.status(403).json({ success: false, message: 'Unauthorized mutation' });
}
```

### 3. Public vs. Private Data Projections
To protect user privacy and prevent data harvesting, public agent endpoints (`GET /api/users/:id`, `GET /api/users/agents`) explicitly whitelist safe projection fields (`PUBLIC_AGENT_FIELDS`). Sensitive identity fields (`cnic`, `ntn`, `kycData`, `password`) are set to `select: false` at the schema level and are only accessible by the owner or authenticated administrators.

### 4. Query Boundary Enforcement & ReDoS Protection
- Pagination query parameters are strictly bounded on the backend (`limit = Math.min(50, Math.max(1, limit))`) to prevent memory exhaustion attacks.
- Search filters sanitize user input through regex escaping (`escapeRegex`) before executing MongoDB queries to neutralize ReDoS (Regular Expression Denial of Service) and operator injection attempts.

### 5. Fail-Fast Production Database Mode
When `NODE_ENV=production`, the database configuration disables in-memory fallbacks and halts process execution immediately (`process.exit(1)`) upon connection failure, preventing data loss or silent persistence degradation.

---

## Tech Stack

### Frontend
- **React 18** — Component-driven user interface
- **Vite 8** — Optimized build tooling and Hot Module Replacement
- **Redux Toolkit** — Global state management for authentication, listings, inquiries, and favorites
- **React Router v6** — Client-side routing with route guards (`ProtectedRoute`, `AgentRoute`)
- **Tailwind CSS** — Utility-first styling with standardized 60-30-10 color hierarchy
- **Lucide React** — Consistent icon set
- **React Helmet Async** — Dynamic document titles and OpenGraph meta tags
- **Vite PWA Plugin** — Service worker caching and web application manifest

### Backend
- **Node.js & Express.js** — Modular REST API with centralized error handling middleware
- **MongoDB & Mongoose 8** — NoSQL database with schema validations, indexes, and aggregation pipelines
- **JSON Web Tokens (JWT)** — Stateless authentication via authorization headers and HTTP-only cookies
- **bcryptjs** — Salted password hashing (cost factor 12)
- **Security Middleware**: `helmet` (HTTP header hardening), `express-mongo-sanitize` (NoSQL injection defense), `hpp` (parameter pollution prevention), `express-rate-limit` (endpoint throttling)
- **Multer** — Multipart file upload processing

---

## Project Structure

```
estate-social/
├── client/
│   ├── public/              # Static assets, icons, manifest.webmanifest
│   ├── src/
│   │   ├── api/             # Axios instance & request/response interceptors
│   │   ├── components/      # Reusable UI (Button, Input, FeedCard, Navbar, Modals)
│   │   ├── context/         # ThemeContext (Default light theme)
│   │   ├── pages/           # Routed page views (Landing, Feed, ListingDetails, Dashboard, Admin)
│   │   ├── redux/           # Redux slices (authSlice, listingSlice, inquirySlice, favoriteSlice)
│   │   └── utils/           # Formatters (PKR currency, area units, WhatsApp links)
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/              # MongoDB connection (db.js) & Cloudinary storage
│   ├── controllers/         # API controllers (auth, listing, inquiry, review, valuation)
│   ├── middleware/          # authMiddleware, errorMiddleware, rateLimiters
│   ├── models/              # Mongoose schemas (User, Listing, Inquiry, Review, Favorite)
│   ├── routes/              # Express route declarations
│   ├── scripts/             # bootstrapAdmin.js, seedDev.js
│   ├── test-hardening.js    # Comprehensive automated test suite
│   ├── index.js             # Server entrypoint
│   └── package.json
│
├── docs/
│   └── screenshots/         # Application interface walkthrough screenshots
├── .env.example
├── .gitignore
└── README.md
```

---

## Security Practices

EstateSocial implements defense-in-depth security controls across the stack:

- **Authentication & Token Integrity**: Custom JWT validation rejecting missing, expired, malformed, or tampered tokens.
- **Mass-Assignment Defense**: Explicit field whitelisting on registration and profile updates, stripping protected fields (`role`, `verified`, `kycStatus`, `kycData`).
- **Targeted Rate Limiting**: Dedicated rate limiters on authentication endpoints (20 req/15 min) and KYC submission endpoints (10 req/15 min).
- **NoSQL Injection Sanitization**: Stripping `$` and `.` operators from request payloads using `express-mongo-sanitize`.
- **Safe External Link Generation**: Strict protocol validation (`http://`, `https://`) for user-submitted social media links and normalized WhatsApp URL generation (`https://wa.me/923XXXXXXXXX`).

> *Note: These controls reflect standard web development security practices to mitigate common OWASP Top 10 risks, but do not represent a formal third-party security certification.*

---

## Testing

The backend includes a comprehensive, standalone automated test suite (`server/test-hardening.js`) designed to verify critical business logic and security boundaries without relying on external test frameworks.

To execute the test suite:

```bash
cd server
ALLOW_MEMORY_DB=true npm test
```

### Verified Test Results (27 Passed | 0 Failed)

```
======================================================
🛡️  ESTATESOCIAL V1 — PRODUCTION HARDENING SUITE
======================================================

--- Phase 1: API & Server Readiness ---
  ✅ [PASS] API is online and responds to /api/health

--- Phase 2: Authentication & Attack Tests ---
  ✅ [PASS] Missing JWT returns 401 Unauthorized
  ✅ [PASS] Malformed JWT returns 401 Unauthorized
  ✅ [PASS] Tampered JWT returns 401 Unauthorized
  ✅ [PASS] Invalid credentials returns 401

--- Phase 3: Registration & Mass Assignment Defense ---
  ✅ [PASS] Registering with reserved username "admin" is blocked
  ✅ [PASS] Self-assigning admin role in registration is neutralized to non-admin
  ✅ [PASS] User A registers successfully with unique handle
  ✅ [PASS] User B registers successfully
  ✅ [PASS] Profile update mass-assignment ignores protected fields (verified/kycStatus/role)

--- Phase 4: IDOR / Access Control Matrix ---
  ✅ [PASS] User A creates property listing (isFeatured self-assignment stripped to false)
  ✅ [PASS] IDOR Attack: User B cannot modify User A listing (403 Forbidden)
  ✅ [PASS] IDOR Attack: User B cannot delete User A listing (403 Forbidden)
  ✅ [PASS] Legitimate Owner: User A can update their own listing

--- Phase 5: KYC Verification & Admin Security ---
  ✅ [PASS] Non-admin cannot access Admin KYC queue (403 Forbidden)
  ✅ [PASS] User submits KYC documents (enters Pending state, verified=false)
  ✅ [PASS] Non-admin cannot approve KYC verifications (403 Forbidden)

--- Phase 6: Public Data Privacy & Leakage Audit ---
  ✅ [PASS] Public profile lookup succeeds
  ✅ [PASS] Privacy: Password hash is absent from public profile
  ✅ [PASS] Privacy: Sensitive kycData / CNIC is absent from public profile
  ✅ [PASS] Public listing details query succeeds
  ✅ [PASS] Privacy: Creator sub-document does NOT leak kycData or password

--- Phase 7: Input Security & Boundary Checks ---
  ✅ [PASS] Malformed ObjectId does not trigger 500 error (returns 404 safely)
  ✅ [PASS] Non-existent ObjectId returns 404 cleanly
  ✅ [PASS] Pagination limit is safely bounded (capped at 50 max)
  ✅ [PASS] Regex search parameters are escaped without crashing the query

--- Phase 8: Cleanup & Legitimate Deletion ---
  ✅ [PASS] Legitimate Owner: User A can delete their own listing

======================================================
🎯 HARDENING TEST SUMMARY: 27 PASSED | 0 FAILED
======================================================
```

---

## Local Development

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB (local service or MongoDB Atlas connection string)

### 1. Backend Setup

Open your backend terminal:

```bash
cd server
npm install
cp .env.example .env
```

Configure your `server/.env` variables:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/estate-marketplace
JWT_SECRET=your_local_development_jwt_secret_key_32_characters
CORS_ORIGIN=http://localhost:5173
ALLOW_MEMORY_DB=true
```

Start the API server:
```bash
npm run dev
```

*(Optional) To seed realistic Pakistani development fixtures (verified agents and properties):*
```bash
npm run seed:dev
```

*(Optional) To bootstrap an administrator account:*
```bash
BOOTSTRAP_ADMIN_EMAIL=admin@example.com BOOTSTRAP_ADMIN_PASSWORD=SecureAdminPassword123! npm run bootstrap:admin
```

### 2. Frontend Setup

Open your frontend terminal:

```bash
cd client
npm install
cp .env.example .env
```

Start the Vite development server:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Deployment

The repository is structured for standard separation of concerns across cloud providers:

- **Frontend**: [Vercel](https://vercel.com) (Static SPA build via `npm run build` in `client/`)
- **Backend API**: [Render](https://render.com) (Web service running `npm start` in `server/`)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) (Managed cloud cluster)

> **Deployment Note**: No custom domain is currently configured. Public deployment URLs will be provider-generated (e.g. `https://<app>.vercel.app` and `https://<api>.onrender.com`).

---

## What I Learned

Building EstateSocial end-to-end provided practical full-stack software engineering experience:

- **Architectural Boundary Separation**: Designing clean contracts between a client-side single page app (SPA) and an Express REST API with centralized middleware.
- **Domain Modeling with Mongoose**: Structuring complex data models with compound indexes, virtuals, pre-save middleware hooks, and polymorphic category fields.
- **Predictable State Management**: Implementing asynchronous Redux Toolkit thunks, slice reducers, and optimistic UI updates for favorites and inquiries.
- **Security Engineering**: Implementing practical defenses against IDOR, NoSQL operator injection, mass-assignment vulnerabilities, and Cross-Site Scripting (XSS).
- **Adversarial Test Writing**: Constructing automated HTTP test harnesses that simulate hostile user requests and boundary edge cases.
- **Environment & Lifecycle Management**: Managing development, testing, and production configuration modes with strict database persistence guarantees.

---

## Future Direction

Planned enhancements for future iterations:
- **Direct S3 / Azure Blob Document Storage**: Encrypted bucket storage for private KYC identity documents.
- **Agency Subscription Plans**: Stripe / local payment gateway integration for premium agency branding and featured listing slots.
- **Real-Time Messaging**: Socket.io integration for instant buyer-agent chat alongside WhatsApp lead flows.
- **Automated NADRA / FBR API Integration**: Automated tax filer and identity verification lookups.

---

## License

Root `LICENSE` file is currently unassigned; license choice will be confirmed prior to public open-source distribution. See `server/package.json` for internal dependency metadata.
