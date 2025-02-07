/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env:{
   DATABASE_URL:process.env.DATABASE_URL,
   WEB3_AUTH_CLIENT_ID:process.env.WEB3_AUTH_CLIENT_ID,
   NEXT_PUBLIC_GEMINI_API_KEY:process.env.NEXT_PUBLIC_GEMINI_API,
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:process.env.NEXT_PUBLIC_GOOGLE_MAP,
  }
};

export default nextConfig;
