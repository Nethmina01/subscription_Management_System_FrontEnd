# Production-Ready Next.js Frontend

A modern, production-ready frontend built with Next.js App Router and Tailwind CSS.

## Features

- ✅ Next.js 14 with App Router
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ JWT authentication with HttpOnly cookies
- ✅ Loading skeletons
- ✅ Empty states
- ✅ Comprehensive error handling
- ✅ Date formatting with Intl.DateTimeFormat
- ✅ Status badges (Active/Expired/Pending/Inactive)
- ✅ Clean, modern SaaS UI
- ✅ Accessible components (ARIA labels, keyboard navigation, focus management)
- ✅ Server and client components appropriately used

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

### Backend API

The backend base URL is configured in `lib/api.ts`:
```typescript
const API_BASE_URL = 'http://localhost:5500'
```

All API requests automatically include `credentials: 'include'` for HttpOnly cookie authentication.

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with navigation
│   ├── page.tsx           # Home/dashboard page
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   └── logout/            # Logout page
├── components/            # React components
│   ├── dashboard.tsx      # Main dashboard component
│   ├── navigation.tsx     # Navigation bar
│   └── ui/               # Reusable UI components
│       ├── error-boundary.tsx
│       ├── error-message.tsx
│       ├── empty-state.tsx
│       ├── loading-skeleton.tsx
│       └── status-badge.tsx
├── lib/                   # Utilities
│   ├── api.ts            # API client with fetch wrapper
│   ├── date-utils.ts     # Date formatting utilities
│   └── utils.ts          # General utilities
└── public/               # Static assets
```

## API Client

The API client (`lib/api.ts`) provides:

- Automatic `credentials: 'include'` for all requests
- Error handling with custom `ApiException`
- Convenience methods: `api.get()`, `api.post()`, `api.put()`, `api.delete()`

Example usage:
```typescript
import { api } from '@/lib/api'

// GET request
const data = await api.get<User[]>('/users')

// POST request
const result = await api.post('/users', { name: 'John' })
```

## Components

### Loading Skeletons
Use `LoadingSkeleton`, `CardSkeleton`, or `TableSkeleton` for loading states.

### Empty States
Use `EmptyState` component when there's no data to display.

### Error Handling
- `ErrorBoundary` for catching React errors
- `ErrorMessage` for displaying API errors

### Status Badges
Use `StatusBadge` with status types: `'active' | 'expired' | 'pending' | 'inactive'`

## Date Formatting

Use the date utilities from `lib/date-utils.ts`:

```typescript
import { formatDate, formatDateTime, formatRelativeTime } from '@/lib/date-utils'

formatDate(date) // "Jan 15, 2024"
formatDateTime(date) // "Jan 15, 2024, 10:30 AM"
formatRelativeTime(date) // "2 days ago"
```

## Accessibility

All components include:
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Screen reader support
- Semantic HTML

## Building for Production

```bash
npm run build
npm start
```

## License

MIT

