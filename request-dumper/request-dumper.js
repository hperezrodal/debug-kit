const http = require('http');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  port: process.env.PORT || 4000,
  logLevel: process.env.LOG_LEVEL || 'INFO',
  logFile: process.env.LOG_FILE || 'request-dumper.log'
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
const server = http.createServer((req, res) => {
  const requestId = Date.now().toString(36) + Math.random().toString(36).substr(2);
  let body = [];

  log('INFO', `[${requestId}] New request received`, {
    method: req.method,
    url: req.url,
    headers: req.headers
  });

  req.on('data', chunk => {
    body.push(chunk);
  });

  req.on('end', () => {
    const rawBody = Buffer.concat(body).toString();
    const parsedBody = tryParseJson(rawBody);

    const dump = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      body: parsedBody
    };

    log('DEBUG', `[${requestId}] Request body`, { body: parsedBody });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(dump, null, 2));
  });

  req.on('error', err => {
    log('ERROR', `[${requestId}] Request error`, { error: err.message });
    res.writeHead(500);
    res.end('Internal Server Error');
  });
});

// Error handling for the server
server.on('error', (err) => {
  log('ERROR', 'Server error', { error: err.message });
});

// Start the server
server.listen(config.port, () => {
  log('INFO', `Request Dumper server started`, {
    port: config.port,
    logLevel: config.logLevel,
    logFile: config.logFile
  });
});

// Handle process termination
process.on('SIGINT', () => {
  log('INFO', 'Shutting down Request Dumper server');
  server.close(() => {
    log('INFO', 'Request Dumper server stopped');
    process.exit(0);
  });
});

function tryParseJson(raw) {
  try {
    return JSON.parse(raw);
  } catch (_) {
    return raw;
  }
}
