// build-optimized.js
// This script provides an optimized build process for Next.js in production environments

const { execSync } = require('child_process');
const chalk = require('chalk') || { green: (s) => s, red: (s) => s, blue: (s) => s };
const path = require('path');
const fs = require('fs');

// Configuration
const BUILD_START_TIME = Date.now();
const BUILD_COMMAND = 'next build';
const BUILD_CONFIG = require('./deploy-config'); // Load our custom config

// Helper functions
function logStep(message) {
  console.log(chalk.blue(`\n[BUILD] ${message}`));
}

function logSuccess(message) {
  console.log(chalk.green(`✓ ${message}`));
}

function logError(message) {
  console.error(chalk.red(`✗ ${message}`));
}

function setEnvVars() {
  logStep('Setting environment variables for optimized build');
  Object.entries(BUILD_CONFIG.env).forEach(([key, value]) => {
    process.env[key] = value;
    logSuccess(`Set ${key}=${value}`);
  });
}

function executeCommand(command) {
  try {
    logStep(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    logError(`Command failed: ${error.message}`);
    return false;
  }
}

// Main build process
async function runBuild() {
  logStep('Starting optimized build process');
  
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

// Run the build
runBuild().catch(error => {
  logError(`Unexpected error during build: ${error.message}`);
  process.exit(1);
}); 