# Vercel Deployment Guide

This project has been configured to support Vercel deployment. Follow these steps to deploy:

## Prerequisites

- Vercel account (https://vercel.com)
- GitHub repository with this code
- Node.js 20.x or higher

## Deployment Steps

### 1. Connect to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy the project
vercel
```

### 2. Using Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Select your GitHub repository
4. Vercel will automatically detect the configuration
5. Click "Deploy"

### 3. Environment Variables

If your application requires environment variables, set them in Vercel:

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the following variables if needed:
   - `NODE_ENV`: Set to `production`
   - `BUILT_IN_FORGE_API_URL`: (if using Manus storage)
   - `BUILT_IN_FORGE_API_KEY`: (if using Manus storage)

## Project Structure

- **`client/`** - React frontend (Vite)
- **`server/`** - Express backend (local development)
- **`api/`** - Vercel serverless function entry point
- **`dist/`** - Build output (generated during build)

## Build Process

The build command runs:

```bash
npm run build
```

This:
1. Builds the React frontend with Vite → `dist/public`
2. Bundles the server code with esbuild → `dist/index.js`

## Troubleshooting

### Build Fails

- Check that all dependencies are listed in `package.json`
- Ensure `pnpm-lock.yaml` is committed to the repository
- Verify Node.js version compatibility

### Static Files Not Serving

- Ensure the build output is in `dist/public`
- Check that `vercel.json` has the correct `outputDirectory`

### Environment Variables Not Working

- Verify variables are set in Vercel project settings
- Restart the deployment after adding variables

## Local Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm run dev

# Build for production
pnpm run build

# Preview production build
pnpm run preview
```

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Documentation](https://vitejs.dev)
- [Express Documentation](https://expressjs.com)
