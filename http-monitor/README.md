# HTTP Monitor Proxy

A HTTP monitoring and debugging proxy tool that provides detailed visibility into HTTP traffic between clients and servers.

## Features

- 🕵️‍♂️ **Request/Response Monitoring**
  - Captures complete HTTP requests and responses
  - Logs headers, bodies, and status codes
  - Unique request IDs for request/response correlation

- 📝 **Advanced Logging**
  - Configurable log levels (DEBUG, INFO, WARN, ERROR)
  - Timestamp for each log entry
  - File-based logging support
  - Structured JSON logging

- ⚙️ **Configurable**
  - Environment variable based configuration
  - Customizable target host and port
  - Adjustable proxy port
  - Configurable log file location

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd http-monitor
```

2. Install dependencies:
```bash
npm install
```

## Configuration

The proxy can be configured using environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `TARGET_HOST` | Target server hostname | localhost |
| `TARGET_PORT` | Target server port | 3002 |
| `PROXY_PORT` | Proxy server port | 6000 |
| `LOG_LEVEL` | Logging level (DEBUG, INFO, WARN, ERROR) | INFO |
| `LOG_FILE` | Path to log file | http-monitor.log |

## Usage

1. Start the proxy server:
```bash
node http-monitor.js
```

2. Configure your client to use the proxy:
```
http://localhost:6000
```

3. Monitor the logs:
```bash
tail -f http-monitor.log
```

## Example Log Output

```
[2024-03-14T10:30:45.123Z] [INFO] [abc123] New request received
{
  "method": "POST",
  "url": "/api/users",
  "headers": {
    "content-type": "application/json",
    "authorization": "Bearer token123"
  }
}
```

## Development

### Adding New Features

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### Running Tests

```bash
npm test
```
