# Quick Start Guide

Get the Vinyl Wrapper Marketplace running locally in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- npm installed
- A PostgreSQL database (local or remote)

## Quick Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your values:

```env
# For local development, you can use a free database from:
# - Supabase: https://supabase.com
# - Neon: https://neon.tech
# - Railway: https://railway.app
DATABASE_URL="postgresql://user:password@host:5432/database"

# Get free API key from https://resend.com
RESEND_API_KEY="re_..."

# Set your admin credentials
ADMIN_PASSWORD="admin123"
ADMIN_EMAIL="your@email.com"
NEXT_PUBLIC_ADMIN_PASSWORD="admin123"
```

### 3. Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed with sample data
npm run seed
```

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## What to Test

### Homepage
- ✅ Visit [http://localhost:3000](http://localhost:3000)
- ✅ Should see landing page with "Browse Wrappers" button

### Wrappers Listing
- ✅ Visit [http://localhost:3000/wrappers](http://localhost:3000/wrappers)
- ✅ If seeded, should see 3 sample wrappers
- ✅ Test area filter dropdown

### Admin Panel
- ✅ Visit [http://localhost:3000/admin](http://localhost:3000/admin)
- ✅ Login with password from `.env`
- ✅ Add a new wrapper profile
- ✅ Edit existing wrapper
- ✅ Delete a wrapper

### Wrapper Profile & Lead Form
- ✅ Click on a wrapper from listings
- ✅ View full profile with portfolio
- ✅ Fill out lead form
- ✅ Submit and check emails (will use Resend)

## Common Issues

### "PrismaClient is unable to run in this browser environment"

**Solution:** You're trying to use Prisma in a client component. Make sure database queries are in Server Components or API routes.

### "Invalid `prisma.wrapper.findMany()` invocation"

**Solution:** Database not initialized. Run:
```bash
npx prisma generate
npx prisma db push
```

### Emails not sending

**Solution:**
- Check `RESEND_API_KEY` is valid
- With free tier, can only send from `onboarding@resend.dev`
- Check Resend dashboard for errors

### Build errors

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Regenerate Prisma client
npx prisma generate
```

## Database Management

### View Database

```bash
npx prisma studio
```

Opens a GUI at [http://localhost:5555](http://localhost:5555) to browse/edit data.

### Reset Database

```bash
npx prisma db push --force-reset
npm run seed
```

⚠️ **Warning:** This deletes all data!

## File Structure

```
├── app/
│   ├── admin/              # Admin panel page
│   ├── api/
│   │   ├── admin/          # Admin CRUD operations
│   │   └── leads/          # Lead submission endpoint
│   ├── wrappers/           # Wrapper listings & profiles
│   ├── layout.tsx          # Root layout with nav
│   ├── page.tsx            # Homepage
│   └── globals.css         # Tailwind styles
├── lib/
│   ├── prisma.ts           # Prisma client singleton
│   └── resend.ts           # Resend email client
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Sample data
└── package.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Run production build
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with sample data

## Next Steps

1. Customize the branding and colors in `app/globals.css`
2. Update the navigation in `app/layout.tsx`
3. Add more Manchester postcodes to sample data
4. Test the full lead submission flow
5. Deploy to Vercel (see `DEPLOYMENT.md`)

## Getting Help

- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **Tailwind Docs:** https://tailwindcss.com/docs
- **Resend Docs:** https://resend.com/docs

## Tips for Development

### Hot Reload Not Working?

Restart the dev server: `Ctrl+C` then `npm run dev`

### Database Schema Changes

After editing `prisma/schema.prisma`:
```bash
npx prisma db push
npx prisma generate
```

Restart dev server to see changes.

### Adding New Manchester Areas

Edit wrapper data via `/admin` or update `prisma/seed.ts`:
```typescript
areasServed: ['M1', 'M2', 'M3', 'M4', 'Salford', 'Trafford'],
```

### Testing Email Sending

Use Resend's test mode or your own email to test:
1. Go to `/wrappers`
2. Click on a wrapper
3. Fill out lead form with your email
4. Check inbox (and spam!)

Happy coding!
