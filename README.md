# ShopGifs

A side project made for MTU IT that allows MTU IT to have memes or GIFs displayed on a monitor/display that updates in real-time when someone with admin permissions changes the content. Built with Next.js, MongoDB, and Google OAuth.

## How It Works

ShopGifs is a dual-interface web app:

- **Player** (`/`) — A public full-screen display that polls for the latest GIF or video every second and updates automatically. Intended to be shown on a monitor in the shop.
- **Admin Panel** (`/panel`) — A Google OAuth-protected control panel where authorized users can update the displayed media, view an activity log, and manage users.

### Content Flow

1. An admin signs in via Google OAuth at `/panel`
2. They upload a file or paste a URL in the **Home** tab
3. Files are hosted via the [Tixte](https://tixte.com) API; URLs are validated and stored directly
4. The player page polls `/api/getConfig` every second and displays whatever is currently set
5. All updates are logged with the user's name, timestamp, and media type — logs expire after 7 days

### Authentication

Only whitelisted emails (stored in MongoDB) can sign in. Admin users additionally have access to the **Users** tab to add or remove authorized users.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 13 (React + TypeScript) |
| Styling | Tailwind CSS |
| Database | MongoDB |
| Auth | NextAuth.js (Google OAuth) |
| File Hosting | Tixte API |
| Data Fetching | SWR |

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB database
- A Google OAuth app ([console.cloud.google.com](https://console.cloud.google.com))
- A Tixte account and API key ([tixte.com](https://tixte.com))

### Environment Variables

Create a `.env.local` file in the root of the project:

```env
# MongoDB
MONGODB_URI=mongodb+srv://...
DATABASE=shopgifs

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# NextAuth
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000

# Tixte (file uploads)
NEXT_PUBLIC_TIXTEAPI=...

# Branding
NEXT_PUBLIC_SITENAME=ShopGifs
```

### Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`.

### Production Build

```bash
npm run build
npm start
```

### Seed Initial Admin User

The first authorized user must be added directly to MongoDB. Insert a document into the `authorizedUsers` collection:

```json
{
  "email": "you@example.com",
  "name": "Your Name",
  "admin": true
}
```

After that, admins can manage users from the panel.

## Project Structure

```
src/
├── pages/
│   ├── index.tsx              # Public GIF/video player
│   ├── panel.tsx              # Sign-in page
│   ├── panel/
│   │   ├── home.tsx           # Upload/update media
│   │   ├── logs.tsx           # Activity log viewer
│   │   ├── users.tsx          # User management (admins only)
│   │   └── Header.tsx         # Panel navigation
│   ├── components/
│   │   └── SignIn/SignInPage.tsx
│   └── api/
│       ├── auth/[...nextauth].js
│       ├── getConfig.js        # Fetch current media config
│       ├── updateSource.js     # Update media source
│       ├── getLogs.js          # Activity logs
│       ├── getUsers.js         # List users
│       ├── manageUserObjects.js # Create/delete users
│       └── lib/database.js     # MongoDB connection
├── hooks/
│   └── useKeyboardShortcut.ts
├── middleware.ts               # Route protection
└── styles/globals.css
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+P` | Toggle between player and panel |
| `Ctrl+L` | Toggle easter egg image |

## MongoDB Collections

**`config`** — Stores the current media source:
```json
{
  "id": "main",
  "player": {
    "source": "https://...",
    "type": "image"
  }
}
```

**`authorizedUsers`** — Whitelisted users:
```json
{
  "email": "user@mtu.edu",
  "name": "Display Name",
  "admin": false
}
```

**`logs`** — Activity log (auto-deleted after 7 days):
```json
{
  "date": "1234567890",
  "name": "User Name",
  "type": "image",
  "url": "https://...",
  "expireDate": "1234567890"
}
```
