# HTTP Proxy Server

The **HTTP Proxy Server** is a robust tool designed to forward HTTP requests to a specified target server. It supports request logging and error handling, making it a valuable asset for debugging and development purposes.

## Features

- **Request Forwarding**: Forwards incoming HTTP requests to a target server.
- **Request Logging**: Logs details of each request, including headers and the target URL.
- **Error Handling**: Catches and logs errors, returning a `502 Bad Gateway` response in case of failure.
- **Request Counting**: Keeps track of the number of requests processed.

## Configuration

The server can be configured using environment variables:

- `PORT`: The port on which the proxy server listens. Defaults to `8080`.
- `TARGET`: The target server URL to which requests are forwarded. Defaults to `https://localhost:8000`.

## Usage

1. **Install Dependencies**: Ensure you have Node.js installed, then run `npm install` to install necessary packages.
2. **Run the Server**: Execute `node http-proxy-server.js` to start the proxy server.
3. **Send Requests**: Direct your HTTP requests to the proxy server's port. The server will forward them to the configured target.

## Example

To start the server on port 8080 and forward requests to `https://localhost:8000`:
