// build-monitor.js
// Script to monitor build process and report progress to prevent timeouts

const fs = require('fs');
const path = require('path');

// Use a shorter interval and more efficient process
const START_TIME = Date.now();
const MAX_BUILD_TIME = 45 * 60 * 1000; // 45 minutes (to stay under 60 min limit)
const HEARTBEAT_INTERVAL = 2 * 60 * 1000; // 2 minutes (more frequent checks)

// Ensure we handle errors properly
process.on('uncaughtException', (err) => {
  console.error('[BUILD MONITOR] Uncaught exception:', err);
  // Don't exit process on uncaught exception - let the build continue
});

// Report build progress
function reportProgress(message) {
  try {
    const elapsedMinutes = ((Date.now() - START_TIME) / 60000).toFixed(2);
    console.log(`[BUILD MONITOR] ${message} - Elapsed time: ${elapsedMinutes} minutes`);
  } catch (error) {
    // Just log errors without failing
    console.error('[BUILD MONITOR] Error reporting progress:', error.message);
  }
}

// Create heartbeat function to prevent timeouts
function startHeartbeat() {
  try {
    reportProgress('Starting heartbeat monitoring');
    
    const interval = setInterval(() => {
      try {
        const elapsedTime = Date.now() - START_TIME;
        
        if (elapsedTime > MAX_BUILD_TIME) {
          reportProgress('Build is taking too long, may be approaching timeout limit');
        } else {
          reportProgress('Build still in progress...');
        }
        
        // Write to filesystem to prevent idle timeout
        try {
          fs.writeFileSync(
            path.join(process.cwd(), '.build-heartbeat'),
            `Build heartbeat at ${new Date().toISOString()}`
          );
        } catch (writeError) {
          console.error('[BUILD MONITOR] Error writing heartbeat file:', writeError.message);
          // Don't fail the build for heartbeat errors
        }
      } catch (loopError) {
        console.error('[BUILD MONITOR] Error in heartbeat interval:', loopError.message);
        // Don't fail the build for heartbeat errors
      }
    }, HEARTBEAT_INTERVAL);
    
    // Clean up on exit
    process.on('exit', () => {
      try {
        clearInterval(interval);
        reportProgress('Build process completed');
      } catch (exitError) {
        // Just log errors without failing
        console.error('[BUILD MONITOR] Error on exit:', exitError.message);
      }
    });
    
    return interval;
  } catch (error) {
    console.error('[BUILD MONITOR] Failed to start heartbeat:', error.message);
    // Return a dummy interval that does nothing
    return setInterval(() => {}, 1000000);
  }
}

// Try to start the monitor safely
try {
  reportProgress('Build monitor started');
  const heartbeatInterval = startHeartbeat();
  
  // Make sure we clean up if the process is terminated
  ['SIGINT', 'SIGTERM'].forEach(signal => {
    process.on(signal, () => {
      try {
        clearInterval(heartbeatInterval);
        reportProgress(`Received ${signal}, shutting down build monitor`);
        // Give time for final log message
        setTimeout(() => process.exit(0), 500);
      } catch (error) {
        // Just log errors without failing
        console.error(`[BUILD MONITOR] Error handling ${signal}:`, error.message);
      }
    });
  });
} catch (error) {
  console.error('[BUILD MONITOR] Critical error starting build monitor:', error.message);
  // Don't fail the build if the monitor can't start
}

// Export for potential programmatic use
module.exports = {
  reportProgress
}; 