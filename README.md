# Subscription Management System - Frontend

A modern, production-ready subscription management application built with Next.js 14, TypeScript, and Tailwind CSS. This frontend provides a comprehensive interface for users to track subscriptions, monitor renewals, and analyze spending across different categories.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [UI Design Principles](#ui-design-principles)
- [Backend Connectivity](#backend-connectivity)
- [Authentication Flow](#authentication-flow)
- [Component Architecture](#component-architecture)
- [API Integration](#api-integration)
- [Responsive Design](#responsive-design)
- [Error Handling](#error-handling)
- [Development Guidelines](#development-guidelines)
- [Deployment](#deployment)
- [License](#license)
- [Contributing](#contributing)
- [Support](#support)

---

## Overview

This frontend application is a full-featured subscription management system that enables users to:

- **Track Subscriptions**: Add, view, edit, and delete subscriptions with detailed information
- **Monitor Renewals**: Get insights on upcoming renewals and expiration dates
- **Analyze Spending**: View total monthly costs and category breakdowns
- **Manage Account**: Update profile information and preferences
- **Secure Authentication**: JWT-based authentication with secure token management

The application follows modern web development best practices, including server-side rendering, client-side interactivity, responsive design, and comprehensive error handling.

---

## Features

### Authentication & Authorization

- User registration with email and password validation
- Secure login with JWT token management
- Session management via localStorage and cookies for client/server compatibility
- Protected routes with server-side authentication guards
- Automatic redirection based on authentication status

### Dashboard

- Summary cards: Total subscriptions, active subscriptions, upcoming renewals (next 7 days)
- Total monthly cost calculation (normalized across all billing frequencies)
- Category breakdown visualization
- Comprehensive subscriptions table with sorting and filtering
- Quick actions to add new subscriptions

### Subscription Management

- **Create**: Name, price, currency (Rs/USD), billing frequency (daily/weekly/monthly/yearly), category, payment method, start date
- **View**: List and detail views with renewal date calculations and reminder previews
- **Edit**: Update any subscription field
- **Delete**: Remove subscriptions with confirmation dialog

### User Profile

- View account information (name, email, creation date)
- Profile settings management
- Secure logout functionality

### Theme System

- Light/dark mode toggle
- Persistent theme preferences in localStorage
- System-wide theme application
- High visibility design for optimal readability

---

## Technology Stack

### Core Framework

- **Next.js 14.0.4**: React framework with App Router, SSR, Server Components, and built-in optimizations
- **React 18.2.0**: UI library with hooks, component composition, and Context API
- **TypeScript 5.3.3**: Type safety with strict type checking and interface definitions

### Styling

- **Tailwind CSS 3.4.0**: Utility-first CSS framework with responsive design, dark mode support, and custom color palette
- **PostCSS 8.4.32**: CSS processing and transformation
- **Autoprefixer 10.4.16**: Automatic vendor prefixing

### Utilities

- **clsx 2.0.0**: Conditional class name utility
- **tailwind-merge 2.2.0**: Intelligent Tailwind class merging

---

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm 9.0 or higher (or yarn/pnpm)
- Backend API running on `http://localhost:5500` (or configure via environment variable)

### Installation

1. **Navigate to the frontend directory**:

   ```bash
   cd frontEnd
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Configure environment variables** (optional):

   Create a `.env.local` file in the root directory:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5500
   ```

4. **Start the development server**:

   ```bash
   npm run dev
   ```

5. **Open your browser**:

   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

---

## Project Structure

```
frontEnd/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with navigation
│   ├── page.tsx                 # Home page (redirects to dashboard)
│   ├── globals.css              # Global styles and CSS variables
│   ├── dashboard/               # Dashboard page
│   ├── login/                   # Login page
│   ├── signup/                  # Registration page
│   ├── logout/                  # Logout handler
│   ├── profile/                 # User profile page
│   ├── subscriptions/           # Subscription management pages
│   │   ├── page.tsx            # Subscriptions list
│   │   ├── new/                # Add subscription
│   │   └── [id]/               # Subscription details and edit
│   ├── error.tsx                # Global error boundary
│   ├── not-found.tsx            # 404 page
│   └── loading.tsx              # Loading UI
│
├── components/                   # React components
│   ├── navigation.tsx           # Main navigation bar
│   ├── dashboard-content.tsx    # Dashboard content
│   ├── subscriptions-list.tsx   # Subscriptions table
│   ├── subscription-details.tsx # Subscription detail view
│   ├── add-subscription-form.tsx # Create subscription form
│   ├── edit-subscription-form.tsx # Edit subscription form
│   ├── profile-content.tsx      # Profile page content
│   └── ui/                      # Reusable UI components
│       ├── error-boundary.tsx   # Error boundary component
│       ├── error-message.tsx   # Error display component
│       ├── empty-state.tsx     # Empty state component
│       ├── loading-skeleton.tsx # Loading skeleton components
│       ├── status-badge.tsx    # Status badge component
│       └── delete-confirmation-dialog.tsx # Delete confirmation modal
│
├── lib/                         # Utility libraries
│   ├── api.ts                  # API client and request utilities
│   ├── auth.ts                 # Authentication utilities (server-side)
│   ├── date-utils.ts           # Date formatting utilities
│   └── utils.ts                # General utilities (cn function)
│
├── public/                      # Static assets
├── package.json                 # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── next.config.js              # Next.js configuration
└── postcss.config.js           # PostCSS configuration
```

---

## UI Design Principles

### Design Philosophy

The application follows modern SaaS design principles with focus on:

1. **Clarity**: Clean, uncluttered interfaces with clear information hierarchy
2. **Consistency**: Uniform design patterns across all pages and components
3. **Accessibility**: WCAG-compliant components with proper ARIA labels and keyboard navigation
4. **Responsiveness**: Mobile-first design that works seamlessly across all device sizes
5. **User Feedback**: Clear loading states, error messages, and success indicators

### Color System

**Light Theme**:
- Primary Background: `#ffffff`
- Secondary Background: `#f9fafb`
- Primary Text: `#000000` (high visibility)
- Secondary Text: `#1f2937`
- Borders: `#e5e7eb`

**Dark Theme**:
- Primary Background: `#111827`
- Secondary Background: `#1f2937`
- Primary Text: `#f9fafb`
- Secondary Text: `#d1d5db`
- Borders: `#374151`

### Typography

- **Font Family**: Inter (Google Fonts)
- **Headings**: Semibold, hierarchical sizing with `tracking-tight`
- **Body Text**: Regular weight, readable sizes (base: 16px, sm: 14px)
- **Line Height**: Comfortable spacing for readability

### Component Patterns

- **Cards**: Rounded corners (`rounded-lg`), subtle shadows, clear borders
- **Buttons**: Clear hierarchy with consistent styling and hover states
- **Forms**: Consistent input styling with labels above inputs, inline validation
- **Tables**: Alternating row colors, hover states, clickable rows
- **Badges**: Color-coded status indicators with semantic meanings

### Responsive Breakpoints

- **Mobile**: `< 640px` (sm)
- **Tablet**: `640px - 1024px` (md)
- **Desktop**: `> 1024px` (lg)

---

## Backend Connectivity

### API Configuration

The frontend connects to a Node.js/Express backend API. Configuration is managed via environment variable:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500";
```

### Authentication Method

The application uses **JWT (JSON Web Tokens)** for authentication:

- **Token Storage**: `localStorage` for client-side components, cookies for server-side components
- **Token Transmission**: Sent as `Authorization: Bearer <token>` header
- **Automatic Injection**: Tokens automatically included in all API requests via `apiRequest` function

### Main API Endpoints

**Authentication**:
- `POST /api/v1/auth/sign-up` - User registration
- `POST /api/v1/auth/sign-in` - User login

**User Management**:
- `GET /api/v1/user/me` - Get current authenticated user

**Subscription Management**:
- `GET /api/v1/subscription/user/:userId` - Get all user subscriptions
- `POST /api/v1/subscription` - Create new subscription
- `PUT /api/v1/subscription/:id` - Update subscription
- `DELETE /api/v1/subscription/:id` - Delete subscription

### Data Normalization

The frontend handles backend data inconsistencies:
- ID mapping: Converts MongoDB `_id` to `id` for consistency
- Typo handling: Normalizes `renewaltDate` to `renewalDate`
- Date formatting: Converts ISO date strings to user-friendly formats

---

## Authentication Flow

### Registration

1. User fills out registration form with name, email, and password
2. Frontend validates password strength and matching
3. POST request to `/api/v1/auth/sign-up`
4. Backend returns JWT token
5. Token stored in `localStorage` and cookie
6. User redirected to `/dashboard`

### Login

1. User enters credentials on login page
2. POST request to `/api/v1/auth/sign-in`
3. Backend validates credentials and returns JWT token
4. Token stored in `localStorage` and cookie
5. User redirected to `/dashboard`

### Protected Routes

1. Server Component calls `requireAuth()`
2. `requireAuth()` checks for token in cookies
3. If token exists, validates with backend `/api/v1/user/me`
4. If valid, returns user data; if invalid/missing, redirects to `/login`

### Logout

1. User clicks logout button
2. Token removed from `localStorage` and cookie cleared
3. User redirected to `/login`

---

## Component Architecture

### Server Components

Used for data fetching, authentication checks, and initial page rendering:

- `app/dashboard/page.tsx`
- `app/subscriptions/page.tsx`
- `app/profile/page.tsx`

### Client Components

Used for user interactions, state management, and browser APIs:

- `components/add-subscription-form.tsx`
- `components/edit-subscription-form.tsx`
- `components/navigation.tsx`
- `app/login/page.tsx`
- `app/signup/page.tsx`

### Reusable UI Components

Located in `components/ui/`:

- **ErrorBoundary**: Catches and displays React errors
- **ErrorMessage**: Displays error messages to users
- **EmptyState**: Shows empty state when no data
- **LoadingSkeleton**: Loading placeholders (CardSkeleton, TableSkeleton)
- **StatusBadge**: Color-coded status indicators
- **DeleteConfirmationDialog**: Confirmation modal for deletions

---

## API Integration

### API Client

The API client (`lib/api.ts`) provides a unified interface:

```typescript
// GET request
const data = await api.get<ResponseType>("/endpoint");

// POST request
const data = await api.post<ResponseType>("/endpoint", payload);

// PUT request
const data = await api.put<ResponseType>("/endpoint", payload);

// DELETE request
const data = await api.delete<ResponseType>("/endpoint");
```

### Features

- Automatic token injection in Authorization header
- Error handling with meaningful error messages
- Type safety with generic types for response data
- Automatic JSON content-type headers

### Error Handling

```typescript
try {
  const response = await api.post("/endpoint", data);
} catch (err) {
  if (err instanceof ApiException) {
    // Handle API error with status code
    console.error(err.message, err.status);
  }
}
```

---

## Responsive Design

### Mobile-First Approach

All components are designed mobile-first, then enhanced for larger screens:

- **Mobile** (`< 640px`): Single column layouts, stacked elements
- **Tablet** (`640px - 1024px`): Two-column grids, side-by-side elements
- **Desktop** (`> 1024px`): Multi-column layouts, optimal spacing

### Responsive Patterns

- **Grid Layouts**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- **Typography**: `text-2xl sm:text-3xl`
- **Spacing**: `p-4 sm:p-6 lg:p-8`
- **Forms**: Stacked inputs on mobile, side-by-side on desktop

---

## Error Handling

### Error Boundaries

React Error Boundaries catch component errors:
- Global error boundary catches errors in page components
- Component-level boundaries for specific error handling

### Error Messages

- **API Errors**: Extracted from backend responses with user-friendly messages
- **Validation Errors**: Displayed inline in forms with proper ARIA attributes
- **Network Errors**: User-friendly fallback messages
- **404 Errors**: Custom not-found page

### Loading States

- **Skeletons**: Placeholder content during loading
- **Spinners**: Loading indicators for actions
- **Disabled States**: Prevent multiple submissions

---

## Development Guidelines

### Code Style

- **TypeScript**: Strict mode enabled
- **Components**: Functional components with hooks
- **Naming**: PascalCase for components, camelCase for functions
- **File Structure**: Co-located components and utilities

### Best Practices

1. **Server vs Client Components**: Use Server Components by default, Client Components only when needed
2. **Data Fetching**: Fetch data in Server Components when possible
3. **Error Handling**: Always handle errors gracefully with proper user feedback
4. **Accessibility**: Include ARIA labels, keyboard navigation, and proper semantic HTML
5. **Performance**: Use Next.js optimizations (Image, Link, Script)

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5500
```

---

## Deployment

### Build Process

```bash
npm run build
```

This creates an optimized production build in `.next/` directory.

### Production Start

```bash
npm start
```

### Environment Configuration

Set `NEXT_PUBLIC_API_URL` to your production backend URL in your deployment platform's environment variables.

---

## License

This project is part of a subscription management system. All rights reserved.

---

## Contributing

When contributing to this project:

1. Follow TypeScript best practices and maintain type safety
2. Maintain consistent component structure and naming conventions
3. Add proper error handling and user feedback
4. Ensure responsive design works across all breakpoints
5. Test on multiple devices and browsers
6. Update documentation for any significant changes

---

## Support

For issues or questions, please refer to the project documentation or contact:

- **Email**: nethminaappdevelopment1@gmail.com
- **LinkedIn**: [http://www.linkedin.com/in/neth-band](http://www.linkedin.com/in/neth-band)

---

**Built with Next.js, React, and TypeScript**
