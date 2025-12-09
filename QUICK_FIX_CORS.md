# 🚨 QUICK FIX: CORS Error for Firebase Storage

## You're seeing this error:
```
Access to XMLHttpRequest at 'https://firebasestorage.googleapis.com/...' 
from origin 'https://www.wbify.com' has been blocked by CORS policy
```

## ⚡ Quick Fix (5 minutes)

### Step 1: Go to Google Cloud Console
👉 https://console.cloud.google.com/storage/browser?project=wbify-869a4

### Step 2: Select Your Bucket
1. Click on: `wbify-869a4.firebasestorage.app`
2. Click the **Configuration** tab (at the top)
3. Scroll down to find **CORS configuration**

### Step 3: Edit CORS Configuration
1. Click **Edit CORS configuration** button
2. **Delete** any existing CORS rules
3. **Paste** this JSON:

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

4. Click **Save**

### Step 4: Wait 1-2 minutes
CORS changes can take a minute to propagate.

### Step 5: Test
Try uploading an image again from your admin panel at `https://www.wbify.com/admin/ready-sites`

---

## Alternative: Using gsutil (if you have it installed)

```bash
gsutil cors set cors.json gs://wbify-869a4.firebasestorage.app
```

The `cors.json` file is already in your project root with the correct configuration.

---

## Still not working?

1. **Clear browser cache** and try again
2. **Check Storage Rules** in Firebase Console:
   - Go to: https://console.firebase.google.com/project/wbify-869a4/storage/rules
   - Make sure rules allow write access
   - Copy from `storage.rules` file if needed
3. **Verify bucket name**: Make sure it's `wbify-869a4.firebasestorage.app`

---

## Need Help?

If CORS is still not working after following these steps, the issue might be:
- Storage rules blocking the upload
- Bucket permissions
- Network/firewall issues

Check the browser console for more specific error messages.


