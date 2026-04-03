# Helping Hands

A community web platform built with React + TypeScript + Vite that connects donors and volunteers to address food insecurity.

## Tech Stack

- **Frontend:** React 19, TypeScript, React Router DOM v7
- **Backend/Database:** Firebase 11 — Auth + Realtime Database (RTDB)
- **Build Tool:** Vite 8
- **Package Manager:** npm

## Project Structure

```
src/
  App.tsx               # Root component with routes + AuthProvider
  main.tsx              # Entry point
  firebaseConfig.ts     # Firebase config - exports auth and rtdb
  authService.ts        # Auth functions using Firebase Auth + RTDB
  index.css             # Global styles
  context/
    AuthContext.tsx     # React context for auth state (onAuthStateChanged)
  components/
    Navbar.tsx
    Footer.tsx
    ProtectedRoute.tsx  # Route guard (checks login + email verification + role)
    ScrollReveal.tsx
    Toast.tsx           # Toast notification system
  pages/
    LandingPage.tsx
    DonorLogin.tsx          # Enforces email verification + role check
    DonorRegisterFixed.tsx  # Real Firebase signup with email verification
    DonorDashboard.tsx      # Protected: donation form → saves to RTDB
    VolunteerLogin.tsx      # Enforces email verification + role check
    VolunteerRegister.tsx   # Real Firebase signup with email verification
    VolunteerDashboard.tsx  # Protected: real-time donation list with freshness
    ImpactPage.tsx
    AboutPage.tsx
    ServeToSociety.tsx
  assets/
public/
```

## Firebase Architecture

- **Auth:** Email/password with mandatory email verification before login
- **Realtime Database schema:**
  - `users/{uid}` → `{ email, role }` — role is "donor" or "volunteer"
  - `donations/{donationId}` → `{ donorId, title, description, quantity, freshness (hours), image (base64), timestamp }`

## Key Features

- **Role-based registration:** Donor or Volunteer, saved to RTDB
- **Email verification:** enforced on both login pages; signup auto-sends verification email
- **Protected routes:** `ProtectedRoute` component checks auth, emailVerified, and role
- **Donor Dashboard:** form with Food Title, Description, Quantity, Freshness (hours), Image upload (base64) → pushed to RTDB
- **Volunteer Dashboard:** real-time donation listener (`onValue`), card grid with freshness indicator (Fresh/Expired + time remaining)
- **Toast notifications:** success/error/info toasts across all flows

## Development

- Dev server runs on port 5000 (`0.0.0.0`)
- Start: `npm run dev`
- Build: `npm run build`

## Deployment

- Static site deployment via `npm run build` → `dist/`
