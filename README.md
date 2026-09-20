# EstateSocial Pakistan

> A social-first property marketplace built for Pakistani real estate dynamics.

---

## Overview

**EstateSocial Pakistan** is a web-based property marketplace that connects property buyers, direct owners, real estate agents, and agencies across Pakistan. The platform blends traditional property listings with social creator profiles (`/@username`), direct WhatsApp lead communication, category-specific Pakistani property attributes, and an administrative identity verification workflow.

---

## Core Features

- **Property Marketplace**: Browse active residential, commercial, plot, and agricultural listings across major Pakistani cities (Lahore, Karachi, Islamabad, Rawalpindi, Peshawar, Faisalabad, etc.).
- **Localized Property Categories**: Custom attribute schemas for Houses, Commercial Plazas, Residential/Commercial Plots, Apartments, and Farmhouses.
- **Search & Multi-Filter Engine**: Filter by city, society/location, price range (PKR Lakh/Crore), area size (Marla/Kanal/Sq. Yd.), property type, and purpose (Sale/Rent).
- **Social Creator Profiles (`/@username`)**: Dedicated public profiles for real estate agents and direct owners with contact information, portfolio counts, video tour embeds (YouTube/TikTok), and social handles.
- **Direct WhatsApp Lead Flow**: One-click WhatsApp contact buttons pre-filled with property title, price, and inquiry details formatted for Pakistani mobile numbers (`+923xx`).
- **Authentication & RBAC**: Role-based access control supporting `buyer`, `agent`, `owner`, and `admin` roles with JWT authentication and bcrypt password encryption.
- **Identity & KYC Submission Workflow**: Authenticated users can submit CNIC numbers, FBR NTN registration data, and authority certificates for administrative review.
- **Admin Moderation Console**: Protected administration queue for reviewing identity verification requests, moderating listings, and viewing platform statistics.
- **Responsive & PWA Ready**: Mobile-optimized layouts, service worker caching, and installable web app manifest.

---

## Pakistan-Specific Experience

- **Units of Measure**: Native support for Marla, Kanal, Square Feet, and Square Yards with built-in area converters.
- **Currency Formatting**: Automatic price formatting in Pakistani Rupees (PKR), Lakhs (`Lac`), and Crores (`Arab`).
- **Localized Property Attributes**:
  - *Commercial*: Rental income yield, total floors, road width exposure, standby generator power backup.
  - *Residential*: Servant quarters, dirty/clean kitchens, solar net metering, car parking capacity.
  - *Plots*: Corner, Main Boulevard, Park facing, possession status.
  - *Apartments*: Floor level, view orientation, dedicated parking slots.
- **Society & Location Selectors**: Coverage for DHA, Bahria Town, Gulberg, CDA Sectors, Clifton, Emaar Oceanfront, and other major developments.

---

## Tech Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 8
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Icons & UI**: Lucide React
- **SEO & Meta**: React Helmet Async

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (REST API)
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **Security Middleware**: Helmet, HPP, express-mongo-sanitize, express-rate-limit
- **Media Uploads**: Multer (Local storage fallback / Cloudinary integration)

---

## Architecture

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

---

## Repository Structure

```
estate-social/
├── client/
│   ├── public/              # Static assets, icons, manifest
│   ├── src/
│   │   ├── api/             # Axios instance & interceptors
│   │   ├── components/      # Reusable UI & layout components
│   │   ├── pages/           # Application views & routed pages
│   │   ├── redux/           # Redux slices and store configuration
│   │   └── utils/           # Formatters, constants, calculations
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/              # Database connection & seed definitions
│   ├── controllers/         # REST API business logic
│   ├── middleware/          # Auth, role check, error handling, rate limiting
│   ├── models/              # Mongoose schemas (User, Listing, Inquiry, etc.)
│   ├── routes/              # Express API route declarations
│   ├── scripts/             # Dev seeding & admin bootstrap utilities
│   ├── test-hardening.js    # Comprehensive automated test suite
│   ├── index.js             # API entrypoint & middleware pipeline
│   └── package.json
│
├── .gitignore
├── .env.example
└── README.md
```

---

## Local Development

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB instance (local or MongoDB Atlas connection URI)

### 1. Backend Setup

```bash
cd server
npm install
cp .env.example .env
```

Configure `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/estate-marketplace
JWT_SECRET=your_local_development_secret_key_123
ALLOW_MEMORY_DB=true
```

Start the backend server:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd ../client
npm install
cp .env.example .env
```

Start the frontend development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## Testing

Run the automated hardening and verification suite:

```bash
cd server
ALLOW_MEMORY_DB=true npm test
```

### Test Coverage:
- **Authentication**: Missing, malformed, and tampered JWT token rejection.
- **Mass Assignment Defense**: Protection against self-assigning `role`, `verified`, and `kycStatus`.
- **IDOR Protection**: Authorization barriers preventing unauthorized updates or deletions of listings.
- **Data Privacy**: Public user profiles strictly exclude CNIC, NTN, passwords, and KYC attachments.
- **Input Security**: ReDoS regex sanitization, malformed MongoDB ObjectId safety, and bounded pagination.

---

## Production Architecture

The application is structured for standard cloud platform deployment:

- **Frontend**: Static SPA hosted on [Vercel](https://vercel.com)
- **Backend API**: Containerized / Node web service hosted on [Render](https://render.com)
- **Database**: Cloud database hosted on [MongoDB Atlas](https://www.mongodb.com/atlas)

> **Note**: Deployment URLs are provider-generated upon provisioning (e.g. `https://<app>.vercel.app` and `https://<api>.onrender.com`). No custom domain is currently configured.

---

## Security Controls

- **Fail-Fast Database Mode**: In `NODE_ENV=production`, the server halts immediately (`process.exit(1)`) if the MongoDB connection is unavailable. In-memory databases are strictly disabled.
- **Protected Secrets**: In production, startup halts if `JWT_SECRET` is missing, short, or matches insecure default strings.
- **Strict Privacy Projections**: Public API endpoints explicitly select non-sensitive fields (`PUBLIC_AGENT_FIELDS`), keeping identity documents private to moderators.
- **Rate Limiting**: Targeted rate limiting applied to authentication, KYC submissions, and general marketplace queries.

---

## Version 1 Status

Version 1 feature scope is complete and validated for deployment.

---

## License

ISC License. See `server/package.json` for details.
