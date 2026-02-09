# Leo Player - Deployment Guide

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

#### Step 1: Prepare for Deployment

1. Ensure your code is pushed to GitHub:
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

2. Update environment variables for production

#### Step 2: Deploy to Vercel

**Using Vercel Dashboard:**

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "Add New Project"
4. Import your `leo-player` repository
5. Configure project:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

6. Add Environment Variables:
   - Click "Environment Variables"
   - Add all variables from your `.env` file
   - **Important**: Update these values:
     - `NEXTAUTH_URL`: Your production URL (e.g., `https://leo-player.vercel.app`)
     - `NEXT_PUBLIC_APP_URL`: Same as above

7. Click "Deploy"

**Using Vercel CLI:**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts
# Set up project
# Add environment variables when prompted

# Deploy to production
vercel --prod
```

#### Step 3: Update OAuth Redirect URIs

1. Get your Vercel deployment URL (e.g., `https://leo-player.vercel.app`)

2. **Google Cloud Console**:
   - Go to Credentials → Your OAuth Client
   - Add to Authorized JavaScript origins:
     - `https://leo-player.vercel.app`
   - Add to Authorized redirect URIs:
     - `https://leo-player.vercel.app`
     - `https://leo-player.vercel.app/auth/callback`
   - Save

3. **Firebase Console**:
   - Go to Authentication → Settings → Authorized domains
   - Add `leo-player.vercel.app`
   - Save

#### Step 4: Update Firestore Rules

Switch from test mode to production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

---

### Option 2: AWS Amplify

#### Prerequisites
- AWS Account
- AWS CLI installed

#### Steps

1. **Connect Repository**:
   - Open AWS Amplify Console
   - Click "New app" → "Host web app"
   - Choose GitHub and authorize
   - Select `leo-player` repository

2. **Configure Build Settings**:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

3. **Add Environment Variables**:
   - Go to App Settings → Environment variables
   - Add all variables from `.env`

4. **Deploy**:
   - Click "Save and deploy"

5. **Update OAuth URLs** (same as Vercel step 3)

---

### Option 3: Docker + Your Server

#### Create Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### Create .dockerignore

```
node_modules
.next
.git
.env
*.log
```

#### Build and Run

```bash
# Build
docker build -t leo-player .

# Run
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_FIREBASE_API_KEY=your_key \
  -e NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain \
  # ... add all env variables
  leo-player
```

#### Deploy to DigitalOcean/AWS EC2

1. Push image to Docker Hub or AWS ECR
2. SSH into your server
3. Pull and run the container
4. Set up nginx reverse proxy
5. Configure SSL with Let's Encrypt

---

## Post-Deployment Checklist

- [ ] Application loads successfully
- [ ] Authentication works (Email + Google)
- [ ] Google Drive connection successful
- [ ] Files load and display correctly
- [ ] Media playback works
- [ ] Mini player persists across pages
- [ ] Mobile responsive
- [ ] SSL certificate active (HTTPS)
- [ ] Environment variables secured
- [ ] Error monitoring set up (optional: Sentry)
- [ ] Analytics configured (optional: Google Analytics)

---

## Performance Optimization

### Enable Next.js Image Optimization

In `next.config.js`:
```javascript
module.exports = {
  images: {
    domains: ['lh3.googleusercontent.com', 'drive.google.com'],
    formats: ['image/avif', 'image/webp'],
  },
}
```

### Add Service Worker for Offline Support

Create `public/sw.js`:
```javascript
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('leo-player-v1').then((cache) => {
      return cache.addAll(['/']);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
```

### Enable Compression

Vercel automatically enables compression. For custom servers:

```bash
npm install compression
```

---

## Monitoring & Analytics

### Add Vercel Analytics

```bash
npm install @vercel/analytics
```

In `app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Add Error Tracking (Sentry)

```bash
npm install @sentry/nextjs
```

Run configuration:
```bash
npx @sentry/wizard@latest -i nextjs
```

---

## Scaling Considerations

### CDN for Media Streaming
- Use Cloudflare CDN for Drive media proxy
- Implement edge caching for thumbnails

### Database Optimization
- Use Firestore indexes for queries
- Implement pagination for large collections

### API Rate Limiting
- Implement rate limiting for Drive API calls
- Use Redis for caching Drive metadata

---

## Custom Domain

### Vercel
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Update OAuth redirect URIs

### AWS Amplify
1. Go to App Settings → Domain management
2. Add custom domain
3. Follow DNS verification steps

---

## Security Hardening

1. **Environment Variables**:
   - Never commit `.env` to git
   - Use secret management services

2. **API Keys**:
   - Restrict Firebase API keys by domain
   - Set up Firebase App Check

3. **OAuth Scopes**:
   - Only request necessary Drive scopes
   - Review consent screen regularly

4. **HTTPS Only**:
   - Enforce HTTPS in production
   - Set secure cookies

5. **CORS**:
   - Configure strict CORS policies
   - Whitelist only your domains

---

**Your Leo Player is now live! 🎉**
