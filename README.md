# De Anza MASA Website

Official website for the **Malaysian & Singaporean Association (MASA)** at De Anza College in Cupertino, CA.

---

## 📁 Project Architecture

The codebase is organized into a modular front-end architecture for maintainability and scalability:

```text
/src
├── /assets                # Global styles, fonts, and images
│   ├── /images            # Skyline, event, and community image assets
│   └── /styles            # Design tokens, variables, responsive stylesheets
├── /components            # Shared, reusable UI elements
│   ├── FAQAccordion.js    # Interactive expandable FAQ item logic
│   ├── Navbar.js          # Header scroll state, mobile drawer & burger menu
│   └── StatsCounter.js    # Live member & event counter animation
├── /hooks                 # Custom logic & reactive listeners
│   ├── useIntersectionObserver.js  # Viewport visibility watcher
│   └── useScroll.js       # Window scroll listener & threshold hook
├── /pages                 # Individual view routing screens
│   └── home.js            # Home page controller orchestrating components
├── /services              # API integration and network requests
│   └── contactService.js  # Formspree endpoint integration & status UI
├── /utils                 # Helper functions
│   ├── dom.js             # Element selector & event listener shortcuts
│   └── formatters.js      # Animation easing & number/date formatters
└── main.js                # Root application entry point
```

---

## 🚀 Quick Start & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
Starts a hot-reloading local web server via Vite:
```bash
npm run dev
```

### 3. Build for Production
Creates a bundled and optimized production output in the `dist/` directory:
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```