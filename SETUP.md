# Setup Instructions

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Backend Configuration

The frontend is configured to connect to:
- **Backend URL:** `http://localhost:5500`
- **Authentication:** JWT stored in HttpOnly cookies
- **All requests:** Include `credentials: 'include'`

## API Endpoints Expected

The frontend expects the following backend endpoints:

### Authentication
- `POST /auth/login` - Login with email and password
- `POST /auth/register` - Register new user (name, email, password)
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user (for auth check)

### Dashboard
- `GET /dashboard` - Get dashboard data (returns array of items with: id, name, status, createdAt, updatedAt)

## Customizing the Dashboard

To connect your actual API endpoint, edit `components/dashboard.tsx` and uncomment/modify the API call:

```typescript
const response = await api.get<DashboardData[]>('/dashboard')
setData(response)
```

## Features Implemented

✅ **Next.js App Router** - All pages in `app/` directory  
✅ **Tailwind CSS** - Fully configured with dark mode support  
✅ **JWT Authentication** - HttpOnly cookies with credentials included  
✅ **Loading Skeletons** - `LoadingSkeleton`, `CardSkeleton`, `TableSkeleton`  
✅ **Empty States** - `EmptyState` component  
✅ **Error Handling** - `ErrorBoundary`, `ErrorMessage`, `ApiException`  
✅ **Date Formatting** - `formatDate()`, `formatDateTime()`, `formatRelativeTime()`  
✅ **Status Badges** - `StatusBadge` with Active/Expired/Pending/Inactive  
✅ **Accessibility** - ARIA labels, keyboard navigation, focus management  
✅ **Server/Client Components** - Appropriate use of both  

## Project Structure

```
frontEnd/
├── app/                    # Next.js pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Dashboard (home)
│   ├── login/             # Login page
│   ├── register/          # Registration page
│   ├── logout/            # Logout handler
│   ├── loading.tsx        # Loading state
│   ├── error.tsx          # Error boundary
│   └── not-found.tsx      # 404 page
├── components/
│   ├── dashboard.tsx      # Main dashboard
│   ├── navigation.tsx     # Nav bar
│   └── ui/               # Reusable components
├── lib/
│   ├── api.ts            # API client
│   ├── date-utils.ts     # Date formatting
│   └── utils.ts          # Utilities
└── package.json
```

## Notes

- TypeScript linter errors may appear initially but will resolve after `npm install` and running the dev server
- All API requests automatically include `credentials: 'include'` for cookie-based auth
- The UI is fully responsive and supports dark mode
- All components are accessible with proper ARIA attributes

