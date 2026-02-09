# Leo Player - Complete Setup Guide

This guide will walk you through setting up Leo Player from scratch.

## Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **Firebase Account** (free tier works)
- **Google Cloud Console Account** (for Drive API)

## Step 1: Clone and Install

```bash
git clone https://github.com/praveen2git/leo-player.git
cd leo-player
npm install
```

## Step 2: Firebase Setup

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name it "Leo Player" (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create Project"

### Enable Authentication

1. In your Firebase project, go to **Build → Authentication**
2. Click "Get Started"
3. Enable **Email/Password** sign-in method
4. Enable **Google** sign-in method
   - You'll configure the OAuth client later

### Create Firestore Database

1. Go to **Build → Firestore Database**
2. Click "Create Database"
3. Choose "Start in test mode" (for development)
4. Select your preferred location
5. Click "Enable"

### Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click the web icon (</>)
4. Register app with nickname "Leo Player Web"
5. Copy the `firebaseConfig` object

## Step 3: Google Drive API Setup

### Enable Drive API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project (or create new)
3. Go to **APIs & Services → Library**
4. Search for "Google Drive API"
5. Click "Enable"

### Create OAuth Credentials

1. Go to **APIs & Services → Credentials**
2. Click **Create Credentials → OAuth client ID**
3. Configure OAuth consent screen:
   - User Type: External
   - App name: "Leo Player"
   - User support email: your email
   - Developer contact: your email
   - Click "Save and Continue"
   - Scopes: Add the following:
     - `https://www.googleapis.com/auth/drive.readonly`
     - `https://www.googleapis.com/auth/drive.metadata.readonly`
   - Click "Save and Continue"
   - Test users: Add your email for testing
   - Click "Save and Continue"

4. Create OAuth Client:
   - Application type: **Web application**
   - Name: "Leo Player Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - Your production URL (if deploying)
   - Authorized redirect URIs:
     - `http://localhost:3000`
     - `http://localhost:3000/auth/callback`
   - Click "Create"
   - **Copy the Client ID and Client Secret**

### Link OAuth to Firebase

1. Go back to Firebase Console
2. **Authentication → Sign-in method → Google**
3. Paste your **Web SDK configuration**:
   - Client ID: from Google Cloud Console
   - Client Secret: from Google Cloud Console
4. Copy the redirect URI provided by Firebase
5. Go back to Google Cloud Console
6. Add Firebase's redirect URI to your OAuth client

## Step 4: Environment Variables

1. Copy the example env file:
```bash
cp .env.example .env
```

2. Edit `.env` and fill in your credentials:

```env
# Firebase Configuration (from Step 2)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Google Drive OAuth (from Step 3)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# NextAuth (generate a random secret)
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
NEXTAUTH_URL=http://localhost:3000

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

## Step 5: Firestore Security Rules

In Firebase Console, go to **Firestore → Rules** and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      match /playlists/{playlistId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      match /history/{historyId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

Click **Publish**.

## Step 6: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 7: Test the Application

1. **Sign Up/Login**:
   - Click "Get Started"
   - Choose "Continue with Google Drive"
   - Grant necessary permissions

2. **Browse Drive**:
   - You should see your Google Drive files
   - Navigate through folders

3. **Play Media**:
   - Click "Play All" on a folder with music/videos
   - Test the mini player controls

## Troubleshooting

### OAuth Error: redirect_uri_mismatch
- Ensure redirect URIs in Google Cloud Console exactly match your app URL
- Include both with and without trailing slash

### Firebase Auth Error
- Check that Email/Password and Google providers are enabled
- Verify API keys in `.env` are correct

### Drive API 403 Error
- Ensure Drive API is enabled in Google Cloud Console
- Check OAuth scopes include drive.readonly
- Verify OAuth consent screen is configured

### CORS Errors
- Add your domain to authorized origins in Google Cloud Console
- Check `next.config.js` image domains

## Next Steps

- **Customize UI**: Modify colors in `tailwind.config.js`
- **Add Features**: Implement additional player controls
- **Deploy**: Follow `DEPLOYMENT.md` for production deployment

## Support

For issues or questions:
- Create an issue on [GitHub](https://github.com/praveen2git/leo-player/issues)
- Check the [README](README.md) for more information

---

**Happy Playing! 🎵**
