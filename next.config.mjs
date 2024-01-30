/** @type {import('next').NextConfig} */

const rewrites = async () => {
  return {
    fallback: [
      {
        source: "/api/system/:path*",
        destination: `http://47.98.40.189/api/system/:path*`,
      },
    ],
  };
};

const nextConfig = {
  reactStrictMode: false,
  // trailingSlash: true,
  rewrites,
};

export default nextConfig;
