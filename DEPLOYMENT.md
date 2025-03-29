# ChainElect Deployment Guide

This guide provides instructions for deploying both the frontend and backend components of ChainElect to Vercel and Render.

## Project Structure

The project consists of two main components:
- Frontend: Vite/React application in the project root
- Backend: Node.js/Express API in the `ChainElectBackend` directory

## Preparing for Deployment

Before deploying, ensure that your project builds successfully locally:

```bash
# Build frontend
npm install
npm run build

# Test backend
cd ChainElectBackend
npm install
npm start
```

## Environment Variables

### Frontend Environment Variables

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_CONTRACT_ADDRESS`: The deployed smart contract address
- `VITE_NETWORK_ID`: The blockchain network ID (80002 for Polygon Amoy)
- `VITE_API_URL`: URL of your backend API (e.g., `https://chainelect-backend.onrender.com`)

### Backend Environment Variables

- `PORT`: Port for the backend server (default: 3000)
- `NODE_ENV`: Environment (production/development)
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase key
- `FRONTEND_URL`: URL of your frontend (for CORS)
- `SESSION_SECRET`: Secret for session management

**Important**: Never commit your private keys or sensitive tokens to your repository.

## Option 1: Deploying to Render (Recommended for Full-Stack)

Render allows you to deploy both frontend and backend services with automatic linking.

1. Create an account on [Render](https://render.com) if you don't have one.

2. Deploy Backend:
   - In the Render dashboard, click "New" and select "Web Service"
   - Connect to your GitHub repository
   - Configure as follows:
     - Name: `chainelect-backend`
     - Root Directory: `ChainElectBackend`
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `npm start`
   - Add all backend environment variables

3. Deploy Frontend:
   - In the Render dashboard, click "New" and select "Static Site"
   - Connect to your GitHub repository
   - Configure as follows:
     - Name: `chainelect-frontend`
     - Root Directory: (leave blank)
     - Build Command: `npm install && npm run build`
     - Publish Directory: `dist`
   - Add all frontend environment variables, including `VITE_API_URL` with the URL of your backend service

4. Alternative: Use Blueprint for Full Deployment
   - Render supports deployment via a `render.yaml` file (already included)
   - Go to the Render dashboard and click "New" → "Blueprint"
   - Connect to your GitHub repository
   - This will deploy both services at once

## Option 2: Deploying to Vercel (Frontend) and Render (Backend)

### Frontend on Vercel

1. Create an account on [Vercel](https://vercel.com) if you don't have one.

2. Deploy Frontend:
   - Go to the Vercel dashboard
   - Click "New Project"
   - Import your GitHub repository
   - Configure as follows:
     - Framework: Vite
     - Root Directory: (leave blank)
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Add all frontend environment variables, including `VITE_API_URL` with the URL of your backend service

### Backend on Render

Follow the backend deployment steps from Option 1.

## Configuration for API Communication

For the frontend to communicate with the backend:

1. Make sure `VITE_API_URL` is correctly set in your frontend environment variables:
   - For local development: `http://localhost:3000`
   - For production on Render: `https://chainelect-backend.onrender.com` (or your custom domain)
   - For production on Vercel with Render backend: `https://chainelect-backend.onrender.com` (or your custom domain)

2. Make sure `FRONTEND_URL` is correctly set in your backend environment variables for CORS:
   - For local development: `http://localhost:5173`
   - For production on Render: `https://chainelect-frontend.onrender.com` (or your custom domain) 
   - For production on Vercel: Your Vercel app URL (e.g., `https://chainelect.vercel.app`)

3. The code has been updated to use environment variables for all API calls:
   - The frontend now uses `src/utils/api.js` for all API requests
   - API endpoints are centralized in one place
   - The backend uses environment variables for CORS configuration

## Common Deployment Issues and Solutions

### CORS Issues

If you encounter CORS errors in the browser console:

1. Verify that `FRONTEND_URL` in your backend environment exactly matches your frontend URL, including the protocol (http/https)
2. Check that your backend's CORS middleware is correctly configured
3. For local testing, ensure both frontend and backend are running and properly configured

### Environment Variable Issues

If your app can't access environment variables:

1. For Vite: Ensure all variables are prefixed with `VITE_` (e.g., `VITE_API_URL`)
2. For Render and Vercel: Verify that all environment variables are properly set in the platform's dashboard
3. After updating environment variables, redeploy your application for changes to take effect

### Connection Issues

If your frontend can't connect to your backend:

1. Check if the backend is running (visit the API URL directly in your browser)
2. Verify that your frontend is using the correct API URL
3. Check network requests in your browser's developer tools for errors

## Testing the Deployment

After deploying both services:

1. Test user registration and login
2. Verify blockchain interactions
3. Check that file uploads and API requests work correctly

If you encounter CORS issues, double-check that your `FRONTEND_URL` in the backend environment variables exactly matches your deployed frontend URL. 