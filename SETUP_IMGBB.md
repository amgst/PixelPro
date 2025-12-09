# 🚀 Quick Setup: ImgBB API Key

## The Error You're Seeing
```
Error: Please set VITE_IMGBB_API_KEY in your .env file
```

## ⚡ Quick Fix (3 Steps)

### Step 1: Get Free ImgBB API Key (1 minute)

1. Go to: **https://api.imgbb.com/**
2. Click **"Get API Key"** or **"Sign Up"**
3. Sign up (it's free, no credit card needed)
4. After signing up, you'll see your API key
5. **Copy the API key** (it looks like: `abc123def456ghi789...`)

### Step 2: Add to Local Development

1. Create a `.env` file in your project root (same folder as `package.json`)
2. Add this line:

```
VITE_IMGBB_API_KEY=your_actual_api_key_here
```

Replace `your_actual_api_key_here` with the API key you copied.

3. **Restart your dev server**:
   - Stop it (Ctrl+C)
   - Start again: `npm run dev`

### Step 3: Add to Production (Vercel) - IMPORTANT!

Since you're seeing this error on **www.wbify.com**, you need to add it to Vercel:

1. Go to: **https://vercel.com/dashboard**
2. Select your project: **wbify.com** (or whatever your project name is)
3. Go to **Settings** → **Environment Variables**
4. Click **"Add New"**
5. Add:
   - **Name**: `VITE_IMGBB_API_KEY`
   - **Value**: Your ImgBB API key
   - **Environment**: Select all (Production, Preview, Development)
6. Click **"Save"**
7. **Redeploy** your application:
   - Go to **Deployments** tab
   - Click the three dots (⋮) on the latest deployment
   - Click **"Redeploy"**

---

## ✅ Test

After adding the API key:
1. Go to: https://www.wbify.com/admin/ready-sites
2. Try uploading an image
3. It should work! 🎉

---

## 📝 Example .env File

Your `.env` file should look like this:

```
VITE_IMGBB_API_KEY=abc123def456ghi789jkl012mno345pqr678
```

**Important**: 
- Don't share your API key publicly
- The `.env` file is already in `.gitignore` (safe)

---

## 🔗 Quick Links

- **Get API Key**: https://api.imgbb.com/
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Your Admin Panel**: https://www.wbify.com/admin/ready-sites

---

## ❓ Still Not Working?

1. **Check the API key** - Make sure you copied it correctly (no extra spaces)
2. **Restart dev server** - Environment variables only load on startup
3. **Redeploy on Vercel** - After adding env var, you must redeploy
4. **Check Vercel logs** - Go to your deployment → Logs to see if there are errors


