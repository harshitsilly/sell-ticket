# Deploying to Vercel

This guide will help you deploy the Sell Ticket application to Vercel with Prisma database.

## Prerequisites

1. A [Vercel](https://vercel.com) account
2. A [Prisma](https://www.prisma.io) database (either Prisma Cloud or self-hosted)
3. Git installed on your machine

## Step 1: Prepare Your Database

### Option A: Using Prisma Cloud (Recommended)

1. Sign up at [Prisma Cloud](https://cloud.prisma.io)
2. Create a new service
3. Deploy your datamodel from `server/prisma/datamodel.graphql`
4. Get your Prisma endpoint from the Prisma console
5. Copy the endpoint - you'll need it for Vercel environment variables

### Option B: Self-hosted Database

If you're using your own PostgreSQL database:

1. Set up a PostgreSQL database
2. Update `server/prisma/prisma.yml` with your database connection
3. Run `prisma deploy` to set up the database
4. Get your DATABASE_URL connection string

## Step 2: Configure Environment Variables

Set the following environment variables in your Vercel project settings:

### Required Variables

- `JWT_SECRET`: A strong random string for JWT token signing (generate with: `openssl rand -base64 32`)
- `SESSION_SECRET`: A strong random string for session encryption
- `PRISMA_ENDPOINT`: Your Prisma endpoint from Step 1 (or `DATABASE_URL` for self-hosted)

### Optional Variables (for OAuth)

- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `GOOGLE_CALLBACK_URL`: Your Vercel URL + `/auth/google/callback`
- `TWITTER_CONSUMER_KEY`: Twitter API consumer key
- `TWITTER_CONSUMER_SECRET`: Twitter API consumer secret
- `TWITTER_CALLBACK_URL`: Your Vercel URL + `/auth/twitter/callback`

## Step 3: Deploy to Vercel

### Method 1: Using Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel --prod
   ```

### Method 2: Using GitHub Integration

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Configure environment variables in the Vercel dashboard
4. Click Deploy

## Step 4: Post-Deployment Configuration

1. **Update OAuth Callback URLs** (if using OAuth):
   - Google: Set callback URL to `https://your-app.vercel.app/auth/google/callback`
   - Twitter: Set callback URL to `https://your-app.vercel.app/auth/twitter/callback`

2. **Test your GraphQL API**:
   - Visit `https://your-app.vercel.app/playground` to access GraphQL Playground
   - Test queries and mutations

3. **Update Client Configuration** (if needed):
   - The React app automatically connects to the same domain
   - No additional configuration needed if using relative URLs

## Important Notes

### Serverless Functions

- All API routes are converted to Vercel serverless functions in `/server/api/`
- GraphQL endpoint: `/graphql`
- GraphQL Playground: `/playground`
- Admin routes: `/admin/*`
- Auth routes: `/auth/*`

### Database Connection

- Prisma client is initialized as a singleton in `server/lib/prisma.js`
- In production, it uses the `PRISMA_ENDPOINT` or `DATABASE_URL` environment variable
- Make sure your database is accessible from Vercel's servers

### Limitations

- Push notifications use in-memory storage (not suitable for production with multiple serverless instances)
- For production push notifications, consider using a Redis or database-backed solution
- Serverless functions have a timeout limit (10 seconds on Hobby, 60 seconds on Pro)

### Build Process

- Vercel automatically runs `npm run build` during deployment
- The build creates a static React app in the `build/` directory
- Serverless functions are built separately and deployed to `/api/` routes

## Troubleshooting

### Prisma Connection Issues

If you see Prisma connection errors:
1. Verify your `PRISMA_ENDPOINT` or `DATABASE_URL` is correct
2. Check that your database allows connections from Vercel's IP ranges
3. Ensure your Prisma service is deployed and running

### Build Failures

If the build fails:
1. Check that all dependencies are in `package.json`
2. Ensure `prisma generate` runs successfully (added as postinstall script)
3. Verify Node.js version compatibility (Vercel uses Node 14 by default)

### Function Timeouts

If serverless functions timeout:
1. Optimize database queries
2. Consider using Prisma's dataloader for N+1 query problems
3. Upgrade to Vercel Pro for longer timeouts

## Need Help?

- Check the [Vercel documentation](https://vercel.com/docs)
- Check the [Prisma documentation](https://www.prisma.io/docs)
- Open an issue in the repository