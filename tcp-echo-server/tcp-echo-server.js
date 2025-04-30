const net = require('net');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  port: process.env.PORT || 5000,
  logLevel: process.env.LOG_LEVEL || 'INFO',
  logFile: process.env.LOG_FILE || 'tcp-echo-server.log'
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
const server = net.createServer(socket => {
  const clientAddress = `${socket.remoteAddress}:${socket.remotePort}`;
  const connectionId = Date.now().toString(36) + Math.random().toString(36).substr(2);
  
  log('INFO', `[${connectionId}] New connection established`, {
    clientAddress,
    localAddress: `${socket.localAddress}:${socket.localPort}`
  });

  socket.on('data', data => {
    const message = data.toString();
    log('DEBUG', `[${connectionId}] Received data`, {
      clientAddress,
      message
    });
    
    // Echo back the data
    socket.write(data);
    log('DEBUG', `[${connectionId}] Echoed data back`, {
      clientAddress,
      message
    });
  });

  socket.on('end', () => {
    log('INFO', `[${connectionId}] Connection closed`, {
      clientAddress
    });
  });

  socket.on('error', err => {
    log('ERROR', `[${connectionId}] Socket error`, {
      clientAddress,
      error: err.message
    });
  });
});

// Error handling for the server
server.on('error', err => {
  log('ERROR', 'Server error', {
    error: err.message
  });
});

// Start the server
server.listen(config.port, () => {
  log('INFO', 'TCP Echo Server started', {
    port: config.port,
    logLevel: config.logLevel,
    logFile: config.logFile
  });
});

// Handle process termination
process.on('SIGINT', () => {
  log('INFO', 'Shutting down TCP Echo Server');
  server.close(() => {
    log('INFO', 'TCP Echo Server stopped');
    process.exit(0);
  });
});
