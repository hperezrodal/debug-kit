# Mock API Server

A lightweight HTTP server that serves mock responses from a JSON file. Perfect for development, testing, and API simulation.

## Features

- 🚀 Simple and lightweight implementation
- 📝 Serves mock responses from a JSON file
- ⚙️ Configurable through environment variables
- 📊 Detailed logging with multiple log levels
- 🔍 Request ID tracking for debugging
- 🛡️ Graceful shutdown handling
- ⚠️ Comprehensive error handling
- 📝 JSDoc documentation

## Configuration

The server can be configured using environment variables:

| Variable    | Description                          | Default Value        |
|-------------|--------------------------------------|----------------------|
| `PORT`      | Port number to listen on             | 7000                |
| `MOCK_PATH` | Path to the mock JSON file           | ./mock.json         |
| `LOG_LEVEL` | Logging level (DEBUG, INFO, WARN, ERROR) | INFO            |
| `LOG_FILE`  | Path to the log file                 | mock-api-server.log |

## Usage

1. Create a `mock.json` file with your mock responses:

```json
{
  "status": "success",
  "data": {
    "message": "This is a mock response"
  }
}
```

2. Start the server:

```bash
# Using default configuration
node mock-api-server.js

# Or with custom configuration
PORT=8000 LOG_LEVEL=DEBUG node mock-api-server.js
```

3. Make HTTP requests to the server:

```bash
curl http://localhost:7000
```

## Logging

The server provides detailed logging with the following features:

- 📅 Timestamp for each log entry
- 📊 Multiple log levels (DEBUG, INFO, WARN, ERROR)
- 🔍 Request tracking with unique IDs
- 📝 Request and response details
- ⚠️ Error reporting
- 📁 Configurable log file

Example log output:
```
[2024-03-14T10:30:45.123Z] [INFO] [abc123] New request received
{
  "method": "GET",
  "url": "/",
  "headers": {
    "host": "localhost:7000",
    "user-agent": "curl/7.68.0"
  }
}
```

## Error Handling

The server handles various error scenarios:

- 📄 File not found errors
- 🔍 JSON parsing errors
- 🔌 Request processing errors
- ⚠️ Server errors

All errors are logged and appropriate error responses are sent to the client:

```json
{
  "error": true,
  "message": "Error message",
  "details": "Detailed error information"
}
```

## Development

### Project Structure

```
mock-api-server/
├── mock-api-server.js  # Main server implementation
├── mock.json           # Mock response file
├── README.md           # Documentation
└── mock-api-server.log # Log file (if enabled)
```

### Modifying the Server

1. Edit `mock-api-server.js`
2. Test your changes
3. Update the documentation if needed
