# 📱 Subscription Management System - Frontend

A modern, production-ready subscription management application built with Next.js 14, TypeScript, and Tailwind CSS. This frontend application provides a comprehensive interface for users to manage their subscriptions, track renewal dates, and monitor spending across different categories.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [UI Design Principles](#ui-design-principles)
- [Backend Connectivity](#backend-connectivity)
- [Third-Party Libraries](#third-party-libraries)
- [Authentication Flow](#authentication-flow)
- [Component Architecture](#component-architecture)
- [API Integration](#api-integration)
- [Responsive Design](#responsive-design)
- [Error Handling](#error-handling)
- [Development Guidelines](#development-guidelines)

---

## 🎯 Overview

This frontend application is a full-featured subscription management system that enables users to:

- **Track Subscriptions**: Add, view, edit, and delete subscriptions
- **Monitor Renewals**: Get insights on upcoming renewals and expiration dates
- **Analyze Spending**: View total monthly costs and category breakdowns
- **Manage Account**: Update profile information and preferences
- **Secure Authentication**: JWT-based authentication with secure token management

The application follows modern web development best practices, including server-side rendering, client-side interactivity, responsive design, and comprehensive error handling.

---

## ✨ Features

### 🔐 Authentication & Authorization

- **User Registration**: Create new accounts with email and password validation
- **User Login**: Secure authentication with JWT tokens
- **Session Management**: Token stored in both `localStorage` and cookies for client/server compatibility
- **Protected Routes**: Server-side authentication guards for protected pages
- **Auto-redirect**: Automatic redirection based on authentication status

### 📊 Dashboard

- **Summary Cards**:
  - Total Subscriptions count
  - Active Subscriptions count
  - Upcoming Renewals (next 7 days)
  - Total Monthly Cost (normalized across all frequencies)
- **Category Breakdown**: Visual representation of subscriptions by category
- **Subscriptions Table**: Comprehensive table with all subscription details
- **Quick Actions**: Direct links to add new subscriptions

### 📦 Subscription Management

- **Create Subscriptions**:
  - Name, price, currency (Rs/USD)
  - Billing frequency (daily, weekly, monthly, yearly)
  - Category selection
  - Payment method
  - Start date
- **View Subscriptions**:
  - List view with sorting and filtering
  - Detailed view with all subscription information
  - Renewal date calculations
  - Reminder date previews
- **Edit Subscriptions**: Update any subscription field
- **Delete Subscriptions**: Remove subscriptions with confirmation dialog

### 👤 User Profile

- **Account Information**: View name, email, and account creation date
- **Settings Management**: Profile and notification preferences
- **Logout Functionality**: Secure session termination

### 🎨 Theme System

- **Light/Dark Mode**: Toggle between light and dark themes
- **Persistent Preferences**: Theme choice saved in localStorage
- **System-Wide Application**: All UI components adapt to selected theme
- **High Visibility**: Dark text in light mode for optimal readability

---

## 🛠 Technology Stack

### Core Framework

- **Next.js 14.0.4**: React framework with App Router

  - Server-side rendering (SSR)
  - Server Components for data fetching
  - Client Components for interactivity
  - File-based routing
  - Built-in optimizations

- **React 18.2.0**: UI library

  - Hooks for state management
  - Component composition
  - Context API for theme management

- **TypeScript 5.3.3**: Type safety and developer experience
  - Strict type checking
  - Interface definitions
  - Type inference

### Styling

- **Tailwind CSS 3.4.0**: Utility-first CSS framework

  - Responsive design utilities
  - Dark mode support (class-based)
  - Custom color palette
  - Utility classes for rapid development

- **PostCSS 8.4.32**: CSS processing
- **Autoprefixer 10.4.16**: Automatic vendor prefixing

### Utility Libraries

- **clsx 2.0.0**: Conditional class name utility
- **tailwind-merge 2.2.0**: Merge Tailwind classes intelligently

### Development Tools

- **@types/node 20.10.6**: TypeScript definitions for Node.js
- **@types/react 18.2.46**: TypeScript definitions for React
- **@types/react-dom 18.2.18**: TypeScript definitions for React DOM

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18.0 or higher
- **npm**: Version 9.0 or higher (or yarn/pnpm)
- **Backend API**: Running on `http://localhost:5500` (or configure via environment variable)

### Installation

1. **Clone the repository** (if applicable) or navigate to the frontend directory:

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

## 📁 Project Structure

```
frontEnd/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with navigation and theme provider
│   ├── page.tsx                 # Home page (redirects to dashboard)
│   ├── globals.css              # Global styles and CSS variables
│   ├── dashboard/
│   │   └── page.tsx             # Dashboard page (server component)
│   ├── login/
│   │   └── page.tsx             # Login page (client component)
│   ├── signup/
│   │   └── page.tsx             # Registration page (client component)
│   ├── logout/
│   │   └── page.tsx             # Logout handler
│   ├── profile/
│   │   └── page.tsx             # User profile page
│   ├── subscriptions/
│   │   ├── page.tsx            # Subscriptions list page
│   │   ├── new/
│   │   │   └── page.tsx        # Add subscription page
│   │   └── [id]/
│   │       ├── page.tsx        # Subscription details page
│   │       └── edit/
│   │           └── page.tsx    # Edit subscription page
│   ├── error.tsx                # Global error boundary
│   ├── not-found.tsx            # 404 page
│   └── loading.tsx              # Loading UI
│
├── components/                   # React components
│   ├── navigation.tsx           # Main navigation bar
│   ├── dashboard-content.tsx    # Dashboard content component
│   ├── subscriptions-list.tsx # Subscriptions table component
│   ├── subscription-details.tsx # Subscription detail view
│   ├── add-subscription-form.tsx # Create subscription form
│   ├── edit-subscription-form.tsx # Edit subscription form
│   ├── profile-content.tsx      # Profile page content
│   └── ui/                      # Reusable UI components
│       ├── error-boundary.tsx  # Error boundary component
│       ├── error-message.tsx   # Error display component
│       ├── empty-state.tsx     # Empty state component
│       ├── loading-skeleton.tsx # Loading skeleton components
│       ├── status-badge.tsx   # Status badge component
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

## 🎨 UI Design Principles

### Design Philosophy

The application follows modern SaaS design principles with a focus on:

1. **Clarity**: Clean, uncluttered interfaces that prioritize information hierarchy
2. **Consistency**: Uniform design patterns across all pages and components
3. **Accessibility**: WCAG-compliant components with proper ARIA labels and keyboard navigation
4. **Responsiveness**: Mobile-first design that works seamlessly across all device sizes
5. **User Feedback**: Clear loading states, error messages, and success indicators

### Color System

#### Light Theme

- **Primary Background**: `#ffffff` (Pure white)
- **Secondary Background**: `#f9fafb` (Light gray)
- **Primary Text**: `#000000` (Pure black for high visibility)
- **Secondary Text**: `#1f2937` (Dark gray)
- **Borders**: `#e5e7eb` (Light gray)
- **Accent Colors**: Blue (`#2563eb`) for primary actions

#### Dark Theme

- **Primary Background**: `#111827` (Dark gray)
- **Secondary Background**: `#1f2937` (Medium dark gray)
- **Primary Text**: `#f9fafb` (Light gray/white)
- **Secondary Text**: `#d1d5db` (Medium light gray)
- **Borders**: `#374151` (Dark gray)
- **Accent Colors**: Blue (`#60a5fa`) for primary actions

### Typography

- **Font Family**: Inter (Google Fonts)
- **Headings**: Bold, hierarchical sizing (h1: 3xl, h2: 2xl, h3: xl)
- **Body Text**: Regular weight, readable sizes (base: 16px, sm: 14px)
- **Line Height**: Comfortable spacing for readability

### Spacing System

- **Container Padding**: Responsive (4px mobile → 8px desktop)
- **Card Padding**: 16px (mobile) → 24px (tablet+)
- **Component Gaps**: Consistent 16px/24px spacing
- **Section Margins**: 32px-48px between major sections

### Component Patterns

- **Cards**: Rounded corners (`rounded-lg`), subtle shadows, clear borders
- **Buttons**: Clear hierarchy (primary: blue, secondary: gray, danger: red)
- **Forms**: Consistent input styling, clear labels, helpful error messages
- **Tables**: Alternating row colors, hover states, clickable rows
- **Badges**: Color-coded status indicators with semantic meanings

### Responsive Breakpoints

- **Mobile**: `< 640px` (sm)
- **Tablet**: `640px - 1024px` (md)
- **Desktop**: `> 1024px` (lg)

---

## 🔌 Backend Connectivity

### API Configuration

The frontend connects to a Node.js/Express backend API. Configuration is managed in `lib/api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5500";
```

### Authentication Method

The application uses **JWT (JSON Web Tokens)** for authentication:

1. **Token Storage**:

   - `localStorage` for client-side components
   - Cookies for server-side components
   - Both are synchronized for compatibility

2. **Token Transmission**:

   - Sent as `Authorization: Bearer <token>` header
   - Automatically included in all API requests via `apiRequest` function

3. **Token Management**:
   - Retrieved from `localStorage` in client components
   - Retrieved from cookies in server components
   - Automatically cleared on logout

### API Endpoints

#### Authentication

- **POST** `/api/v1/auth/sign-up`

  - **Request Body**: `{ name: string, email: string, password: string }`
  - **Response**: `{ success: boolean, data: { token: string, user: User } }`
  - **Usage**: User registration

- **POST** `/api/v1/auth/sign-in`
  - **Request Body**: `{ email: string, password: string }`
  - **Response**: `{ success: boolean, data: { token: string, user: User } }`
  - **Usage**: User login

#### User Management

- **GET** `/api/v1/user/me`
  - **Headers**: `Authorization: Bearer <token>`
  - **Response**: `{ success: boolean, data: User }`
  - **Usage**: Get current authenticated user

#### Subscription Management

- **GET** `/api/v1/subscription/user/:userId`

  - **Headers**: `Authorization: Bearer <token>`
  - **Response**: `{ success: boolean, data: Subscription[] }`
  - **Usage**: Get all subscriptions for a user

- **POST** `/api/v1/subscription`

  - **Headers**: `Authorization: Bearer <token>`
  - **Request Body**:
    ```typescript
    {
      name: string
      price: number
      currency: 'Rs' | 'USD'
      frequency: 'daily' | 'weekly' | 'monthly' | 'yearly'
      category: string
      paymentMethod: string
      startDate: string (ISO format)
    }
    ```
  - **Response**: `{ success: boolean, data: Subscription }`
  - **Usage**: Create a new subscription

- **PUT** `/api/v1/subscription/:id`

  - **Headers**: `Authorization: Bearer <token>`
  - **Request Body**: Same as POST
  - **Response**: `{ success: boolean, data: Subscription }`
  - **Usage**: Update an existing subscription

- **DELETE** `/api/v1/subscription/:id`
  - **Headers**: `Authorization: Bearer <token>`
  - **Response**: `{ success: boolean }`
  - **Usage**: Delete a subscription

### Data Normalization

The frontend handles backend data inconsistencies:

- **ID Mapping**: Converts MongoDB `_id` to `id` for consistency
- **Typo Handling**: Handles `renewaltDate` typo from backend, normalizes to `renewalDate`
- **Date Formatting**: Converts ISO date strings to user-friendly formats
- **Error Handling**: Extracts meaningful error messages from backend responses

### Error Handling

The API client (`lib/api.ts`) provides comprehensive error handling:

- **HTTP Status Codes**: Properly handles 400, 401, 404, 500 errors
- **Error Message Extraction**: Parses JSON error responses
- **Fallback Messages**: Provides user-friendly error messages
- **Type Safety**: `ApiException` class for typed error handling

---

## 📚 Third-Party Libraries

### Core Dependencies

#### Next.js (`^14.0.4`)

**Purpose**: React framework for production

**Usage**:

- App Router for file-based routing
- Server Components for data fetching
- Client Components for interactivity
- Built-in optimizations (image, font, script)

**Key Features Used**:

- `next/navigation`: `useRouter`, `usePathname`, `redirect`, `notFound`
- `next/headers`: `cookies` for server-side token access
- `next/script`: `Script` component for theme initialization
- `next/link`: `Link` component for client-side navigation

#### React (`^18.2.0`) & React DOM (`^18.2.0`)

**Purpose**: UI library and DOM rendering

**Usage**:

- Component composition
- Hooks for state management (`useState`, `useEffect`, `useContext`)
- Context API for theme management
- Error boundaries for error handling

**Key Features Used**:

- Server Components (default)
- Client Components (`'use client'` directive)
- React Hooks for state and side effects
- Context API for global state

#### TypeScript (`^5.3.3`)

**Purpose**: Type safety and developer experience

**Usage**:

- Type definitions for all components and functions
- Interface definitions for data structures
- Type inference for better DX
- Compile-time error checking

**Key Features Used**:

- Strict type checking
- Interface definitions
- Generic types for API responses
- Type guards for runtime validation

### Styling Libraries

#### Tailwind CSS (`^3.4.0`)

**Purpose**: Utility-first CSS framework

**Usage**:

- Responsive design utilities
- Dark mode support (class-based)
- Custom color palette
- Utility classes for rapid development

**Configuration** (`tailwind.config.ts`):

```typescript
{
  darkMode: 'class', // Class-based dark mode
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
      },
    },
  },
}
```

**Key Features Used**:

- Responsive breakpoints (`sm:`, `md:`, `lg:`)
- Dark mode variants (`dark:`)
- Utility classes for spacing, colors, typography
- Custom CSS variables integration

#### PostCSS (`^8.4.32`)

**Purpose**: CSS processing and transformation

**Usage**:

- Processes Tailwind CSS
- Applies Autoprefixer
- Optimizes CSS output

#### Autoprefixer (`^10.4.16`)

**Purpose**: Automatic vendor prefixing

**Usage**:

- Adds browser-specific prefixes automatically
- Ensures cross-browser compatibility

### Utility Libraries

#### clsx (`^2.0.0`)

**Purpose**: Conditional class name utility

**Usage**:

```typescript
import { clsx } from "clsx";

// Conditional classes
clsx("base-class", condition && "conditional-class");
```

**Location**: Used in `lib/utils.ts` via `cn()` function

**Example**:

```typescript
cn("base-class", isActive && "active-class", className);
```

#### tailwind-merge (`^2.2.0`)

**Purpose**: Intelligently merge Tailwind CSS classes

**Usage**:

- Prevents class conflicts
- Merges conflicting Tailwind utilities
- Used in combination with `clsx` in `cn()` utility

**Example**:

```typescript
cn("px-4 py-2", "px-6"); // Results in 'py-2 px-6' (px-4 is overridden)
```

### Development Dependencies

#### @types/node (`^20.10.6`)

**Purpose**: TypeScript definitions for Node.js APIs

**Usage**: Type definitions for Node.js built-in modules used in Next.js

#### @types/react (`^18.2.46`)

**Purpose**: TypeScript definitions for React

**Usage**: Type safety for React components, hooks, and APIs

#### @types/react-dom (`^18.2.18`)

**Purpose**: TypeScript definitions for React DOM

**Usage**: Type safety for React DOM APIs

---

## 🔐 Authentication Flow

### Registration Flow

1. User fills out registration form (`/signup`)
2. Frontend validates password strength and matching
3. POST request to `/api/v1/auth/sign-up`
4. Backend returns JWT token
5. Token stored in:
   - `localStorage` (for client-side access)
   - Cookie (for server-side access)
6. User redirected to `/dashboard`

### Login Flow

1. User enters credentials on `/login`
2. POST request to `/api/v1/auth/sign-in`
3. Backend validates credentials and returns JWT token
4. Token stored in `localStorage` and cookie
5. User redirected to `/dashboard`

### Protected Route Flow

1. Server Component calls `requireAuth()`
2. `requireAuth()` checks for token in cookies
3. If token exists, validates with backend `/api/v1/user/me`
4. If valid, returns user data
5. If invalid/missing, redirects to `/login`

### Logout Flow

1. User clicks logout button
2. Token removed from `localStorage`
3. Cookie cleared
4. User redirected to `/login`

---

## 🏗 Component Architecture

### Server Components

Server Components are used for:

- Data fetching (dashboard, subscriptions list)
- Authentication checks
- Initial page rendering

**Examples**:

- `app/dashboard/page.tsx`
- `app/subscriptions/page.tsx`
- `app/profile/page.tsx`

### Client Components

Client Components are used for:

- User interactions (forms, buttons)
- State management
- Browser APIs (localStorage, window)

**Examples**:

- `components/add-subscription-form.tsx`
- `components/edit-subscription-form.tsx`
- `components/navigation.tsx`
- `app/login/page.tsx`

### Reusable UI Components

Located in `components/ui/`:

- **ErrorBoundary**: Catches and displays React errors
- **ErrorMessage**: Displays error messages to users
- **EmptyState**: Shows empty state when no data
- **LoadingSkeleton**: Loading placeholders (CardSkeleton, TableSkeleton)
- **StatusBadge**: Color-coded status indicators
- **DeleteConfirmationDialog**: Confirmation modal for deletions

---

## 🌐 API Integration

### API Client (`lib/api.ts`)

The API client provides a unified interface for backend communication:

```typescript
// GET request
const data = await api.get<ResponseType>("/endpoint");

// POST request
const data = await api.post<ResponseType>("/endpoint", { ...payload });

// PUT request
const data = await api.put<ResponseType>("/endpoint", { ...payload });

// DELETE request
const data = await api.delete<ResponseType>("/endpoint");
```

### Features

- **Automatic Token Injection**: Adds `Authorization` header if token exists
- **Error Handling**: Extracts meaningful error messages
- **Type Safety**: Generic types for response data
- **Content-Type**: Automatically sets JSON headers

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

## 📱 Responsive Design

### Mobile-First Approach

All components are designed mobile-first, then enhanced for larger screens:

- **Mobile** (`< 640px`): Single column layouts, stacked elements
- **Tablet** (`640px - 1024px`): Two-column grids, side-by-side elements
- **Desktop** (`> 1024px`): Multi-column layouts, optimal spacing

### Responsive Patterns

- **Grid Layouts**: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- **Typography**: `text-2xl sm:text-3xl`
- **Spacing**: `p-4 sm:p-6 lg:p-8`
- **Navigation**: Collapsible on mobile, full menu on desktop
- **Forms**: Stacked inputs on mobile, side-by-side on desktop

---

## ⚠️ Error Handling

### Error Boundaries

React Error Boundaries catch component errors:

- **Global Error Boundary**: Catches errors in page components
- **Component-Level Boundaries**: Specific error handling per section

### Error Messages

- **API Errors**: Extracted from backend responses
- **Validation Errors**: Displayed inline in forms
- **Network Errors**: User-friendly fallback messages
- **404 Errors**: Custom not-found page

### Loading States

- **Skeletons**: Placeholder content during loading
- **Spinners**: Loading indicators for actions
- **Disabled States**: Prevent multiple submissions

---

## 💻 Development Guidelines

### Code Style

- **TypeScript**: Strict mode enabled
- **Components**: Functional components with hooks
- **Naming**: PascalCase for components, camelCase for functions
- **File Structure**: Co-located components and utilities

### Best Practices

1. **Server vs Client Components**: Use Server Components by default, Client Components only when needed
2. **Data Fetching**: Fetch data in Server Components when possible
3. **Error Handling**: Always handle errors gracefully
4. **Accessibility**: Include ARIA labels and keyboard navigation
5. **Performance**: Use Next.js optimizations (Image, Link, Script)

### Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5500
```

---

## 🚀 Deployment

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

Set `NEXT_PUBLIC_API_URL` to your production backend URL.

---

## 📝 License

This project is part of a subscription management system. All rights reserved.

---

## 🤝 Contributing

When contributing to this project:

1. Follow TypeScript best practices
2. Maintain component structure
3. Add proper error handling
4. Ensure responsive design
5. Test on multiple devices
6. Update documentation

---

## 📞 Support

For issues or questions, please refer to the project documentation or contact the developer Email: nethminaappdevelopment1@gmail.com

LinkedIn: http://www.linkedin.com/in/neth-band

---

**Built with ❤️ using Next.js, React, and TypeScript**
