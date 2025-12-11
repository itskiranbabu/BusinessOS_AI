# 🔑 How to Get Your Supabase Anon Key

## Quick Steps

1. **Go to your Supabase project:**
   https://supabase.com/dashboard/project/nwuwthuvgdkaucsqeqig

2. **Click Settings (gear icon) in the left sidebar**

3. **Click "API" in the settings menu**

4. **Find "Project API keys" section**

5. **Copy the "anon" / "public" key**
   - It's a long JWT token starting with: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - This is safe to use in client-side code
   - Do NOT use the "service_role" key (that's secret!)

6. **Also note your Project URL:**
   - Should be: `https://nwuwthuvgdkaucsqeqig.supabase.co`

---

## What to Do With These Values

### Add to Vercel Environment Variables

Go to: https://vercel.com/kiran-babus-projects-3418f8b5/business-os-ai/settings/environment-variables

Add these variables:

```
VITE_SUPABASE_URL = https://nwuwthuvgdkaucsqeqig.supabase.co
VITE_SUPABASE_ANON_KEY = [paste your anon key here]
```

**Important:**
- Check ALL three environment checkboxes: Production, Preview, Development
- No quotes needed around the values
- Make sure there are no extra spaces

---

## Visual Guide

Your Supabase API settings page should look like this:

```
Project API keys
├── Project URL: https://nwuwthuvgdkaucsqeqig.supabase.co
├── anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... [COPY THIS]
└── service_role secret: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... [DON'T USE THIS]
```

---

## Security Note

✅ **Safe to use in client-side code:**
- Project URL
- anon / public key

❌ **NEVER use in client-side code:**
- service_role key (this bypasses all security!)

The anon key is designed to be public and works with Row Level Security (RLS) policies to keep your data safe.

---

## After Adding to Vercel

1. **Redeploy your app**
2. **Clear browser cache** (Ctrl+Shift+Delete)
3. **Hard refresh** (Ctrl+Shift+R)
4. **Check console** for: `✅ Supabase client initialized successfully`
5. **Try signing up** with a new email

---

## Troubleshooting

### Can't find API settings?

Make sure you're logged into Supabase and have access to the project. The URL should be:
https://supabase.com/dashboard/project/nwuwthuvgdkaucsqeqig

### Project is paused?

If you see "Project is paused", click "Restore project" to activate it.

### Wrong project?

Make sure the project ID in the URL matches: `nwuwthuvgdkaucsqeqig`
