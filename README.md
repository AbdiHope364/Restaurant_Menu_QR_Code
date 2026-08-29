# 🍽️ Restaurant QR Menu & Order Management System

A modern, full-featured, white-labelable **Restaurant Digital Menu, Table QR Ordering, and Kitchen Management Platform**. Built with a high-performance React + Vite monorepo architecture, Tailwind CSS, and Framer Motion.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Architecture & Monorepo Structure](#-architecture--monorepo-structure)
- [Key Features](#-key-features)
  - [1. Customer Digital Menu App](#1-customer-digital-menu-app)
  - [2. Admin & Kitchen Operations App](#2-admin--kitchen-operations-app)
  - [3. White-Label & Customization Engine](#3-white-label--customization-engine)
  - [4. Acrylic Table Tent QR Generator](#4-acrylic-table-tent-qr-generator)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Applications](#running-the-applications)
  - [Building for Production](#building-for-production)
- [Configuration & Environment Variables](#-configuration--environment-variables)
- [State Management & Shared Library](#-state-management--shared-library)
- [Deployment Guide](#-deployment-guide)

---

## 🌟 Overview

This system provides an end-to-end digital dining experience:
1. **Guests** scan a dynamic QR code on their table using their phone camera, browse dishes categorized with dietary tags, add customized items to their cart, place orders directly to the kitchen, request table assistance (Call Waiter / Request Bill), and leave ratings.
2. **Restaurant Staff & Managers** use a unified dashboard to manage dishes, categories, pricing, and live orders in a real-time kitchen queue, track table scan metrics, generate branded PDF table tents, and customize the restaurant identity on the fly.

---

## 🏗️ Architecture & Monorepo Structure

The project uses npm workspaces structured into independent frontend applications and shared utilities:

```
Restaurant_Menu_QR_Code/
├── apps/
│   ├── admin/                    # Admin Dashboard & Kitchen Display (Port 3001)
│   │   ├── src/
│   │   │   ├── components/       # Layouts, Modals, Menu Cards, Inputs
│   │   │   │   ├── AdminLayout.jsx
│   │   │   │   └── admin/
│   │   │   ├── context/          # AuthContext, MenuContext
│   │   │   ├── hooks/            # useOverview, useQR, useCategories, etc.
│   │   │   ├── pages/
│   │   │   │   ├── Auth/         # Login, Signup, Password Recovery
│   │   │   │   └── admin/        # Dashboard, OrdersManagement, Settings, QRManagement
│   │   │   └── services/         # authService, qrService, analyticsService
│   │   ├── package.json
│   │   └── vite.config.js
│   │
│   └── customer/                 # Mobile-First Customer Digital Menu (Port 3000)
│       ├── src/
│       │   ├── components/
│       │   │   └── customer/     # MenuHeader, CartDrawer, QuickActions, FoodCard, etc.
│       │   ├── pages/
│       │   │   └── customer/     # ScanQR.jsx, CustomerMenu.jsx
│       │   └── services/         # categoryService, customerRatingService
│       ├── package.json
│       └── vite.config.js
│
├── packages/
│   └── shared/                   # Shared Business Logic & API Layer
│       ├── api/
│       │   ├── apiClient.js      # Axios instance with auth & error interceptors
│       │   ├── menuApi.js        # Menu & Category API endpoints
│       │   └── ordersService.js  # Live table order & service call operations
│       ├── settings/
│       │   └── settingsContext.jsx # White-label branding & theme engine
│       ├── index.js              # Unified exports
│       └── package.json
│
├── .env                          # Backend API URL configuration
├── package.json                  # Root monorepo configuration & scripts
└── README.md
```

---

## 🚀 Key Features

### 1. Customer Digital Menu App (`apps/customer`)
* **Camera QR Scanner & Direct Routing**: Automatically navigates guests to `/menu/qr/:shortId` when scanning table QR codes.
* **Interactive Cart Drawer**:
  * Real-time item additions with modifiers, spice preferences, and kitchen notes.
  * Live computation of Subtotal, Sales Tax, and Service Charges.
  * Cash / Card payment preference selection.
  * Active order tracking banner with live kitchen status.
* **Table Service Floating Bar**:
  * **🛎️ Call Waiter**: Sends immediate assistance alert with the table number to the staff.
  * **💳 Request Bill**: Alerts staff with preferred payment method (Card / Cash).
* **Dietary & Allergen Filtering**:
  * Quick filter pills: *Vegetarian* (🌱), *Vegan* (🌿), *Gluten-Free* (🌾), *Halal* (☪️), and *Spicy* (🌶️).
* **Multi-Language Switcher**: Instant localization toggle (English 🇬🇧, Amharic 🇪🇹, French 🇫🇷, Spanish 🇪🇸).
* **Complimentary Wi-Fi Popup**: Modal with single-tap password copy for guests.
* **Dish Details & Reviews**:
  * Fullscreen dish modal with carousel, ingredient breakdown, and nutrition facts.
  * Interactive rating modal for dishes and overall dining experience.

---

### 2. Admin & Kitchen Operations App (`apps/admin`)
* **Live Kitchen Order Display (`/dashboard/orders`)**:
  * Kanban order queue with status transitions: `Pending` ➔ `In Kitchen` ➔ `Ready to Serve` ➔ `Completed`.
  * Visual & sound notifications for incoming table orders and service calls.
  * Table service assistance alert banner with one-click resolution.
* **Operational KPI Dashboard (`/dashboard`)**:
  * Summary metrics: Today's Scans, Out of Stock alerts, Total Categories, Total Dishes.
  * Recent customer ratings widget and latest inventory stream.
* **Menu Management (`/dashboard/menu`)**:
  * Add, edit, delete, and toggle item availability.
  * Image uploads and camera capture support.
  * Pricing, discounts, spice levels, and preparation times.
* **Category Management (`/dashboard/categories`)**:
  * Add, update, inline-rename, and remove categories with duplicate prevention.
* **QR Codes & Analytics (`/dashboard/qr`, `/dashboard/analytics`)**:
  * Generate dynamic table QR entries with unique short codes and scan counters.
  * Scan engagement charts and dish popularity metrics.

---

### 3. White-Label & Customization Engine (`/dashboard/settings`)
* **Restaurant Identity**: Customize Restaurant Name, Tagline, Short Code, and Logo image.
* **Dynamic Currency System**: Switch currency symbol (`ETB`, `USD $`, `EUR €`, `GBP £`, `CAD CA$`, `AED`, etc.) and customize tax/service fee percentages.
* **7 Theme Color Palettes**:
  * 🌅 *Warm Terracotta* (`#ea580c`)
  * 🌿 *Fresh Emerald* (`#059669`)
  * 👑 *Royal Indigo* (`#4f46e5`)
  * 🌹 *Crimson Rose* (`#e11d48`)
  * 🍯 *Golden Amber* (`#d97706`)
  * 🌊 *Ocean Teal* (`#0d9488`)
  * 🌌 *Midnight Slate* (`#0f172a`)
* **Feature Toggles**: Selectively enable/disable Cart Ordering, Call Waiter, Reviews, or Multi-Language.
* **Live Interactive Preview**: Real-time mockup showing how the menu appears on mobile devices.

---

### 4. Acrylic Table Tent QR Generator
* Located inside the **QR Codes** section (`/dashboard/qr`).
* Formats a table display card including:
  * Restaurant logo & name
  * Table number / location name
  * High-resolution scan QR code
  * Ordering instructions
  * Guest Wi-Fi SSID & password
* Single-click **Export to PDF (A5 format)** ready for acrylic table stands.

---

## 💻 Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or higher (Recommended: Node `v20.x` or `v22.x`)
- **npm**: `v9.0.0` or higher

### Installation

Clone the repository and install dependencies from the root directory:

```bash
git clone https://github.com/AbdiHope364/Restaurant_Menu_QR_Code.git
cd Restaurant_Menu_QR_Code

# Install all workspace dependencies
npm install
```

### Running the Applications

You can start both applications independently:

```bash
# Start the Admin Dashboard (http://localhost:3001)
npm run admin

# Start the Customer Digital Menu (http://localhost:3000)
npm run customer
```

### Building for Production

Compile both apps into optimized production bundles:

```bash
# Build both admin and customer apps
npm run build

# Or build individual applications:
npm run build:admin
npm run build:customer
```

---

## ⚙️ Configuration & Environment Variables

Environment variables are managed in `.env`:

```env
# Backend API Base URL
VITE_API_URL=restaurant-menu-qr-system-production.up.railway.app/api/v1
REACT_APP_BACKEND_URL=http://localhost:5000
```

---

## 📦 State Management & Shared Library

The shared package (`packages/shared`) manages cross-cutting state:

| Export | Description |
| :--- | :--- |
| `SettingsProvider` / `useSettings()` | Manages white-label branding, currency, active theme, and toggles with local persistence and cross-tab storage broadcasting. |
| `ordersService` | Handles table order submissions, live order status updates, and waiter/bill service requests. |
| `menuApi` | Standard API client for menu CRUD, category management, and QR table fetching. |
| `apiClient` | Configured Axios instance with authentication bearer tokens and response interceptors. |
| `THEME_PRESETS` | Collection of 7 curated color schemes and Tailwind CSS helper classes. |
| `CURRENCY_OPTIONS` | Supported currencies with formatted symbol helpers. |

---

## 🚢 Deployment Guide

### Deploying to Vercel

Both `apps/admin` and `apps/customer` include `vercel.json` rewrite configurations for SPA routing:

1. **Admin App**:
   - Set Root Directory: `apps/admin`
   - Build Command: `npm run build`
   - Output Directory: `dist`
2. **Customer App**:
   - Set Root Directory: `apps/customer`
   - Build Command: `npm run build`
   - Output Directory: `dist`

### Deploying with Docker / Nginx

```dockerfile
# Example Dockerfile for customer or admin app
FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build:customer

FROM nginx:alpine
COPY --from=build /app/apps/customer/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
