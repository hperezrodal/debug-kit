# TCP Echo Server

A simple TCP echo server that listens for incoming connections and echoes back any data it receives. This server is built with Node.js and includes features like configurable logging, error handling, and graceful shutdown.

## Features

- Echoes back any data received from clients
- Configurable logging with different levels (DEBUG, INFO, WARN, ERROR)
- Logs to both console and file
- Graceful shutdown handling
- Connection tracking with unique IDs
- Detailed error handling and reporting

## Configuration

The server can be configured using environment variables:

- `PORT`: The port number to listen on (default: 5000)
- `LOG_LEVEL`: The logging level (DEBUG, INFO, WARN, ERROR) (default: INFO)
- `LOG_FILE`: The path to the log file (default: tcp-echo-server.log)

## Usage

1. Start the server:
```bash
node tcp-echo-server.js
```

2. Connect to the server using a TCP client (e.g., netcat):
```bash
nc localhost 5000
```

3. Type any message and press Enter. The server will echo it back.

## Logging

The server provides detailed logging with the following levels:

- `DEBUG`: Detailed information for debugging
- `INFO`: General operational information
- `WARN`: Warning messages
- `ERROR`: Error messages

Logs are written to both the console and a log file (if configured).

## Error Handling

The server includes comprehensive error handling:
- Connection errors
- Socket errors
- Server errors
- Graceful shutdown on SIGINT

## Example

```bash
# Terminal 1 - Start the server
$ node tcp-echo-server.js
[2024-03-21T10:00:00.000Z] [INFO] TCP Echo Server started {"port":5000,"logLevel":"INFO","logFile":"tcp-echo-server.log"}

# Terminal 2 - Connect with netcat
$ nc localhost 5000
Hello, server!
Hello, server!
```
