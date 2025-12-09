# Firebase Storage CORS Configuration Guide

## The Problem
You're getting CORS errors when trying to upload images to Firebase Storage. This happens because Firebase Storage needs CORS to be configured to allow uploads from your domain.

## Solution: Configure CORS in Firebase Storage

### Option 1: Using Google Cloud Console (Recommended - Easiest)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `wbify-869a4`
3. Navigate to **Cloud Storage** → **Buckets**
4. Click on your bucket: `wbify-869a4.firebasestorage.app`
5. Click on the **Configuration** tab
6. Scroll down to **CORS configuration**
7. Click **Edit CORS configuration**
8. Paste the following JSON (from `cors.json` in your project):

```json
[
  {
    "origin": [
      "https://www.wbify.com",
      "https://wbify.com",
      "http://localhost:3000",
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:3000"
    ],
    "method": ["GET", "HEAD", "PUT", "POST", "DELETE", "OPTIONS"],
    "maxAgeSeconds": 3600,
    "responseHeader": [
      "Content-Type",
      "Authorization",
      "Content-Length",
      "x-goog-upload-command",
      "x-goog-upload-file-name",
      "x-goog-upload-offset",
      "x-goog-upload-protocol",
      "x-goog-upload-status"
    ]
  }
]
```

9. Click **Save**

### Option 2: Using gsutil (Command Line)

If you have `gsutil` installed (part of Google Cloud SDK):

```bash
gsutil cors set cors.json gs://wbify-869a4.firebasestorage.app
```

Where `cors.json` is the file in your project root.

### Option 3: Using Firebase CLI

1. Install Firebase CLI if you haven't:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Deploy storage rules:
   ```bash
   firebase deploy --only storage
   ```

## Deploy Storage Rules

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `wbify-869a4`
3. Go to **Storage** → **Rules**
4. Copy the content from `storage.rules` file in your project
5. Paste it in the rules editor
6. Click **Publish**

## Verify Setup

After configuring CORS and deploying rules:

1. Try uploading an image again from the admin panel
2. Check the browser console - CORS errors should be gone
3. Files should upload successfully to `ready-sites/` folder

## Security Note

The current storage rules allow public write access. For production, you should:

1. Enable Firebase Authentication
2. Update storage rules to:
   ```
   allow write: if request.auth != null;
   ```

This ensures only authenticated users can upload files.

