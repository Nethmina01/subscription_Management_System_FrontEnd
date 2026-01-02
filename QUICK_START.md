# Quick Start - Backend Connection

## 🚀 Quick Setup (3 Steps)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Your Backend
Make sure your backend is running on `http://localhost:5500`

### 3. Start Frontend
```bash
npm run dev
```

The frontend will automatically connect to `http://localhost:5500`

## ✅ Verify Connection

1. Open `http://localhost:3000/login`
2. Open Browser DevTools (F12) → Network tab
3. Try to login
4. Check if request goes to `http://localhost:5500/api/v1/auth/sign-in`

## 🔧 Change Backend URL

### Option 1: Edit `lib/api.ts`
```typescript
const API_BASE_URL = 'http://your-backend-url:port'
```

### Option 2: Use Environment Variable
1. Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://your-backend-url:port
```

2. Restart dev server

## ⚠️ Important: Backend CORS Setup

Your backend **must** allow CORS with credentials:

```javascript
// Express.js example
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true  // REQUIRED!
}));
```

## 🐛 Common Issues

**CORS Error?** → Backend needs CORS with `credentials: true`

**Cookie not set?** → Backend must set HttpOnly cookie with proper SameSite

**Connection refused?** → Check backend is running on port 5500

See `BACKEND_CONNECTION.md` for detailed troubleshooting.

