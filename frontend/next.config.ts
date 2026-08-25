import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["nodemailer", "sharp"],
  async headers() {
    const security =
      process.env.FORCE_HTTPS === "true"
        ? [
            {
              key: "Strict-Transport-Security",
              value: "max-age=31536000; includeSubDomains",
            },
          ]
        : [];
    return [
      {
        source: "/downloads/:path*",
        headers: [
          { key: "Content-Type", value: "application/vnd.android.package-archive" },
          {
            key: "Content-Disposition",
            value: "attachment; filename=\"civicconnect-india.apk\"",
          },
        ],
      },
      ...(security.length
        ? [{ source: "/:path*", headers: security }]
        : []),
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
