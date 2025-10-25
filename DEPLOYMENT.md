# Deployment Guide

This guide will walk you through deploying the Vinyl Wrapper Marketplace to Vercel.

## Prerequisites

- GitHub account
- Vercel account (free tier is fine)
- Resend account (free tier includes 3,000 emails/month)

## Step 1: Set Up Resend

1. Go to [resend.com](https://resend.com) and sign up
2. Verify your email address
3. Navigate to API Keys in the dashboard
4. Create a new API key and copy it (you'll need this later)

**Note:** With the free tier, you can only send from `onboarding@resend.dev`. To use a custom domain:
- Add your domain in Resend dashboard
- Verify DNS records
- Update the `from` field in `app/api/leads/route.ts`

## Step 2: Push Code to GitHub

If you haven't already pushed your code:

```bash
git add .
git commit -m "Initial commit: Vinyl wrapper marketplace MVP"
git push origin main
```

## Step 3: Deploy to Vercel

### Create New Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings

### Configure Build Settings

Vercel should automatically detect:
- **Framework Preset:** Next.js
- **Build Command:** `next build`
- **Output Directory:** `.next`

You can customize the build command to include Prisma generation:
- **Build Command:** `prisma generate && next build`

### Add Environment Variables

Click on "Environment Variables" and add:

```
DATABASE_URL=
RESEND_API_KEY=
ADMIN_PASSWORD=
ADMIN_EMAIL=
NEXT_PUBLIC_ADMIN_PASSWORD=
```

**Important:** Don't add the database URL yet - we'll get it in the next step.

### Deploy

Click "Deploy" - this first deployment may fail because we haven't set up the database yet. That's okay!

## Step 4: Set Up Vercel Postgres

1. In your Vercel project dashboard, go to the "Storage" tab
2. Click "Create Database"
3. Select "Postgres"
4. Choose a database name (e.g., "vinyl-wrapper-db")
5. Select a region (choose one close to your users)
6. Click "Create"

### Connect Database to Project

1. After creation, go to the database settings
2. Click on the ".env.local" tab
3. Copy the `DATABASE_URL`
4. Go back to your project → Settings → Environment Variables
5. Add/update the `DATABASE_URL` variable with the copied value
6. Make sure to add it for all environments (Production, Preview, Development)

## Step 5: Initialize Database Schema

You have two options:

### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally
npm i -g vercel

# Link your local project to Vercel
vercel link

# Pull environment variables
vercel env pull .env

# Push database schema
npx prisma db push

# (Optional) Seed the database with sample data
npm run seed
```

### Option B: Using Vercel Build Command

Update your build command in Vercel project settings:

```
prisma generate && prisma db push && next build
```

**Warning:** This will run migrations on every deploy, which may not be ideal.

## Step 6: Redeploy

1. Go to your Vercel project dashboard
2. Navigate to "Deployments"
3. Click on the three dots next to the latest deployment
4. Click "Redeploy"

Your application should now build and deploy successfully!

## Step 7: Verify Deployment

1. Visit your deployment URL (e.g., `https://your-project.vercel.app`)
2. Check the homepage loads correctly
3. Navigate to `/wrappers` (should be empty if you didn't seed)
4. Navigate to `/admin` and log in with your admin password
5. Add a test wrapper profile
6. Verify the wrapper appears on `/wrappers`
7. Click on the wrapper to view their profile
8. Submit a test lead form
9. Check that emails are sent (check spam folder)

## Environment Variables Reference

| Variable | Value | Where to Get It |
|----------|-------|-----------------|
| `DATABASE_URL` | `postgres://...` | Vercel Postgres dashboard |
| `RESEND_API_KEY` | `re_...` | Resend dashboard → API Keys |
| `ADMIN_PASSWORD` | Your chosen password | Create a secure password |
| `ADMIN_EMAIL` | your@email.com | Your admin email address |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | Same as ADMIN_PASSWORD | For MVP client-side check |

## Post-Deployment Tasks

### 1. Seed the Database

If you want sample data:

```bash
# From your local machine with Vercel env vars
vercel env pull .env
npm run seed
```

Or add wrappers manually via the admin panel at `/admin`

### 2. Set Up Custom Domain (Optional)

1. In Vercel project settings, go to "Domains"
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (can take up to 48 hours)

### 3. Configure Resend for Custom Domain (Optional)

1. Add domain in Resend dashboard
2. Add required DNS records
3. Verify domain
4. Update `from` field in `app/api/leads/route.ts`:

```typescript
from: 'Vinyl Wrapper Manchester <noreply@yourdomain.com>',
```

### 4. Monitor Emails

- Check Resend dashboard for email delivery status
- Monitor any bounces or failed deliveries
- Set up email forwarding if needed

## Troubleshooting

### Build Fails with Prisma Error

**Error:** `Prisma Client could not be generated`

**Solution:**
- Ensure `DATABASE_URL` is set in environment variables
- Update build command to include `prisma generate`

### Database Connection Error

**Error:** `Can't reach database server`

**Solution:**
- Verify `DATABASE_URL` is correct
- Check Vercel Postgres is in the same region
- Ensure database is not paused (Vercel pauses inactive databases)

### Emails Not Sending

**Possible causes:**
1. Invalid `RESEND_API_KEY`
2. Resend API rate limits exceeded
3. Invalid email addresses

**Solution:**
- Check Resend dashboard for errors
- Verify API key is correct
- Check email logs in Resend

### Admin Password Not Working

**Solution:**
- Verify `ADMIN_PASSWORD` and `NEXT_PUBLIC_ADMIN_PASSWORD` are set
- Clear browser session storage
- Try in incognito mode

### Images Not Loading

**Possible causes:**
1. Invalid image URLs
2. CORS issues
3. External image host blocking requests

**Solution:**
- Use valid, publicly accessible image URLs
- Recommended: Use Unsplash, Cloudinary, or Vercel Blob Storage
- Update `next.config.js` remote patterns if needed

## Updating Your Deployment

### Code Changes

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

Vercel will automatically deploy on push to main branch.

### Database Schema Changes

1. Update `prisma/schema.prisma`
2. Run locally: `npx prisma db push`
3. Test changes locally
4. Commit and push
5. In production, run migrations via Vercel CLI or build script

### Environment Variable Changes

1. Update in Vercel project settings
2. Redeploy the application

## Monitoring

### Analytics

- Enable Vercel Analytics in project settings
- Monitor page views and performance

### Logs

- View function logs in Vercel dashboard
- Check for errors in API routes
- Monitor database queries

### Performance

- Use Vercel Speed Insights
- Monitor Core Web Vitals
- Optimize images and assets

## Scaling Considerations

As your application grows:

1. **Database:** Upgrade Vercel Postgres plan or migrate to dedicated PostgreSQL
2. **Emails:** Upgrade Resend plan for higher volume
3. **Images:** Use Vercel Blob Storage or Cloudinary for portfolio images
4. **Caching:** Implement ISR (Incremental Static Regeneration) for wrapper listings
5. **CDN:** Leverage Vercel Edge Network for global performance

## Security Recommendations

For production use, consider:

1. **Authentication:** Replace simple password with NextAuth.js or Clerk
2. **Rate Limiting:** Add rate limiting to API routes
3. **Input Validation:** Use Zod or similar for form validation
4. **CSRF Protection:** Implement CSRF tokens for forms
5. **Environment Variables:** Never commit `.env` files
6. **Database:** Use connection pooling for production (PgBouncer)

## Support

- **Vercel Issues:** https://vercel.com/support
- **Resend Issues:** https://resend.com/docs
- **Prisma Issues:** https://www.prisma.io/docs

## Next Steps

After successful deployment:

1. Add real wrapper profiles via admin panel
2. Test lead submission flow end-to-end
3. Share the platform with local vinyl wrapper businesses
4. Gather feedback and iterate
5. Monitor usage and optimize based on analytics

Congratulations! Your Vinyl Wrapper Marketplace is now live!
