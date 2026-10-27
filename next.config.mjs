/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  allowedDevOrigins: ["10.56.2.30", "10.56.2.37", " 127.0.0.1:8090/api/health"], 
  images: {
    unoptimized: true,
  },
}

export default nextConfig
