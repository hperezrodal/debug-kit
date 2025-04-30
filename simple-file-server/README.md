# Simple File Server

A lightweight, secure, and configurable file server built with Node.js. This server provides a simple way to serve static files and directories over HTTP with proper security headers and logging.

## Features

- Serve static files and directories
- File upload functionality
- Directory listing with clean HTML interface
- Configurable through environment variables
- Comprehensive logging (console and file)
- Security headers to prevent common web vulnerabilities
- Path traversal protection
- Graceful shutdown handling
- Proper MIME type detection

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Usage

### Basic Usage

```bash
node simple-file-server.js
```

This will start the server on port 8000 and serve files from the `public` directory.

### Configuration

The server can be configured using environment variables:

- `PORT`: Server port (default: 8000)
- `PUBLIC_DIR`: Directory to serve files from (default: ./public)
- `LOG_LEVEL`: Logging level (DEBUG, INFO, WARN, ERROR) (default: INFO)
- `LOG_FILE`: Path to log file (default: simple-file-server.log)
- `MAX_FILE_SIZE`: Maximum file size for uploads in bytes (default: 50MB)
- `ALLOWED_FILE_TYPES`: Comma-separated list of allowed MIME types for uploads (default: all types allowed)

Example:
```bash
PORT=8000 PUBLIC_DIR=./public LOG_LEVEL=DEBUG MAX_FILE_SIZE=10485760 ALLOWED_FILE_TYPES=image/jpeg,image/png node simple-file-server.js
```

This example:
- Runs the server on port 8000
- Uses the local `./public` directory
- Sets logging level to DEBUG for detailed output
- Limits file uploads to 10MB (10485760 bytes)
- Only allows JPEG and PNG image uploads

### File Upload

The server provides a simple file upload interface in the directory listing page. You can:

1. Upload single or multiple files
2. Files are automatically saved to the current directory
3. Original filenames and extensions are preserved
4. File size and type restrictions can be configured

#### Uploading Files with curl

You can upload files using curl with the following commands:

1. Upload a single file:
```bash
curl -X POST -F "files=@/path/to/your/file.jpg" http://localhost:8000/upload
```

2. Upload multiple files:
```bash
curl -X POST -F "files=@/path/to/file1.jpg" -F "files=@/path/to/file2.jpg" http://localhost:8000/upload
```

3. Upload with custom directory:
```bash
curl -X POST -F "files=@/path/to/file.jpg" http://localhost:8000/upload?dir=/custom/path
```

4. Upload with verbose output:
```bash
curl -v -X POST -F "files=@/path/to/file.jpg" http://localhost:8000/upload
```

The server will respond with a JSON object containing information about the uploaded files:
```json
{
  "success": true,
  "files": [
    {
      "name": "file.jpg",
      "size": 123456,
      "type": "image/jpeg"
    }
  ]
}
```

### Directory Structure

```
simple-file-server/
├── public/                # Default directory for serving files
├── simple-file-server.js
├── README.md
└── package.json
```

## Security Features

- Path traversal protection
- Security headers:
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: DENY
  - X-XSS-Protection: 1; mode=block
  - Strict-Transport-Security: max-age=31536000; includeSubDomains
- Configurable file upload restrictions
- File type validation
- File size limits

## Logging

The server provides detailed logging with timestamps and request IDs. Logs are written to both console and file (if configured).

Example log entry:
```
[2024-03-14T10:30:45.123Z] [INFO] [abc123] New request received
{
  "method": "GET",
  "url": "/example.txt",
  "decodedPath": "/example.txt",
  "filePath": "/path/to/public/example.txt"
}
```

## Error Handling

The server handles various error conditions gracefully:
- File not found (404)
- Path traversal attempts (403)
- Directory read errors (500)
- File streaming errors (500)
- File upload errors (500)
- File size limit exceeded
- Invalid file types
