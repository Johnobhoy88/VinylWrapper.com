# Vinyl Wrapper Marketplace - Manchester

A Next.js 14 MVP marketplace connecting customers with professional vinyl wrapper services in Manchester and surrounding areas.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** Vercel Postgres + Prisma ORM
- **Styling:** Tailwind CSS
- **Email:** Resend
- **Deployment:** Vercel

## Features

### Customer Features
- Browse vinyl wrapper professionals
- Filter by postcode/area
- View wrapper portfolios and contact information
- Submit quote requests via lead form
- Automatic email notifications

### Admin Features
- Password-protected admin panel
- Add/edit/delete wrapper profiles
- Manage areas served and portfolio images

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Vercel account (for deployment)
- Resend account (for email notifications)

### Local Development

1. **Clone the repository**

```bash
git clone <repository-url>
cd VinylWrapper.com
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://..."

# Resend Email
RESEND_API_KEY="re_..."

# Admin
ADMIN_PASSWORD="your-secure-password"
ADMIN_EMAIL="admin@example.com"

# For client-side admin password (optional, defaults to checking server-side)
NEXT_PUBLIC_ADMIN_PASSWORD="your-secure-password"
```

4. **Set up the database**

```bash
# Generate Prisma Client
npx prisma generate

# Push the schema to your database
npx prisma db push

# (Optional) Open Prisma Studio to manage data
npx prisma studio
```

5. **Run the development server**

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## Deployment to Vercel

### 1. Set up Vercel Postgres

1. Go to your Vercel dashboard
2. Create a new Postgres database
3. Copy the `DATABASE_URL` connection string

### 2. Set up Resend

1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Note: In production, you'll need to verify your domain to send from a custom email address

### 3. Deploy to Vercel

1. **Push your code to GitHub**

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Import project in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

3. **Configure Environment Variables**

Add these environment variables in Vercel:

```
DATABASE_URL=<your-vercel-postgres-url>
RESEND_API_KEY=<your-resend-api-key>
ADMIN_PASSWORD=<your-admin-password>
ADMIN_EMAIL=<your-admin-email>
NEXT_PUBLIC_ADMIN_PASSWORD=<your-admin-password>
```

4. **Deploy**

Vercel will automatically:
- Install dependencies
- Run `npx prisma generate`
- Build the Next.js application
- Deploy to production

### 4. Initialize the Database

After deployment, you need to push the Prisma schema to your database:

1. Install Vercel CLI: `npm i -g vercel`
2. Link your project: `vercel link`
3. Pull environment variables: `vercel env pull`
4. Push database schema: `npx prisma db push`

Alternatively, you can use Vercel's deployment hooks or add a build command.

## Usage

### Admin Panel

1. Navigate to `/admin`
2. Enter your admin password
3. Add wrapper profiles with:
   - Name, email, phone
   - Bio/description
   - Areas served (comma-separated postcodes)
   - Portfolio image URLs

### Customer Flow

1. Visit homepage or `/wrappers`
2. Browse available wrappers
3. Filter by area/postcode
4. Click on a wrapper to view their profile
5. Fill out the lead form to request a quote
6. Receive email confirmation

### Email Notifications

When a customer submits a lead form:
- Wrapper receives an email with customer details
- Customer receives a confirmation email
- Admin receives a notification (if `ADMIN_EMAIL` is set)

## Project Structure

```
├── app/
│   ├── admin/              # Admin panel
│   ├── api/
│   │   ├── admin/          # Admin API routes
│   │   └── leads/          # Lead submission API
│   ├── wrappers/
│   │   ├── [id]/           # Individual wrapper profile
│   │   └── page.tsx        # Wrapper listings
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles
├── lib/
│   ├── prisma.ts           # Prisma client
│   └── resend.ts           # Resend client
├── prisma/
│   └── schema.prisma       # Database schema
└── package.json
```

## Database Schema

### Wrapper Model
- `id`: Unique identifier
- `name`: Wrapper business name
- `email`: Contact email
- `phone`: Contact phone
- `bio`: Description/bio
- `areasServed`: Array of postcodes/areas
- `portfolioImages`: Array of image URLs

### Lead Model
- `id`: Unique identifier
- `name`: Customer name
- `email`: Customer email
- `phone`: Customer phone
- `postcode`: Customer postcode
- `message`: Project details
- `wrapperId`: Reference to wrapper

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `RESEND_API_KEY` | Resend API key for emails | Yes |
| `ADMIN_PASSWORD` | Password for admin panel | Yes |
| `ADMIN_EMAIL` | Email to receive lead notifications | No |
| `NEXT_PUBLIC_ADMIN_PASSWORD` | Client-side admin password (for MVP) | No |

## Security Notes

This is an MVP with simplified authentication:
- Admin panel uses a simple password check
- In production, implement proper authentication (NextAuth.js, Clerk, etc.)
- The `NEXT_PUBLIC_ADMIN_PASSWORD` is visible to clients - use server-side auth for production

## Customization

### Changing the Default Email Address

By default, Resend uses `onboarding@resend.dev`. To use a custom domain:

1. Add and verify your domain in Resend dashboard
2. Update the `from` field in `/app/api/leads/route.ts`

### Styling

All styles use Tailwind CSS utility classes. Customize colors and theme in:
- `tailwind.config.ts`
- `app/globals.css`

## Troubleshooting

### Prisma Client Not Generated

```bash
npx prisma generate
```

### Database Connection Issues

Ensure `DATABASE_URL` is correctly set and accessible.

### Email Not Sending

- Verify `RESEND_API_KEY` is correct
- Check Resend dashboard for errors
- In development, emails may go to spam

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
