// deploy-config.js
// This file is used to optimize the deployment process in AWS Amplify

module.exports = {
  env: {
    // Optimize Node environment for production builds
    NODE_ENV: 'production',
    // Increase memory limit for Node.js
    NODE_OPTIONS: '--max-old-space-size=4096',
    // Disable telemetry during build to save resources
    NEXT_TELEMETRY_DISABLED: '1',
    // Optimize Webpack for production builds
    GENERATE_SOURCEMAP: 'false',
  },
  build: {
    // Optimize production build
    productionBrowserSourceMaps: false,
    poweredByHeader: false,
    // Enable incremental builds for faster rebuilds (when applicable)
    incrementalBuilds: true,
    // Configure compression for optimal performance
    compression: 'gzip',
  }
}; 