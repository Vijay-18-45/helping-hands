# Helping Hands

A community web platform built with React + TypeScript + Vite that connects donors, requestors, and volunteers to address food insecurity.

## Tech Stack

- **Frontend:** React 19, TypeScript, React Router DOM v7
- **Backend/Database:** Firebase 11 — Auth + Realtime Database (RTDB)
- **Build Tool:** Vite 8
- **Package Manager:** npm
- **Maps:** @react-google-maps/api (Google Maps API key: AIzaSyBhJerwaPCqwEK7suSoBW0sBj7dQZ5sN4Q)
- **Default map center:** Vijayawada, India (lat: 16.5062, lng: 80.648)

## Project Structure

```
src/
  App.tsx               # Root component with routes + AuthProvider
  main.tsx              # Entry point
  firebaseConfig.ts     # Firebase config - exports auth and rtdb
  authService.ts        # Auth functions using Firebase Auth + RTDB (roles: donor | volunteer | requestor)
  index.css             # Global styles
  context/
    AuthContext.tsx     # React context for auth state (onAuthStateChanged)
  components/
    Navbar.tsx          # Shows Donor Login, Request Food, Get Started buttons
    Footer.tsx
    ProtectedRoute.tsx  # Route guard (checks login + email verification + role)
    ScrollReveal.tsx
    Toast.tsx           # Toast notification system
    MapPicker.tsx       # Clickable Google Map for picking location
    LocationViewer.tsx  # Static Google Map showing a single marker (green/red/blue)
    DualLocationMap.tsx # Google Map with two markers (green=donor, red=requestor)
  pages/
    LandingPage.tsx
    DonorLogin.tsx          # Enforces email verification + role check
    DonorRegisterFixed.tsx  # Real Firebase signup with email verification
    DonorDashboard.tsx      # Protected: donation form with image upload + map location picker
    VolunteerLogin.tsx
    VolunteerRegister.tsx
    VolunteerDashboard.tsx  # Protected: two sections (Available Donations + Requested Items with dual maps)
    RequestorLogin.tsx      # Login for requestor role
    RequestorRegister.tsx   # Registration for requestor role
    RequestorDashboard.tsx  # Protected: browse available donations, request items with map location
    ImpactPage.tsx
    AboutPage.tsx
    ServeToSociety.tsx
  assets/
public/
```

## Firebase Architecture

- **Auth:** Email/password with mandatory email verification before login
- **Realtime Database schema:**
  - `users/{uid}` → `{ email, role }` — role is "donor", "volunteer", or "requestor"
  - `donations/{donationId}` → `{ donorId, title, description, quantity, freshness (hours), image (base64), location: {lat, lng}, status: "available"|"requested", timestamp }`
  - `requests/{requestId}` → `{ donationId, requestorId, requesterName, phone, location: {lat, lng}, status: "pending", timestamp }`

## Key Features

- **Three roles:** Donor, Volunteer, Requestor — each with dedicated auth and dashboard
- **Email verification:** enforced on all login pages; signup auto-sends verification email
- **Protected routes:** `ProtectedRoute` component checks auth, emailVerified, and role
- **Donor Dashboard:**
  - Form with Food Title, Description, Quantity, Freshness (hours), Image upload (base64)
  - Google Maps location picker (click to set, or auto-detect via geolocation)
  - Saves to RTDB with `status: "available"` and `location: {lat, lng}`
- **Requestor Dashboard:**
  - Fetches all donations where status = "available"
  - Card grid with image, title, quantity, freshness timer, and mini location map
  - "Request Item" button → modal form (name, phone, map location picker or auto-detect)
  - Saves request to `requests/` and updates donation status to "requested"
  - "My Requests" section showing submitted request history
- **Volunteer Dashboard:**
  - Section 1 — Available Donations: cards with food info + green donor marker on map + Get Directions link
  - Section 2 — Requested Items: full request details with donor info + requestor (name, phone, clickable phone link) + dual-marker route map (green=donor, red=requestor) + Get Directions buttons
- **Toast notifications:** success/error/info toasts across all flows
- **Map components:** MapPicker (interactive click-to-select), LocationViewer (read-only single marker), DualLocationMap (donor + requestor markers with legend)

## Routes

| Path | Component | Access |
|---|---|---|
| / | LandingPage | Public |
| /donor/login | DonorLogin | Public |
| /donor/register | DonorRegisterFixed | Public |
| /donor/dashboard | DonorDashboard | donor role |
| /volunteer/login | VolunteerLogin | Public |
| /volunteer/register | VolunteerRegister | Public |
| /volunteer/dashboard | VolunteerDashboard | volunteer role |
| /requestor/login | RequestorLogin | Public |
| /requestor/register | RequestorRegister | Public |
| /requestor/dashboard | RequestorDashboard | requestor role |
| /serve | ServeToSociety | Public |
| /impact | ImpactPage | Public |
| /about | AboutPage | Public |

## Development

- Dev server runs on port 5000 (`0.0.0.0`)
- Start: `npm run dev`
- Build: `npm run build`

## Deployment

- Static site deployment via `npm run build` → `dist/`
