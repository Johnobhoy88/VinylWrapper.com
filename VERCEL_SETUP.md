# Vercel Setup - Step by Step

Your repo is connected to Vercel. Follow these steps in order.

## Step 1: Create Vercel Postgres Database

1. Go to your Vercel project dashboard
2. Click on the **"Storage"** tab in the top navigation
3. Click **"Create Database"**
4. Select **"Postgres"**
5. Name it: `vinyl-wrapper-db` (or any name you prefer)
6. Select region: Choose closest to your target users (e.g., London for UK)
7. Click **"Create"**
8. Wait for database creation (~30 seconds)

## Step 2: Connect Database to Your Project

After database is created:

1. You'll see a success message
2. Vercel will show you connection options
3. Click **"Connect Project"**
4. Select your project from the dropdown
5. Click **"Connect"**

This automatically adds `DATABASE_URL` to your environment variables!

## Step 3: Get Resend API Key

1. Go to [resend.com](https://resend.com)
2. Sign up with your email (free tier is perfect)
3. Verify your email
4. Go to **API Keys** in the dashboard
5. Click **"Create API Key"**
6. Name it: "Vinyl Wrapper Production"
7. Copy the API key (starts with `re_...`)
   - ⚠️ Save it somewhere - you can't see it again!

## Step 4: Add Environment Variables

Go back to Vercel project:

1. Click **"Settings"** tab
2. Click **"Environment Variables"** in sidebar
3. Add these variables (click "Add" for each):

### Variable 1: RESEND_API_KEY
- **Key:** `RESEND_API_KEY`
- **Value:** Your key from Resend (re_...)
- **Environment:** Production, Preview, Development (select all 3)
- Click **"Save"**

### Variable 2: ADMIN_PASSWORD
- **Key:** `ADMIN_PASSWORD`
- **Value:** Create a secure password (e.g., `VinylAdmin2024!`)
- **Environment:** Production, Preview, Development (select all 3)
- Click **"Save"**

### Variable 3: ADMIN_EMAIL
- **Key:** `ADMIN_EMAIL`
- **Value:** Your email address
- **Environment:** Production, Preview, Development (select all 3)
- Click **"Save"**

### Variable 4: NEXT_PUBLIC_ADMIN_PASSWORD
- **Key:** `NEXT_PUBLIC_ADMIN_PASSWORD`
- **Value:** Same as ADMIN_PASSWORD above
- **Environment:** Production, Preview, Development (select all 3)
- Click **"Save"**

### Variable 5: DATABASE_URL (Should already exist)
- If not automatically added, get it from Storage tab → Your database → .env.local tab
- Copy the `POSTGRES_PRISMA_URL` value

## Step 5: Deploy Your Application

1. Go to **"Deployments"** tab
2. Your latest commit should be there
3. If not deployed yet, click **"Deploy"** or **"Redeploy"**
4. Wait for build to complete (~2-3 minutes)

### If Build Fails:
Check the build logs. Common issues:
- Missing environment variables (go back to Step 4)
- Prisma issues (should be auto-resolved)

## Step 6: Initialize Database Schema

After successful deployment, you need to push your database schema.

### Option A: Using Terminal (Recommended)

From your local machine:

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Pull environment variables (including DATABASE_URL)
vercel env pull .env

# Push database schema
npx prisma db push

# Seed with sample data (optional but recommended for testing)
npm run seed
```

### Option B: Using Vercel Dashboard

1. Go to your Vercel project
2. Settings → Environment Variables
3. Copy your `DATABASE_URL`
4. Create a local `.env` file and paste it
5. Run locally:
   ```bash
   npx prisma db push
   npm run seed
   ```

## Step 7: Test Your Deployment

Visit your production URL (something like `https://your-project.vercel.app`)

### Test Checklist:

1. **Homepage** ✅
   - Visit the homepage
   - Should see landing page

2. **Wrappers Listing** ✅
   - Go to `/wrappers`
   - Should see 3 sample wrappers (if seeded)
   - Test the area filter dropdown

3. **Admin Panel** ✅
   - Go to `/admin`
   - Login with your `ADMIN_PASSWORD`
   - Add a new wrapper profile
   - Verify it appears on `/wrappers`

4. **Wrapper Profile** ✅
   - Click on a wrapper from the listings
   - Should see full profile with portfolio

5. **Lead Form** ✅
   - Fill out the lead request form
   - Submit it
   - Check your email (wrapper email, customer email, admin email)
   - **Check spam folder!**

## Step 8: Verify Email Delivery

1. Go to [resend.com](https://resend.com) dashboard
2. Click **"Logs"** to see email delivery status
3. Verify emails were sent successfully

### Email Notes:
- Free tier sends from `onboarding@resend.dev`
- Emails might go to spam initially
- To use custom domain (e.g., noreply@yoursite.com):
  1. Add domain in Resend dashboard
  2. Verify DNS records
  3. Update `from` field in `app/api/leads/route.ts`

## Step 9: Add Real Wrapper Data

1. Go to `/admin` on your production site
2. Delete sample wrappers if needed
3. Add real vinyl wrapper businesses:
   - Business name
   - Contact email (they'll receive leads)
   - Phone number
   - Bio/description
   - Areas served (Manchester postcodes: M1, M2, etc.)
   - Portfolio image URLs

### Where to Get Portfolio Images:
- Ask wrappers for their images
- Use temporary Unsplash URLs for testing:
  - https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800
  - https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800
- Later: Upload to Cloudinary or Vercel Blob Storage

## Step 10: Set Up Custom Domain (Optional)

1. In Vercel project settings → **Domains**
2. Click **"Add"**
3. Enter your domain (e.g., `vinylwrappermanchester.com`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (up to 48 hours)

## Troubleshooting

### "Database connection error"
- Check `DATABASE_URL` in environment variables
- Verify database is not paused (Vercel pauses inactive free-tier DBs)
- Try from Storage tab: View database → Check connection

### "Emails not sending"
- Verify `RESEND_API_KEY` is correct
- Check Resend dashboard logs
- Free tier rate limit: 100 emails/day, 3000/month
- Emails may go to spam folder

### "Admin password not working"
- Clear browser cache and cookies
- Try incognito/private window
- Check `ADMIN_PASSWORD` and `NEXT_PUBLIC_ADMIN_PASSWORD` are identical
- Clear sessionStorage: Open browser console → `sessionStorage.clear()`

### "Prisma Client errors"
- Run `npx prisma db push` from terminal with Vercel env vars
- Or redeploy with updated build command

### "Images not loading"
- Ensure URLs are valid and publicly accessible
- Use https:// URLs (not http://)
- Recommended hosts: Unsplash, Cloudinary, Imgur

## Environment Variables Summary

Here's what you should have:

| Variable | Example Value | Source |
|----------|---------------|--------|
| `DATABASE_URL` | `postgres://...` | Auto-added by Vercel Postgres |
| `RESEND_API_KEY` | `re_abc123...` | resend.com dashboard |
| `ADMIN_PASSWORD` | `SecurePass123!` | You create this |
| `ADMIN_EMAIL` | `you@email.com` | Your email |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | `SecurePass123!` | Same as ADMIN_PASSWORD |

## Next Steps After Setup

1. **Test everything thoroughly**
2. **Add real wrapper profiles**
3. **Share the site with vinyl wrapper businesses**
4. **Monitor email delivery**
5. **Check Vercel analytics**

## Support

- Vercel issues: Check deployment logs
- Database issues: Vercel Storage tab
- Email issues: Resend dashboard logs

---

## Quick Commands Reference

```bash
# Pull environment variables from Vercel
vercel env pull .env

# Push database schema
npx prisma db push

# Seed database
npm run seed

# Open Prisma Studio to view data
npx prisma studio

# Test locally
npm run dev
```

You're all set! 🚀
