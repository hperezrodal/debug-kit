const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  targetHost: process.env.TARGET_HOST || 'localhost',
  targetPort: process.env.TARGET_PORT || 3002,
  proxyPort: process.env.PROXY_PORT || 6000,
  logLevel: process.env.LOG_LEVEL || 'INFO',
  logFile: process.env.LOG_FILE || 'http-monitor.log'
};

// Logging levels
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

// Current log level
const CURRENT_LOG_LEVEL = LOG_LEVELS[config.logLevel] || LOG_LEVELS.INFO;

// Logging function
function log(level, message, data = null) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}${data ? '\n' + JSON.stringify(data, null, 2) : ''}`;
  
  // Log to console
  if (LOG_LEVELS[level] >= CURRENT_LOG_LEVEL) {
    console.log(logMessage);
  }
  
  // Log to file if configured
  if (config.logFile) {
    fs.appendFileSync(config.logFile, logMessage + '\n');
  }
}

// Create server
const server = http.createServer((clientReq, clientRes) => {
  const requestId = Date.now().toString(36) + Math.random().toString(36).substr(2);
  let requestBody = '';

  log('INFO', `[${requestId}] New request received`, {
    method: clientReq.method,
    url: clientReq.url,
    headers: clientReq.headers
  });

  // Capture the incoming request body
  clientReq.on('data', chunk => {
    requestBody += chunk.toString();
  });

  clientReq.on('end', () => {
    log('DEBUG', `[${requestId}] Request body`, { body: requestBody });

    // Prepare the options to forward the request
    const options = {
      hostname: config.targetHost,
      port: config.targetPort,
      path: clientReq.url,
      method: clientReq.method,
      headers: clientReq.headers
    };

    // Forward the request to the target
    const proxyReq = http.request(options, (proxyRes) => {
      let responseBody = '';

      log('INFO', `[${requestId}] Response received`, {
        statusCode: proxyRes.statusCode,
        headers: proxyRes.headers
      });

      proxyRes.on('data', chunk => {
        responseBody += chunk.toString();
      });

      proxyRes.on('end', () => {
        log('DEBUG', `[${requestId}] Response body`, { body: responseBody });

        // Forward the response back to the client
        clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
        clientRes.end(responseBody);
      });
    });

    proxyReq.on('error', (err) => {
      log('ERROR', `[${requestId}] Proxy request error`, { error: err.message });
      clientRes.writeHead(500);
      clientRes.end('Proxy error');
    });

    // Send the captured body to the target
    proxyReq.write(requestBody);
    proxyReq.end();
  });
});

// Error handling for the server
server.on('error', (err) => {
  log('ERROR', 'Server error', { error: err.message });
});

// Start the server
server.listen(config.proxyPort, () => {
  log('INFO', `Proxy server started`, {
    proxyPort: config.proxyPort,
    targetHost: config.targetHost,
    targetPort: config.targetPort,
    logLevel: config.logLevel,
    logFile: config.logFile
  });
});

// Handle process termination
process.on('SIGINT', () => {
  log('INFO', 'Shutting down proxy server');
  server.close(() => {
    log('INFO', 'Proxy server stopped');
    process.exit(0);
  });
});

