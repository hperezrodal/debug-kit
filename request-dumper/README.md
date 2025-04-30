# Request Dumper

A simple HTTP server that dumps incoming requests to both console and log file. Useful for debugging and inspecting HTTP requests.

## Features

- Dumps complete request information including:
  - HTTP method
  - URL
  - Headers
  - Request body (automatically parses JSON if possible)
- Configurable logging levels
- File-based logging
- Request ID tracking for better debugging
- Graceful shutdown handling

## Usage

### Basic Usage

```bash
node request-dumper.js
```

The server will start on port 4000 by default.

### Environment Variables

You can configure the server using the following environment variables:

- `PORT`: Port to listen on (default: 4000)
- `LOG_LEVEL`: Logging level (default: INFO)
  - Available levels: DEBUG, INFO, WARN, ERROR
- `LOG_FILE`: Path to log file (default: request-dumper.log)

Example:

```bash
PORT=3000 LOG_LEVEL=DEBUG LOG_FILE=debug.log node request-dumper.js
```

### Example Request

```bash
curl -X POST -H "Content-Type: application/json" -d '{"hello":"world"}' http://localhost:4000/test
```

Response:
```json
{
  "method": "POST",
  "url": "/test",
  "headers": {
    "host": "localhost:4000",
    "content-type": "application/json",
    "content-length": "17"
  },
  "body": {
    "hello": "world"
  }
}
```

## Logging

The server provides detailed logging with the following features:

- Timestamp for each log entry
- Log level indication
- Request ID tracking
- Both console and file logging
- Configurable log levels

Example log output:
```
[2024-03-21T10:30:45.123Z] [INFO] [abc123] New request received
{
  "method": "POST",
  "url": "/test",
  "headers": {
    "host": "localhost:4000",
    "content-type": "application/json"
  }
}
```

## Development

### Requirements

- Node.js 12.x or higher

### Testing

To test the server, you can use any HTTP client or curl:

```bash
# Test GET request
curl http://localhost:4000/test

# Test POST request with JSON
curl -X POST -H "Content-Type: application/json" -d '{"test":"data"}' http://localhost:4000/test
```
