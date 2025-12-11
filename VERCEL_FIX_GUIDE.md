# 🔧 Vercel Deployment Fix Guide

## Problem Summary
The "Failed to fetch" error on login is caused by **missing or incorrectly named environment variables** in Vercel. The app uses Vite which requires `VITE_` prefixed variables, but Vercel has `NEXT_PUBLIC_` prefixed variables.

## ✅ Solution Applied

### Code Changes (Already Committed)
1. ✅ Updated `vite.config.ts` to support both `VITE_` and `NEXT_PUBLIC_` prefixes
2. ✅ Updated `services/supabaseClient.ts` to use `import.meta.env` instead of `process.env`
3. ✅ Updated `components/Auth.tsx` to correctly detect Supabase configuration
4. ✅ Added `.env.example` for local development reference

### Required: Update Vercel Environment Variables

**You need to add VITE_ prefixed variables to Vercel:**

#### Step 1: Go to Vercel Project Settings
1. Open https://vercel.com/kiran-babus-projects-3418f8b5/business-os-ai/settings/environment-variables
2. You'll see existing variables with `NEXT_PUBLIC_` prefix

#### Step 2: Add New Variables with VITE_ Prefix

Add these **3 new environment variables** (keep the existing ones too):

| Variable Name | Value | Environments |
|--------------|-------|--------------|
| `VITE_SUPABASE_URL` | Copy from `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | Copy from `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview, Development |
| `VITE_API_KEY` | Copy from `API_KEY` | Production, Preview, Development |

**Important:** 
- Check all three environment checkboxes (Production, Preview, Development)
- The values should be the same as your existing variables, just with different names

#### Step 3: Redeploy
After adding the variables:
1. Go to Deployments tab
2. Click on the latest deployment
3. Click "Redeploy" button
4. Wait for the build to complete (~2-3 minutes)

## 🧪 Verification Steps

After redeployment, verify the fix:

1. **Open the app**: https://business-os-pymioikfz-kiran-babus-projects-3418f8b5.vercel.app
2. **Check the footer**: Should say "Connected to Supabase Secure Auth" (not "Demo Mode")
3. **Try to sign up**: Create a new account with your email
4. **Check for errors**: The "Failed to fetch" error should be gone

## 🔍 Troubleshooting

### Still seeing "Failed to fetch"?

1. **Check browser console** (F12 → Console tab):
   ```javascript
   // Look for these warnings:
   "Supabase is not configured"
   "Available env vars: { hasViteUrl: false, ... }"
   ```

2. **Verify environment variables in Vercel**:
   - All 6 variables should be present (3 VITE_, 3 NEXT_PUBLIC_)
   - All should have values (not empty)
   - All should be enabled for Production

3. **Check build logs**:
   - Go to Deployments → Latest deployment → Build Logs
   - Look for any errors during build process

### Still seeing "Demo Mode"?

This means environment variables aren't being loaded. Check:
- Variables are named exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Variables are enabled for the correct environment (Production)
- You redeployed after adding variables

## 📋 Current Environment Variables

Your Vercel project should have these 6 variables:

### Existing (Keep these):
- ✅ `API_KEY`
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### New (Add these):
- ⚠️ `VITE_API_KEY` (copy value from `API_KEY`)
- ⚠️ `VITE_SUPABASE_URL` (copy value from `NEXT_PUBLIC_SUPABASE_URL`)
- ⚠️ `VITE_SUPABASE_ANON_KEY` (copy value from `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

## 🎯 Next Steps After Fix

Once login works:

1. **Test the full flow**:
   - Sign up with a new account
   - Complete the onboarding wizard
   - Verify data saves to Supabase

2. **Check Supabase**:
   - Go to https://app.supabase.com
   - Open your project
   - Check Table Editor → users table
   - Verify your account appears

3. **Set up database** (if not done):
   - Follow instructions in `DATABASE_SETUP.md`
   - Run the SQL migrations in Supabase SQL Editor

## 🆘 Need Help?

If issues persist:
1. Share the browser console errors
2. Share the Vercel build logs
3. Verify your Supabase project is active and not paused

## 📚 Related Files
- `.env.example` - Local development environment variables
- `DATABASE_SETUP.md` - Database schema setup
- `vite.config.ts` - Build configuration
- `services/supabaseClient.ts` - Supabase initialization
