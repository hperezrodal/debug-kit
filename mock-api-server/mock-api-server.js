const http = require('http');
const fs = require('fs');
const path = require('path');

/**
 * Configuration
 * All settings can be overridden using environment variables
 */
const config = {
  port: process.env.PORT || 7000,
  mockPath: process.env.MOCK_PATH || path.join(__dirname, 'mock.json'),
  logLevel: process.env.LOG_LEVEL || 'INFO',
  logFile: process.env.LOG_FILE || 'mock-api-server.log'
};

/**
 * Logging configuration
 */
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

const CURRENT_LOG_LEVEL = LOG_LEVELS[config.logLevel] || LOG_LEVELS.INFO;

/**
 * Logger utility
 * @param {string} level - Log level (DEBUG, INFO, WARN, ERROR)
 * @param {string} message - Log message
 * @param {Object} [data] - Optional data to log
 */
function log(level, message, data = null) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}${data ? '\n' + JSON.stringify(data, null, 2) : ''}`;
  
  if (LOG_LEVELS[level] >= CURRENT_LOG_LEVEL) {
    console.log(logMessage);
  }
  
  if (config.logFile) {
    fs.appendFileSync(config.logFile, logMessage + '\n');
  }
}

/**
 * Loads and parses the mock response file
 * @returns {Object} Parsed mock response or error object
 */
function loadMockResponse() {
  try {
    const file = fs.readFileSync(config.mockPath, 'utf8');
    return JSON.parse(file);
  } catch (err) {
    log('ERROR', 'Error reading mock.json', { error: err.message });
    return {
      error: true,
      message: 'Could not load mock.json',
      details: err.message
    };
  }
}

/**
 * Generates a unique request ID
 * @returns {string} Unique request identifier
 */
function generateRequestId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Handles incoming HTTP requests
 * @param {http.IncomingMessage} req - HTTP request
 * @param {http.ServerResponse} res - HTTP response
 */
function handleRequest(req, res) {
  const requestId = generateRequestId();
  let requestBody = '';

  log('INFO', `[${requestId}] New request received`, {
    method: req.method,
    url: req.url,
    headers: req.headers
  });

  req.on('data', chunk => {
    requestBody += chunk.toString();
  });

  req.on('end', () => {
    if (requestBody) {
      log('DEBUG', `[${requestId}] Request body`, { body: requestBody });
    }

    const response = loadMockResponse();

    res.writeHead(200, {
      'Content-Type': 'application/json',
      'X-Request-ID': requestId
    });

    res.end(JSON.stringify(response, null, 2));
  });

  req.on('error', err => {
    log('ERROR', `[${requestId}] Request error`, { error: err.message });
    res.writeHead(500);
    res.end(JSON.stringify({
      error: true,
      message: 'Internal Server Error',
      details: err.message
    }));
  });
}

/**
 * Handles server errors
 * @param {Error} err - Error object
 */
function handleServerError(err) {
  log('ERROR', 'Server error', { error: err.message });
}

/**
 * Handles process termination
 */
function handleShutdown() {
  log('INFO', 'Shutting down mock API server');
  server.close(() => {
    log('INFO', 'Mock API server stopped');
    process.exit(0);
  });
}

// Create and configure server
const server = http.createServer(handleRequest);
server.on('error', handleServerError);

// Start server
server.listen(config.port, () => {
  log('INFO', 'Mock API Server started', {
    port: config.port,
    mockPath: config.mockPath,
    logLevel: config.logLevel,
    logFile: config.logFile
  });
});

// Handle graceful shutdown
process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);
