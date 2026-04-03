# Helping Hands

A community web platform built with React + TypeScript + Vite that connects donors and volunteers to address food insecurity.

## Tech Stack

- **Frontend:** React 19, TypeScript, React Router DOM v7
- **Backend/Database:** Firebase 11 (Authentication + Firestore)
- **Build Tool:** Vite 8
- **Package Manager:** npm

## Project Structure

```
src/
  App.tsx              # Root component with routes
  main.tsx             # Entry point
  firebaseConfig.ts    # Firebase project configuration
  authService.ts       # Authentication logic
  index.css            # Global styles
  components/          # Reusable UI components (Navbar, Footer, ScrollReveal)
  pages/               # Page components (LandingPage, DonorDashboard, VolunteerDashboard, etc.)
  assets/              # Images and SVGs
public/                # Static assets
```

## Development

- Dev server runs on port 5000 (0.0.0.0)
- Start: `npm run dev`
- Build: `npm run build`

## Deployment

- Static site deployment via `npm run build` → `dist/` directory
