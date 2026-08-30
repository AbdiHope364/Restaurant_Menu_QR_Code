# ☕ ITETE BUNA — Digital QR Restaurant Menu & Operations Management Platform

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org)
[![Vite 5](https://img.shields.io/badge/vite-5.4-646CFF.svg)](https://vitejs.dev)
[![React 18](https://img.shields.io/badge/react-18.3-61DAFB.svg)](https://react.dev)
[![Tailwind CSS 3](https://img.shields.io/badge/tailwindcss-3.4-38B2AC.svg)](https://tailwindcss.com)
[![PWA Ready](https://img.shields.io/badge/PWA-installable-orange.svg)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Enterprise-Grade Contactless Dining Monorepo**: Transforming physical paper restaurant menus into a high-performance, real-time digital dining experience with table QR tracking, group bill splitting, localized payments (Telebirr & Chapa), Kitchen Order Ticket (KOT) thermal printing, and 4-tier Role-Based Access Control (RBAC).

---

## 📑 Table of Contents
1. [System Architecture & Monorepo Structure](#-system-architecture--monorepo-structure)
2. [Live Production Deployments](#-live-production-deployments)
3. [Core Feature Breakdown](#-core-feature-breakdown)
   - [Customer Mobile Dining App](#1-customer-mobile-dining-app-appscustomer)
   - [Staff & Manager Operations Portal](#2-staff--manager-operations-portal-appsadmin)
   - [Ordering, Payments & Gratuity Architecture](#3-ordering-payments--gratuity-architecture)
   - [Kitchen Operations & KOT Thermal Printing](#4-kitchen-operations--kot-thermal-printing)
4. [Role-Based Access Control (RBAC) Matrix](#-role-based-access-control-rbac-matrix)
5. [Technical & Security Architecture](#-technical--security-architecture)
   - [Anti-Spam & Rate Limiting Strategy](#anti-spam--rate-limiting-strategy)
   - [Authentication & JWT Rotation](#authentication--jwt-rotation)
   - [Multi-Tenancy SaaS Strategy](#multi-tenancy-saas-strategy)
   - [Backend API & Live Sync Architecture](#backend-api--live-sync-architecture)
6. [Quick Start & Local Development](#-quick-start--local-development)
7. [Testing, CI/CD & Deployment](#-testing-cicd--deployment)
8. [Changelog & Versioning](#-changelog--versioning)

---

## 🏛️ System Architecture & Monorepo Structure

```
Restaurant_Menu_QR_Code/
├── apps/
│   ├── customer/                   # Customer Mobile-First Dining & Ordering App
│   │   ├── public/                 # PWA manifest.json, logo.png, icons
│   │   ├── src/
│   │   │   ├── components/customer/# CartDrawer, FoodCard, QuickActions, ItemDetailModal
│   │   │   ├── pages/customer/     # CustomerMenu, ScanQR
│   │   │   └── App.jsx             # Public routing (/menu/qr/:shortId, /menu)
│   │   └── vercel.json             # SPA rewrites & headers
│   │
│   └── admin/                      # Management, Kitchen & Staff Portal
│       ├── public/                 # Admin logo.png & assets
│       ├── src/
│       │   ├── components/         # AdminLayout (Responsive Drawer + Collapse)
│       │   ├── context/            # AuthContext (4-tier RBAC), MenuContext
│       │   ├── pages/admin/        # Dashboard, OrdersManagement, MenuManagement,
│       │   │                       # Categories, QRManagement, Settings, Analytics
│       │   ├── pages/Auth/         # Login (1-click Demo), Signup (RBAC registration)
│       │   └── services/           # authService, qrService, api
│       └── vercel.json             # SPA rewrites & headers
│
├── packages/
│   └── shared/                     # Shared Monorepo Package (@ethio-buna/shared)
│       ├── api/                    # menuApi.js (CRUD + catalog), ordersService.js
│       └── settings/               # settingsContext.jsx (Theme engine & branding)
│
├── INTERNSHIP_REPORT.md            # Comprehensive 10-section Academic Internship Report
├── Project_Documentation.pdf       # Compiled High-Resolution Multi-Page PDF Documentation
├── generate_pdf.js                 # jsPDF Automation Script (`npm run docs:pdf`)
└── package.json                    # Monorepo Workspace Configuration
```

---

## 🌐 Live Production Deployments

| Web Application | Target Audience | Production URL |
| :--- | :--- | :--- |
| **Customer Digital Menu** | Restaurant Guests scanning table QR codes | [`https://restaurant-menu-qr-code-customer.vercel.app`](https://restaurant-menu-qr-code-customer.vercel.app) |
| **Management & Kitchen Portal** | Managers, Cashiers, Waitstaff & Chefs | [`https://restaurant-menu-qr-code-admin.vercel.app`](https://restaurant-menu-qr-code-admin.vercel.app) |

---

## 🚀 Core Feature Breakdown

### 1. Customer Mobile Dining App (`apps/customer`)
* **Instant QR Resolution**: Scanning table QR codes automatically binds the guest's session to their physical table (e.g. `Table 3 Patio`).
* **Rich Visual Menu Catalog**: High-resolution dish photography, ingredients, price formatting in ETB, and dietary badges (🌱 Vegetarian, 🌿 Vegan, 🌾 Gluten-Free, ☪️ Halal, 🌶️ Spicy).
* **Real-Time Stock Reflection**: Items marked "Out of Stock" by the kitchen immediately show a "Sold Out" overlay and disable order buttons.
* **PWA Installability**: Web manifest (`manifest.json`) and Apple Touch icons for home-screen bookmarking and fast caching.
* **Floating Service Desk**: One-tap buttons to **🛎️ Call Waiter** or **💳 Request Bill** directly from the table.

### 2. Staff & Manager Operations Portal (`apps/admin`)
* **Responsive Command Center**: Desktop expandable/collapsible icon bar (80px vs 260px) + mobile drawer navigation.
* **Interactive Menu CRUD**: Create, edit, reprice, categorize, and toggle availability for dishes and drinks.
* **Branding Customizer**: White-label settings engine (Logo upload, restaurant title, Wi-Fi credentials, currency, tax rates, and 7 theme palettes).
* **Table QR Code & Stand Generator**: Generate dynamic table codes with high-DPI canvas PNG download and direct **Print-Ready A5 Acrylic Table Tent PDF export**.

### 3. Ordering, Payments & Gratuity Architecture
* **Hybrid Payment Options**:
  1. **Telebirr Wallet**: Mobile money integration for Ethiopia-based digital settlement.
  2. **Chapa / CBE Birr**: Card and mobile banking gateway integration.
  3. **Card / POS Terminal**: Pay at table via waiter's handheld POS.
  4. **Cash**: Pay directly to waitstaff.
* **Group Table Bill Splitter**: Calculate and divide table totals across 1, 2, 3, 4, or 5+ guests in real time.
* **Gratuity / Tip Selector**: Guests can choose 0%, 5%, 10%, 15%, or custom tips for service staff.
* **2-Minute Cancellation Grace Period**: Customers can cancel or modify orders within 120 seconds before the kitchen accepts the ticket.

### 4. Kitchen Operations & KOT Thermal Printing
* **Real-Time Kanban Queue**: Orders transition through `Pending` ➔ `In Kitchen` ➔ `Ready to Serve` ➔ `Completed & Settled`.
* **Kitchen Order Ticket (KOT) Printing**: Standard 80mm ESC/POS thermal ticket generation with Table #, Order #, Time, Items, and Special Notes for kitchen line cooks.
* **Sound & Visual Alerts**: Audio chime and toast notifications for incoming orders and table assistance requests.

---

## 👥 Role-Based Access Control (RBAC) Matrix

| Feature / Page | 👑 General Manager | 🛎️ Floor Waiter | 👨‍🍳 Kitchen / Chef | 💵 Cashier |
| :--- | :---: | :---: | :---: | :---: |
| **Executive Analytics & Revenue** | ✅ | ❌ | ❌ | ❌ |
| **Branding, Tax & System Setup** | ✅ | ❌ | ❌ | ❌ |
| **Menu CRUD & Price Editing** | ✅ | ❌ | ❌ | ❌ |
| **Menu In-Stock / Hide Toggle** | ✅ | ✅ | ✅ | ❌ |
| **Live Kitchen Order Queue** | ✅ | ✅ | ✅ (KOT Print) | ✅ |
| **Table Assistance (Calls & Bills)** | ✅ | ✅ | ❌ | ✅ |
| **QR Code & Table Tent PDF Export** | ✅ | ✅ | ❌ | ❌ |
| **Order Settlement & Bill Clear** | ✅ | ❌ | ❌ | ✅ |
| **Customer Reviews & Ratings** | ✅ | ✅ | ❌ | ❌ |

---

## 🔒 Technical & Security Architecture

### Anti-Spam & Rate Limiting Strategy
* **Table QR Tokenization**: QR codes use ephemeral table session tokens (HMAC signed) preventing URL tampering.
* **Rate Limiting on Public Endpoints**:
  * `POST /orders`: Capped at max 3 orders per table within 5 minutes.
  * `POST /service-requests` (Call Waiter / Bill): Capped at max 1 request per 60 seconds per table.
* **Input Sanitization**: Request bodies sanitized with Zod schemas and DOMPurify to eliminate XSS.

### Authentication & JWT Rotation
* **Access Tokens**: Short-lived (15 min) JWT stored in memory / secure HttpOnly cookies.
* **Refresh Tokens**: Long-lived (7 days) rotating refresh tokens stored in database with device fingerprinting.

### Multi-Tenancy SaaS Strategy
* **Data Isolation**: All database models include `restaurantId` (or `tenantId`) indexed on all queries.
* **Cross-Tenant Guard**: Middleware validates authenticated admin permissions against the active `tenantId`.

### Backend API & Live Sync Architecture
* **Stack**: Node.js / Express.js REST API with Socket.io / Server-Sent Events (SSE) for sub-second order dispatch.
* **Database**: PostgreSQL (Prisma ORM) or MongoDB with transactions for financial ledger integrity.

---

## 💻 Quick Start & Local Development

### Prerequisites
* Node.js `>= 20.0.0`
* npm `>= 10.0.0`

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/AbdiHope364/Restaurant_Menu_QR_Code.git
cd Restaurant_Menu_QR_Code
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
```

### 3. Run Applications
```bash
# Start Customer Digital Menu (Port 3000)
npm run customer

# Start Admin & Kitchen Dashboard (Port 3001)
npm run admin

# Run Both Concurrently
npm run dev
```

### 4. Demo Login Credentials
* **👑 Manager / Admin**: `manager@itetebuna.com` / `Password123!`
* **🛎️ Floor Waiter**: `waiter@itetebuna.com` / `Password123!`

---

## 🧪 Testing, CI/CD & Deployment

### Compile Production Builds
```bash
npm run build
```

### Recompile Documentation PDF
```bash
npm run docs:pdf
```

### Vercel Deployment Settings
* **Customer Menu**: Root Directory `apps/customer`, Build Command `npm run build`, Output `dist`.
* **Admin Dashboard**: Root Directory `apps/admin`, Build Command `npm run build`, Output `dist`.

---

## 📜 Changelog & Versioning

### v2.0.0 (Current Release)
- ✅ Rebranded to **ITETE BUNA** with official insignia logo integration.
- ✅ Added 80mm ESC/POS Thermal Kitchen Order Ticket (KOT) printer generator.
- ✅ Implemented localized payments (Telebirr & Chapa) + Cash & Card selection.
- ✅ Implemented group table bill splitter & gratuity/tip calculator.
- ✅ Added 2-minute order cancellation grace countdown & estimated prep time display.
- ✅ Overhauled AdminLayout with responsive mobile drawer & desktop collapse toggle.
- ✅ Added PWA manifest and mobile viewport enhancements.
- ✅ Exported multi-page academic PDF report ([`Project_Documentation.pdf`](./Project_Documentation.pdf)).

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
