# Database Setup Guide

## Supabase Configuration

Your BusinessOS_AI app uses Supabase for real-time database functionality.

### Environment Variables

Already configured in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`: https://nwuwthuvgdkaucsqeqig.supabase.co
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your anon key
- `API_KEY`: Gemini API key

### Database Migration

Run the SQL migration in your Supabase dashboard:

1. Go to https://supabase.com/dashboard/project/nwuwthuvgdkaucsqeqig
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and run the SQL

This will create:
- ✅ `clients` table with RLS policies
- ✅ `social_posts` table with RLS policies
- ✅ `automations` table with RLS policies
- ✅ `payments` table with RLS policies
- ✅ `business_blueprints` table with RLS policies
- ✅ Real-time subscriptions enabled
- ✅ Automatic `updated_at` triggers
- ✅ Performance indexes
- ✅ Analytics view

### Real-Time Features Enabled

All tables have real-time subscriptions enabled:
- Changes sync instantly across all devices
- Multi-user collaboration ready
- Automatic conflict resolution
- Optimistic UI updates

### Row Level Security (RLS)

All tables are protected with RLS policies:
- Users can only access their own data
- Automatic user_id filtering
- Secure by default

### Testing the Setup

After running the migration:

1. Sign up for a new account in your app
2. Complete the onboarding process
3. Add a client - it should save to Supabase
4. Open the app in another browser/device
5. Changes should sync in real-time

### Verifying Data

Check your Supabase dashboard:
1. Go to **Table Editor**
2. You should see all 5 tables
3. Data should appear as you use the app

### Troubleshooting

**Issue: Tables not created**
- Ensure you ran the entire SQL migration
- Check for SQL errors in the Supabase SQL Editor

**Issue: Data not saving**
- Verify environment variables in Vercel
- Check browser console for errors
- Ensure RLS policies are enabled

**Issue: Real-time not working**
- Verify `ALTER PUBLICATION` commands ran successfully
- Check Supabase Realtime is enabled in project settings

### Next Steps

After database setup:
1. Deploy to Vercel (auto-deploys from GitHub)
2. Test authentication flow
3. Verify real-time sync
4. Add payment integration (Stripe/Razorpay)
5. Set up email service (SendGrid/Resend)
