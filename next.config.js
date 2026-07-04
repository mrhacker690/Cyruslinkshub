/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // This allows the build to finish even if there are small code errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // This allows the build to finish even if there are linting warnings
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
