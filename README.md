# 🇲🇾 🇸🇬 De Anza MASA — Official Website

> **Malaysian & Singaporean Association (MASA)** at De Anza College in Cupertino, California.  
> _A home away from home — connecting students through Southeast Asian culture, authentic food, transfer mentorship, and lifelong community in Silicon Valley._

[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Status](https://img.shields.io/badge/Status-Active-success.svg)]()
[![Affiliation](https://img.shields.io/badge/Affiliation-De%20Anza%20ICC-C1272D.svg)](https://www.deanza.edu/clubs/)
[![Instagram](https://img.shields.io/badge/Instagram-@deanza.masa-E4405F?logo=instagram&logoColor=white)](https://www.instagram.com/deanza.masa/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)]()

---

## 📌 Table of Contents

- [About MASA](#-about-masa)
- [Website Features](#-website-features)
- [Tech Stack](#-tech-stack)
- [Codebase Structure](#-codebase-structure)
- [Getting Started & Local Development](#-getting-started--local-development)
- [Content Management Guide](#-content-management-guide)
  - [1. Updating Announcement Banner & Meeting Times](#1-updating-announcement-banner--meeting-times)
  - [2. Adding & Managing Upcoming Events](#2-adding--managing-upcoming-events)
  - [3. Updating Executive Board Members & Photos](#3-updating-executive-board-members--photos)
  - [4. Updating Social & Discord Links](#4-updating-social--discord-links)
- [Deployment Guide](#-deployment-guide)
- [Contact & Community Links](#-contact--community-links)
- [License & Disclaimer](#-license--disclaimer)

---

## 🌏 About MASA

The **De Anza Malaysian & Singaporean Association (MASA)** is an official student-run club affiliated with De Anza College’s Inter-Club Council (ICC). We serve as a cultural bridge and support network for Malaysian, Singaporean, and all culturally curious students across the San Francisco Bay Area.

Our community is **100% open to all students** regardless of heritage or background. Whether you're craving authentic Mamak food, looking for UC/CSU transfer advice, or making friends in college, you belong here.

---

## ✨ Website Features

- **Warm Campus Editorial Aesthetic**: Premium, welcoming design with custom porcelain backgrounds, heritage crimson & amber accents, and clean typography (_Outfit_, _Plus Jakarta Sans_, and _Inter_).
- **Meeting Announcement Ticker**: Top banner featuring real-time meeting dates and campus locations with an animated pulse indicator.
- **Bento Grid Pillars**: Three core pillars showcasing _Culture & Food_, _Transfer Mentorship_, and _Student Advocacy_.
- **Extensible Events Hub**: Friendly "Planning in Progress" empty state with a ready-to-use HTML card template for scheduling gatherings.
- **Executive Board Directory**: Team profiles highlighting officer names, majors, bios, and role chips with avatar photo support.
- **Interactive FAQ Accordion**: Expandable questions addressing membership dues, meeting details, and transfer guidance.
- **3-Step "How to Join" Hub**: Direct onboarding guide with Discord and Instagram entry points.
- **Asynchronous Contact Form**: Clean form submission powered by Formspree API with instant in-page success/error notifications.
- **Mobile-Responsive Navigation**: Touch-friendly slide-out drawer menu with animated hamburger-to-X transitions.

---

## 🛠️ Tech Stack

- **Markup**: Semantic HTML5 (W3C compliant, accessibility-friendly ARIA attributes)
- **Styling**: Vanilla CSS3 (Custom design system, CSS variables, Flexbox & CSS Grid, zero heavy UI frameworks)
- **Scripting**: Vanilla JavaScript (Modern ES6+ Modules, native `IntersectionObserver`, custom hooks)
- **Build Tool & Dev Server**: [Vite 6](https://vitejs.dev/) (Instant Hot Module Replacement & optimized asset bundling)
- **Form API**: [Formspree](https://formspree.io/) (Serverless email routing)

---

## 📁 Codebase Structure

The project is organized into a modular `/src` directory to keep files clean, maintainable, and easy to edit:

- **`src/assets/`**: Contains global styling (`style.css`), fonts, and media assets (`images/` holds skyline pictures and club photography).
- **`src/components/`**: Houses shared, reusable UI elements such as the navigation bar, mobile drawer, animated counter, and FAQ accordion.
- **`src/hooks/`**: Custom reactive logic and listeners, including scroll tracking (`useScroll`) and viewport visibility detection (`useIntersectionObserver`).
- **`src/pages/`**: View-level controllers (like `home.js`) that initialize components and connect user event listeners.
- **`src/services/`**: Network requests and API integrations, such as `contactService.js` for handling Formspree contact form submissions.
- **`src/utils/`**: Helper utilities including DOM selection shortcuts (`dom.js`) and mathematical easing/formatting functions (`formatters.js`).
- **`index.html`**: The root HTML file where all website content, headings, and event card templates are maintained.

---

## 🚀 Getting Started & Local Development

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (version 18 or newer) installed.

### 1. Clone the Repository

```bash
git clone https://github.com/teosiangjun-png/MASA-website.git
cd MASA-website
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

Open your browser to the local address displayed in your terminal (usually `http://localhost:5173`). Any edits will update in real time with instant HMR (Hot Module Replacement).

### 4. Build for Production

```bash
npm run build
```

Creates an optimized, minified production build in the `dist/` directory ready for deployment.

### 5. Preview the Production Build

```bash
npm run preview
```

---

## 📝 Content Management Guide

All website text content lives directly inside [`index.html`](index.html). Here is how to make common updates:

### 1. Updating Announcement Banner & Meeting Times

- **Announcement Ticker**: Open `index.html` around line 18 (`.announcement-bar`) to edit the date, time, and room.
- **Hero Feature Card**: Open `index.html` around line 215 (`.featured-event-card`) to update the featured gathering highlight.

### 2. Adding & Managing Upcoming Events

The Events section (`#events`) includes a commented-out template. When a new event is scheduled:

1. Locate `index.html` around line 440.
2. Uncomment the `.events-grid` block.
3. Fill in the event title, category badge, date, time, location, and RSVP link:

```html
<div class="events-grid">
  <div class="event-card">
    <div class="event-card-header">
      <span class="event-type-badge type-social">Social & Food</span>
      <span class="event-date-chip">Oct 24</span>
    </div>
    <h3 class="event-card-title">Mamak Night & Board Games</h3>
    <p class="event-card-desc">
      Join us for Roti Canai, Teh Tarik, and card games!
    </p>
    <div class="event-card-meta">
      <div class="meta-row"><span>📍</span> Fireside Room</div>
      <div class="meta-row"><span>⏰</span> Thursday, 4:00 PM – 6:00 PM</div>
    </div>
    <a href="#contact" class="btn btn-secondary btn-sm w-full text-center"
      >RSVP</a
    >
  </div>
</div>
```

### 3. Updating Executive Board Members & Photos

- **Text**: Open `index.html` around line 470 (`#team`) to edit officer names, majors, and bios.
- **Photos**:
  1. Save your square photo (e.g. `president.jpg`) into `src/assets/images/`.
  2. Replace the `.officer-avatar-fallback` `div` with:
  ```html
  <img
    src="src/assets/images/president.jpg"
    alt="President Name"
    style="width:80px; height:80px; border-radius:50%; object-fit:cover; margin-bottom:14px;"
  />
  ```

### 4. Updating Social & Discord Links

- **Discord Server Link**: Replace `#join` or `#` with your actual invite link (e.g., `https://discord.gg/yourcode`) in `index.html` lines 82, 141, and 702.
- **Instagram**: Link points to `https://www.instagram.com/deanza.masa/`.

---

## 🌐 Deployment Guide

### Deploying to GitHub Pages

1. Build the production files:
   ```bash
   npm run build
   ```
2. You can use standard GitHub Pages with GitHub Actions, or deploy the `dist/` directory directly using `gh-pages`:
   ```bash
   npx gh-pages -d dist
   ```

### Deploying to Vercel / Netlify

1. Connect this repository to your Vercel or Netlify account.
2. Set the build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Deploy! Both platforms support automatic deploys on every `git push`.

---

## 🤝 Contact & Community Links

- **📸 Instagram**: [@deanza.masa](https://www.instagram.com/deanza.masa/)
- **🏛️ Campus Location**: De Anza College, 21250 Stevens Creek Blvd, Cupertino, CA 95014
- **🏫 Club Affiliation**: De Anza Inter-Club Council (ICC)

---

## 📄 License & Disclaimer

- **Disclaimer**: De Anza MASA is a recognized student club affiliated with De Anza College’s Inter-Club Council. The opinions, events, and statements on this website are organized by students and do not represent the Foothill-De Anza Community College District.
- **License**: This project is open-source under the [MIT License](LICENSE).
