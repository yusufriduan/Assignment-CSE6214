import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseHostname = supabaseUrl.replace(/^https?:\/\//, '');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: supabaseHostname,
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },

  devIndicators: {
    position: 'bottom-left' 
  },

  allowedDevOrigins: [
    process.env.LocalAddress || 'localhost', 
    process.env.VPNAddress || ''
  ].filter(Boolean)
};

export default nextConfig;