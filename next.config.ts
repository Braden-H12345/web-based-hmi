import type { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      { source: "/api/plc/:path*", destination: "http://localhost:4000/api/plc/:path*" },
    ];
  },
};
module.exports = nextConfig;

export default nextConfig;
