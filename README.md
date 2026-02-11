# NBA Player Manager

A modern web application for browsing NBA players and managing teams. Built with React, TanStack Router, and TanStack Query.

## Features

### Player Management
- **Browse NBA Players**: Search and explore NBA player database with infinite scroll
- **Real-time Search**: Debounced search functionality for smooth filtering

### Team Management
- **Create Teams**: Build custom teams with region and country information
- **Assign Players**: Add multiple NBA players to teams
- **Full CRUD Operations**: Create, read, update, and delete teams
- **Team Overview**: View team details including player count and metadata

### Authentication
- Protected routes with authentication
- Login system with JWT token management
- Public and private route separation

## Tech Stack

### Frontend Framework & Libraries
- **React 19** - UI library
- **TypeScript** - Type safety
- **TanStack Router** - File-based routing with type-safe navigation
- **TanStack Query** - Data fetching, caching, and infinite queries
- **Redux Toolkit** - State management (auth)

### Styling & UI
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Icon library

### Development Tools
- **Vite** - Build tool and dev server
- **Biome** - Fast linting and formatting
- **pnpm** - Package manager

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Install dependencies
pnpm install
# or
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=your_api_base_url
```

### Development

```bash
# Start development server on port 3000
pnpm dev
# or
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

### Building for Production

```bash
# Build for production
pnpm build
# or
npm run build

# Preview production build
pnpm preview
# or
npm run preview
```

## Project Structure

```
src/
├── routes/              # File-based routing
│   ├── __root.tsx      # Root layout
│   ├── index.tsx       # Redirects to /players
│   ├── _public/        # Public routes
│   │   └── login.tsx   # Login page
│   └── _private/       # Protected routes
│       ├── players.tsx # NBA players listing
│       └── teams.tsx   # Team management
├── components/         # Reusable components
│   ├── Header.tsx
│   ├── TeamModal.tsx
│   ├── DeleteTeamModal.tsx
│   └── PlayerPicker.tsx
├── hooks/              # Custom React hooks
│   ├── usePlayers.ts
│   ├── useInfinitePlayers.ts
│   ├── useTeams.ts
│   └── useDebounce.ts
├── store/              # Redux store
│   ├── store.ts
│   ├── authSlice.ts
│   └── hooks.ts
├── lib/                # Utility functions
│   ├── api.ts          # Axios instance
│   ├── auth.tsx        # Auth utilities
│   └── auth-utils.ts
└── types/              # TypeScript types
    └── team.ts
```

## Available Scripts

### Development
```bash
pnpm dev         # Start dev server
```

### Testing
```bash
pnpm test        # Run tests with Vitest
```

### Code Quality
```bash
pnpm lint        # Lint code with Biome
pnpm format      # Format code with Biome
pnpm check       # Run both lint and format
```

## Key Features Implementation

### Infinite Scroll
Players are loaded progressively using TanStack Query's `useInfiniteQuery` with intersection observer for automatic loading.

### Debounced Search
Search input is debounced by 500ms to optimize API calls and improve performance.

### Protected Routes
Routes are split into public (`_public`) and private (`_private`) layouts. Private routes require authentication via JWT tokens stored in Redux.

### Form Management
Team creation and editing use controlled forms with player selection via a searchable modal.

## API Integration

The application connects to an NBA players API with the following endpoints:
- `GET /players` - Fetch players with pagination and search
- `GET /teams` - Fetch all teams
- `POST /teams` - Create new team
- `PUT /teams/:id` - Update team
- `DELETE /teams/:id` - Delete team

## Deployment

This project is configured for deployment on Vercel. The `vercel.json` configuration handles routing for the SPA.

```bash
# Deploy to Vercel
vercel
```

## Acknowledgments

- NBA API for player data
- TanStack team for excellent React libraries
- Tailwind CSS for the styling system
