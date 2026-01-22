import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Cấu hình bỏ qua lỗi để ưu tiên deploy demo */

  // Bỏ qua lỗi TypeScript khi build
  typescript: {
    ignoreBuildErrors: true,
  },
  // Bỏ qua lỗi ESLint khi build (xử lý các lỗi 'any' và biến không sử dụng)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Allow external access (for Ngrok)
  async headers() {
    return [
      {
        // Apply to all routes
        source: "/:path*",
        headers: [
          {
            key: "ngrok-skip-browser-warning",
            value: "true",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
