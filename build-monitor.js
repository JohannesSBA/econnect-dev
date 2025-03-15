// build-monitor.js
// Script to monitor build process and report progress to prevent timeouts

const fs = require('fs');
const path = require('path');

// Constants
const START_TIME = Date.now();
const MAX_BUILD_TIME = 50 * 60 * 1000; // 50 minutes (to stay under 60 min limit)
const HEARTBEAT_INTERVAL = 5 * 60 * 1000; // 5 minutes

// Report build progress
function reportProgress(message) {
  const elapsedMinutes = ((Date.now() - START_TIME) / 60000).toFixed(2);
  console.log(`[BUILD MONITOR] ${message} - Elapsed time: ${elapsedMinutes} minutes`);
}

// Create heartbeat function to prevent timeouts
function startHeartbeat() {
  const interval = setInterval(() => {
    const elapsedTime = Date.now() - START_TIME;
    
    if (elapsedTime > MAX_BUILD_TIME) {
      reportProgress('Build is taking too long, may be approaching timeout limit');
    } else {
      reportProgress('Build still in progress...');
    }
    
    // Write to filesystem to prevent idle timeout
    fs.writeFileSync(
      path.join(process.cwd(), '.build-heartbeat'),
      `Build heartbeat at ${new Date().toISOString()}`
    );
  }, HEARTBEAT_INTERVAL);
  
  // Clean up on exit
  process.on('exit', () => {
    clearInterval(interval);
    reportProgress('Build process completed');
  });
}

// Start the heartbeat
reportProgress('Build monitor started');
startHeartbeat();

// Export for potential programmatic use
module.exports = {
  reportProgress
}; 