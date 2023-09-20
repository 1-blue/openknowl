/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: {
      cssProp: true,
    },
  },
};

module.exports = nextConfig;
