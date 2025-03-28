# ChainElect Deployment Guide

This guide provides instructions for deploying ChainElect to Vercel and Render.

## Preparing for Deployment

Before deploying, ensure that your project builds successfully locally:

```bash
npm install
npm run build
```

## Environment Variables

Both Vercel and Render will require the following environment variables:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_CONTRACT_ADDRESS`: The deployed smart contract address
- `VITE_NETWORK_ID`: The blockchain network ID (80002 for Polygon Amoy)

**Important**: Never commit your private keys or sensitive tokens to your repository.

## Deploying to Vercel

1. Create an account on [Vercel](https://vercel.com) if you don't have one.
2. Install the Vercel CLI (optional):
   ```bash
   npm install -g vercel
   ```
3. Connect your GitHub repository:
   - Go to the Vercel dashboard
   - Click "New Project"
   - Import your GitHub repository
   - Configure project settings

4. Set environment variables:
   - In your project settings, go to the "Environment Variables" section
   - Add all the required variables from the .env file (except any private keys)

5. Deploy:
   - Vercel will automatically deploy your project
   - You can also deploy via CLI with: `vercel`

## Deploying to Render

1. Create an account on [Render](https://render.com) if you don't have one.
2. Connect your GitHub repository:
   - In the Render dashboard, click "New" and select "Web Service"
   - Connect to your GitHub repository

3. Configure deployment settings:
   - Select "Static Site" as the service type
   - Set build command to: `npm install && npm run build`
   - Set publish directory to: `dist`

4. Set environment variables:
   - In your service settings, go to the "Environment" section
   - Add all the required variables from the .env file (except any private keys)

5. Deploy:
   - Click "Create Static Site"
   - Render will automatically build and deploy your project

## Post-Deployment Verification

After deploying, verify that:
1. The application loads correctly
2. You can connect to the blockchain network
3. All features work as expected

If you encounter any issues, check the deployment logs on the respective platform. 