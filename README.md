# DEBUG-KIT

**Debug Kit** is a collection of simple, standalone tools to help developers troubleshoot HTTP, network, and application issues easily.

Each tool is small, lightweight, and designed to run locally with minimal setup.

## Labels

![GitHub Release](https://img.shields.io/github/v/release/debug-kit/debug-kit?style=flat-square)
[![GitHub Issues](https://img.shields.io/github/issues/hperezrodal/debug-kit)](https://github.com/hperezrodal/debug-kit/issues)
[![GitHub Stars](https://img.shields.io/github/stars/hperezrodal/debug-kit)](https://github.com/hperezrodal/debug-kit/stargazers)
![Platform](https://img.shields.io/badge/platform-linux%20%7C%20macos-lightgrey?style=flat-square)
[![License](https://img.shields.io/github/license/hperezrodal/debug-kit)](LICENSE)
[![Bash Library](https://img.shields.io/badge/bash--library-v1.0.0-blue)](https://github.com/hperezrodal/debug-kit)

## Project Structure

## Tools

| Tool            | Description                                         |
|-----------------|-----------------------------------------------------|
| [HTTP Monitor](http-monitor/README.md)    | A simple HTTP proxy that prints requests and responses. |
| [Request Dumper](request-dumper/README.md) | A simple HTTP server that dumps incoming requests to both console and log file. |
| [TCP Echo Server](tcp-echo-server/README.md) | A simple TCP server that echoes back any data it receives, with configurable logging and error handling. |

## Prerequisites

### Required Tools

- **Node.js** (v14 or higher)
  - Required for running the HTTP Monitor and TCP Echo Server
  - Download from [nodejs.org](https://nodejs.org/)

- **npm** (Node Package Manager)
  - Comes bundled with Node.js
  - Used for installing dependencies

- **netcat** (optional)
  - Useful for testing the TCP Echo Server
  - Available on most Unix-like systems
  - On Ubuntu/Debian: `sudo apt-get install netcat`
  - On macOS: `brew install netcat`

### Getting Started

Each tool lives in its own folder.

To run a tool:
1. Navigate into the tool's folder.
2. Install dependencies: `npm install`
3. Follow the instructions in its `README.md`.

Example:

```bash
cd http-monitor
npm install
node index.js
```

## Contributing

Contributions are always welcome! Please read the [contribution guidelines](CONTRIBUTING.md) first.

## License

MIT License - See [LICENSE](LICENSE) file for details

---

Made with ❤️ by [hperezrodal](https://github.com/hperezrodal) 
