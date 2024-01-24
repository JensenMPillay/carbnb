/** @type {import('next').NextConfig} */
const nextConfig = {
  // experimental: {
  //   serverMinification: false,
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lyqtkeirmhnfsfwpwzup.supabase.co",
        // port: "",
        // pathname: "",
      },
      {
        protocol: "https",
        hostname: "cdn.imagin.studio",
        // port: "",
        // pathname: "",
      },
      {
        protocol: "https",
        hostname: "dummyimage.com",
        // port: "",
        // pathname: "",
      },
    ],
  },
};

module.exports = nextConfig;
