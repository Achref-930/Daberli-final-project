<div align="center">

# 🇩🇿 Daberli

**Algeria''s modern classified ads platform**

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)

</div>

---

## Overview

Daberli is a classified ads marketplace built for Algeria, covering **58 wilayas** across 4 categories:

| Category | Description |
|---|---|
| 🚗 **Vehicles** | Cars, trucks, motorcycles |
| 🏠 **Real Estate** | Apartments, villas, studios |
| 💼 **Jobs** | Full-time, part-time, freelance |
| 🔧 **Daberli Pro** | Verified professionals & services |

## Features

- 🔍 Unified search + wilaya filter in the navbar
- ⚡ Admin-boosted featured listings on homepage
- ✅ Verified badge system for trusted sellers
- 📍 Wilaya-based filtering across all 58 provinces
- 🌙 Per-category themed pages (Auto, Real Estate, Jobs, Services)
- 📱 Fully responsive — mobile, tablet, desktop

## Tech Stack

- **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Vite 6** (build tool)
- **React Router v7**
- **Lucide React** (icons)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- npm v9+

### Installation

```bash
# Clone the repo
git clone https://github.com/Achref-930/daberli-1.6.git
cd daberli-1.6

# Install dependencies
npm install

# Start dev server
npm run dev
```

App will be available at **http://localhost:5173**

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
daberli-1.6/
├── components/          # Shared UI components
│   ├── Navbar.tsx       # Unified navbar with wilaya + search
│   ├── ServiceCard.tsx  # Ad card with boosted/verified badges
│   ├── Hero.tsx
│   ├── Footer.tsx
│   └── cards/           # Category-specific cards
├── pages/               # Route-level pages
│   ├── HomePage.tsx
│   ├── AutoPage.tsx
│   ├── RealEstatePage.tsx
│   ├── JobsPage.tsx
│   └── ServicesPage.tsx
├── constants.ts         # Wilayas list + mock ads
├── types.ts             # TypeScript interfaces
└── App.tsx              # Router + global state
```

## License

MIT
