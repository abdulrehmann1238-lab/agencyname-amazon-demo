# AUREL — Amazon Agency Operating System

> **Every brand. Every marketplace. One clear view.**  
> Premium interactive frontend operating system designed for an enterprise Amazon agency managing Seller Central and Vendor Central accounts for consumer brands.

---

## 🌟 Overview

AUREL is an agency operations platform that consolidates fragmented Amazon operational tools (Seller Central, Vendor Central, Amazon Ads, Sellerboard, Keepa, 3PL warehouses, Make, Freedcamp, Xero, GoCardless) into a unified, human-governed software product.

### Core Capabilities

- **Amazon Data Layer & Performance (`/app/performance`)**: Seller Central (GMV / FBA) vs Vendor Central (Shipped Revenue / EDI) decoupling, regional marketplaces (UK, DE, FR, US, CA, IT, ES), campaign breakdowns, harvested search terms, and CSV export.
- **Unified Stock & Replenishment (`/app/inventory`)**: Aggregated FBA, Vendor, and 3PL stock positions (Pick Pack N Post, Mintsoft, Blue30, Linnworks), Days of Cover formulas, and one-click FBA replenishment drafting.
- **Profit per SKU (`/app/profitability`)**: True contribution margin accounting (Net Sales − COGS − Landed Shipping − Amazon Fees − PPC Ad Spend), dynamic cost assumptions sandbox, and Sellerboard reconciliation bridge.
- **Listing & Account Health (`/app/health`)**: Detection of listing suppressions, Buy Box hijackers, and vendor shortage deductions with Keepa history charts and Claude-assisted mitigation drafting.
- **Marketplace Expansion (`/app/expansion`)**: 8-step expansion wizard with side-by-side German/French catalog translations, compliance checks, and approval gates.
- **Client Onboarding (`/app/onboarding`)**: 10-stage operational milestone pipeline with 3PL goods receipt simulation and Freedcamp/Xero/LWA handovers.
- **Client Communications (`/app/communications`)**: Live multi-channel briefing builder with dynamic brand theming for Email, WhatsApp, and Excel formats.
- **Human Approval Center (`/app/approvals`)**: Strict operational control gate ensuring zero unreviewed API dispatches or catalog publications.

---

## 🚀 Netlify Deployment

This repository is pre-configured for **one-click deployment to Netlify**:

- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **SPA Redirects:** Configured via `netlify.toml` and `public/_redirects`

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📦 Tech Stack

- **Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS (Custom British executive palette: `#F7F7F3`, `#345B49`, `#E8EFE8`, `#B87559`)
- **Routing:** React Router v6 (SPA refresh-safe)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Data Architecture:** Deterministic, interconnected multi-brand mock state
