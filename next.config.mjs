import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export const config = {
  matcher: ['/protected/:path*'], // Define your protected routes here
};

export default withAuth((req) => {
  const { user } = req;
  if (user) {
    return NextResponse.next();
  }

  return NextResponse.redirect('/api/auth/signin');
});

import { defineConfig } from 'next';
import tailwindcss from 'tailwindcss';

export default defineConfig({
  reactStrictMode: true,
  experimental: {
    appDir: true,
    serverActions: true,
  },
  sassOptions: {
    includePaths: ["./src/styles"],
  },
  pages: {
    '/': { title: 'AgentSync - Streamlined Task Management for Your AI Agents' },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  images: {
    domains: ['your-image-domain.com'], // Add your image domains
  },
  env: {
    NEXT_PUBLIC_STRIPE_KEY: process.env.NEXT_PUBLIC_STRIPE_KEY,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
  },
});