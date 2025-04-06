/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // This is important to allow Next.js to access files in the /public folder
    webpack: (config) => {
      config.module.rules.push({
        test: /\.html$/,
        use: 'raw-loader',
      });
      return config;
    },
  };
  
  module.exports = nextConfig;