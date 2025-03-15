// build-optimized.js
// This script provides an optimized build process for Next.js in production environments

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configuration
const BUILD_START_TIME = Date.now();
const BUILD_COMMAND = 'next build';

// Helper functions - simplified without chalk to avoid dependency issues
function log(message) {
  console.log(`[BUILD] ${message}`);
}

function logSuccess(message) {
  console.log(`✓ ${message}`);
}

function logError(message) {
  console.error(`✗ ${message}`);
}

function setEnvVars() {
  log('Setting environment variables for optimized build');
  
  // Set common optimization variables directly
  process.env.NODE_ENV = 'production';
  process.env.NEXT_TELEMETRY_DISABLED = '1';
  process.env.GENERATE_SOURCEMAP = 'false';
  
  // Set memory limit if not already set
  if (!process.env.NODE_OPTIONS || !process.env.NODE_OPTIONS.includes('--max-old-space-size')) {
    process.env.NODE_OPTIONS = `${process.env.NODE_OPTIONS || ''} --max-old-space-size=4096`.trim();
  }
  
  logSuccess(`Environment variables set`);
}

function executeCommand(command) {
  try {
    log(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    logError(`Command failed: ${error.message}`);
    return false;
  }
}

// Main build process - simplified to be more reliable
async function runBuild() {
  log('Starting optimized build process');
  
  // Set environment variables
  setEnvVars();
  
  // Execute the build command
  const success = executeCommand(BUILD_COMMAND);
  
  if (success) {
    const buildTimeSeconds = ((Date.now() - BUILD_START_TIME) / 1000).toFixed(2);
    logSuccess(`Build completed successfully in ${buildTimeSeconds} seconds`);
    process.exit(0);
  } else {
    logError('Build failed');
    process.exit(1);
  }
}

// Run the build with error handling
runBuild().catch(error => {
  logError(`Unexpected error during build: ${error.message}`);
  process.exit(1);
}); 