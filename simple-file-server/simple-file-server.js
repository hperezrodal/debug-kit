const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const { formidable } = require('formidable');

// Configuration
const config = {
  port: process.env.PORT || 8000,
  publicDir: process.env.PUBLIC_DIR ? path.resolve(process.env.PUBLIC_DIR) : path.join(__dirname, 'public'),
  logLevel: process.env.LOG_LEVEL || 'INFO',
  logFile: process.env.LOG_FILE || 'simple-file-server.log',
  maxFileSize: process.env.MAX_FILE_SIZE || 50 * 1024 * 1024, // 50MB default
  allowedFileTypes: process.env.ALLOWED_FILE_TYPES ? process.env.ALLOWED_FILE_TYPES.split(',') : null
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

// Ensure public directory exists
try {
  if (!fs.existsSync(config.publicDir)) {
    log('INFO', 'Creating public directory', { path: config.publicDir });
    fs.mkdirSync(config.publicDir, { recursive: true, mode: 0o755 });
  }
} catch (err) {
  log('ERROR', 'Failed to create public directory', { error: err.message });
  process.exit(1);
}

// Security headers
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
};

// Create server
const server = http.createServer((req, res) => {
  const requestId = Date.now().toString(36) + Math.random().toString(36).substring(2);
  const decodedPath = decodeURIComponent(req.url);
  const filePath = path.join(config.publicDir, decodedPath);

  log('INFO', `[${requestId}] New request received`, {
    method: req.method,
    url: req.url,
    decodedPath,
    filePath,
    publicDir: config.publicDir
  });

  // Handle file upload
  if (req.method === 'POST' && req.url === '/upload') {
    handleFileUpload(req, res, requestId);
    return;
  }

  // Prevent path traversal for all other requests
  const normalizedFilePath = path.normalize(filePath);
  const normalizedPublicDir = path.normalize(config.publicDir);
  
  if (!normalizedFilePath.startsWith(normalizedPublicDir)) {
    log('WARN', `[${requestId}] Path traversal attempt detected`, { 
      filePath: normalizedFilePath,
      publicDir: normalizedPublicDir
    });
    res.writeHead(403, securityHeaders);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err) {
      log('WARN', `[${requestId}] File not found`, { error: err.message });
      res.writeHead(404, securityHeaders);
      res.end('Not Found');
      return;
    }

    if (stats.isDirectory()) {
      handleDirectoryListing(req, res, filePath, decodedPath, requestId);
    } else if (stats.isFile()) {
      handleFileServing(req, res, filePath, requestId);
    } else {
      log('WARN', `[${requestId}] Invalid file type`, { filePath });
      res.writeHead(403, securityHeaders);
      res.end('Forbidden');
    }
  });
});

// Handle file upload
function handleFileUpload(req, res, requestId) {
  try {
    const form = formidable({
      uploadDir: config.publicDir,
      keepExtensions: true,
      maxFileSize: config.maxFileSize,
      filter: ({ mimetype }) => {
        if (!config.allowedFileTypes) return true;
        return config.allowedFileTypes.includes(mimetype);
      },
      multiples: true // Allow multiple files
    });

    form.parse(req, (err, fields, files) => {
      if (err) {
        log('ERROR', `[${requestId}] File upload error`, { error: err.message });
        res.writeHead(500, securityHeaders);
        res.end(JSON.stringify({ success: false, error: err.message }));
        return;
      }

      log('DEBUG', `[${requestId}] Form parsed`, { fields, files });

      // Handle both single file and multiple files
      let uploadedFiles = [];
      if (files.files) {
        if (Array.isArray(files.files)) {
          uploadedFiles = files.files.map(file => ({
            name: file.originalFilename,
            size: file.size,
            type: file.mimetype,
            path: file.filepath
          }));
        } else {
          uploadedFiles = [{
            name: files.files.originalFilename,
            size: files.files.size,
            type: files.files.mimetype,
            path: files.files.filepath
          }];
        }
      }

      log('INFO', `[${requestId}] Files uploaded successfully`, { files: uploadedFiles });
      
      res.writeHead(200, {
        ...securityHeaders,
        'Content-Type': 'application/json'
      });
      res.end(JSON.stringify({ success: true, files: uploadedFiles }));
    });
  } catch (err) {
    log('ERROR', `[${requestId}] Directory creation error`, { error: err.message });
    res.writeHead(500, securityHeaders);
    res.end(JSON.stringify({ success: false, error: 'Failed to create upload directory' }));
  }
}

// Handle directory listing
function handleDirectoryListing(req, res, filePath, decodedPath, requestId) {
  fs.readdir(filePath, (err, files) => {
    if (err) {
      log('ERROR', `[${requestId}] Error reading directory`, { error: err.message });
      res.writeHead(500, securityHeaders);
      res.end('Error reading directory');
      return;
    }

    const list = files.map(file => {
      const href = path.join(decodedPath, file);
      return `<li><a href="${href}">${file}</a></li>`;
    }).join('\n');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Index of ${decodedPath}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; }
          ul { list-style-type: none; padding: 0; }
          li { margin: 5px 0; }
          a { color: #0066cc; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .upload-form { margin: 20px 0; padding: 20px; background: #f5f5f5; border-radius: 5px; }
          .upload-form input[type="file"] { margin: 10px 0; }
          .upload-form button { padding: 10px 20px; background: #0066cc; color: white; border: none; border-radius: 5px; cursor: pointer; }
          .upload-form button:hover { background: #0052a3; }
        </style>
      </head>
      <body>
        <h1>Index of ${decodedPath}</h1>
        <div class="upload-form">
          <h2>Upload Files</h2>
          <form action="/upload" method="post" enctype="multipart/form-data">
            <input type="file" name="files" multiple>
            <button type="submit">Upload</button>
          </form>
        </div>
        <ul>${list}</ul>
      </body>
      </html>
    `;

    res.writeHead(200, {
      ...securityHeaders,
      'Content-Type': 'text/html'
    });
    res.end(html);
  });
}

// Handle file serving
function handleFileServing(req, res, filePath, requestId) {
  const contentType = mime.getType(filePath) || 'application/octet-stream';
  const headers = {
    ...securityHeaders,
    'Content-Type': contentType
  };

  res.writeHead(200, headers);
  const stream = fs.createReadStream(filePath);
  
  stream.pipe(res);
  stream.on('error', (err) => {
    log('ERROR', `[${requestId}] Error streaming file`, { error: err.message });
    res.writeHead(500, securityHeaders);
    res.end('Internal Server Error');
  });
}

// Error handling for the server
server.on('error', (err) => {
  log('ERROR', 'Server error', { error: err.message });
});

// Start the server
server.listen(config.port, () => {
  log('INFO', 'File server started', {
    port: config.port,
    publicDir: config.publicDir,
    logLevel: config.logLevel,
    logFile: config.logFile,
    maxFileSize: config.maxFileSize,
    allowedFileTypes: config.allowedFileTypes
  });
});

// Handle process termination
process.on('SIGINT', () => {
  log('INFO', 'Shutting down file server');
  server.close(() => {
    log('INFO', 'File server stopped');
    process.exit(0);
  });
});
