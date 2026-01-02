# Backend Connection Guide

## ✅ Already Configured

The frontend is **already set up** to connect to your backend at `http://localhost:5500`. All API requests automatically include `credentials: "include"` for HttpOnly cookie authentication.

## 🔧 Configuration

The backend URL is configured in `lib/api.ts`:

```typescript
const API_BASE_URL = 'http://localhost:5500'
```

### To Change the Backend URL

If your backend runs on a different URL or port, update `lib/api.ts`:

```typescript
// For production
const API_BASE_URL = 'https://api.yourdomain.com'

// For different local port
const API_BASE_URL = 'http://localhost:3000'
```

## 🔐 Authentication Setup

All requests automatically include:
- `credentials: "include"` - For HttpOnly cookies
- `Content-Type: application/json` - For JSON requests

## 📡 Expected Backend Endpoints

Your backend should implement these endpoints:

### Authentication
- `POST /api/v1/auth/sign-in` - Login
  - Body: `{ email: string, password: string }`
  - Response: Sets HttpOnly cookie with JWT
  
- `POST /api/v1/auth/sign-up` - Register
  - Body: `{ name: string, email: string, password: string }`
  - Response: Sets HttpOnly cookie with JWT
  
- `POST /api/v1/auth/logout` - Logout
  - Response: Clears HttpOnly cookie
  
- `GET /api/v1/user/me` - Get current user
  - Response: `{ id: string, name: string, email: string, createdAt: string }`

### Subscriptions
- `GET /api/v1/subscription/:userId` - Get user subscriptions
  - Response: `Array<{ id, name, price, currency, frequency, renewalDate, status, category?, paymentMethod? }>`
  
- `GET /api/v1/subscription/:id` - Get single subscription
  - Response: `{ id, name, price, currency, frequency, renewalDate, status, category?, paymentMethod?, startDate?, nextReminderDate? }`
  
- `POST /api/v1/subscription` - Create subscription
  - Body: `{ name, price, currency, frequency, category?, paymentMethod?, startDate }`
  - Response: Created subscription object

## 🌐 CORS Configuration

Your backend **must** allow CORS with credentials. Example configuration:

### Express.js Example
```javascript
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:3000', // Next.js dev server
  credentials: true, // REQUIRED for HttpOnly cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Fastify Example
```javascript
await fastify.register(require('@fastify/cors'), {
  origin: 'http://localhost:3000',
  credentials: true
});
```

### NestJS Example
```typescript
app.enableCors({
  origin: 'http://localhost:3000',
  credentials: true,
});
```

## 🧪 Testing the Connection

### 1. Start Your Backend
```bash
# Make sure your backend is running on http://localhost:5500
# Your backend should be accessible at this URL
```

### 2. Start the Frontend
```bash
npm install
npm run dev
```

### 3. Test Login
1. Navigate to `http://localhost:3000/login`
2. Enter credentials
3. Check browser DevTools → Network tab
4. Look for request to `http://localhost:5500/api/v1/auth/sign-in`
5. Check if cookie is set in Application → Cookies

### 4. Verify Cookie is Set
- Open DevTools (F12)
- Go to Application → Cookies
- You should see a cookie set by `localhost:5500`
- It should be HttpOnly (not accessible via JavaScript)

## 🐛 Troubleshooting

### Issue: CORS Error
**Error:** `Access to fetch at 'http://localhost:5500/...' from origin 'http://localhost:3000' has been blocked by CORS policy`

**Solution:**
- Ensure backend has CORS enabled with `credentials: true`
- Check that `origin` includes `http://localhost:3000`

### Issue: Cookie Not Being Set
**Error:** Cookie is not appearing in browser

**Solution:**
- Verify backend sets cookie with `HttpOnly` flag
- Check cookie `SameSite` attribute (should be `Lax` or `None` with `Secure`)
- Ensure backend sends `Set-Cookie` header

### Issue: 401 Unauthorized
**Error:** Getting 401 errors after login

**Solution:**
- Verify JWT is valid
- Check cookie is being sent with requests (DevTools → Network → Request Headers)
- Ensure backend validates JWT from cookie

### Issue: Network Error
**Error:** `Network error occurred` or connection refused

**Solution:**
- Verify backend is running on `http://localhost:5500`
- Check backend is accessible: `curl http://localhost:5500/api/v1/user/me`
- Verify firewall isn't blocking the connection

## 🔍 Debugging Tips

### Check Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. Click on a request to see:
   - Request URL
   - Request Headers (check for `credentials: include`)
   - Response Headers (check for `Set-Cookie`)
   - Response body

### Check Cookies
1. DevTools → Application → Cookies
2. Look for cookies from `localhost:5500`
3. Verify `HttpOnly` flag is checked

### Test API Directly
```bash
# Test login endpoint
curl -X POST http://localhost:5500/api/v1/auth/sign-in \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}' \
  -v

# Test with cookie (after login)
curl http://localhost:5500/api/v1/user/me \
  -H "Cookie: your-cookie-name=your-jwt-token" \
  -v
```

## 📝 Environment Variables (Optional)

For different environments, you can use environment variables:

1. Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5500
```

2. Update `lib/api.ts`:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5500'
```

**Note:** Next.js requires `NEXT_PUBLIC_` prefix for client-side environment variables.

## ✅ Connection Checklist

- [ ] Backend is running on `http://localhost:5500`
- [ ] Backend has CORS enabled with `credentials: true`
- [ ] Backend sets HttpOnly cookies on login/signup
- [ ] Frontend is running on `http://localhost:3000`
- [ ] Can see API requests in Network tab
- [ ] Cookies are being set and sent with requests
- [ ] No CORS errors in console

## 🚀 Production Setup

For production, update the API base URL:

```typescript
// lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.yourdomain.com'
```

And ensure your production backend:
- Allows CORS from your frontend domain
- Uses HTTPS
- Sets secure cookies with proper `SameSite` attribute

