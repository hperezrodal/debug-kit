# Contributing to DEBUG-KIT

Thank you for your interest in contributing to DEBUG-KIT! This document provides guidelines and instructions for contributing to this project.

## Prerequisites

Before you start contributing, make sure you have the following tools and knowledge:

### Required Tools

1. **Node.js**
   - Version 12.x or higher
   - npm or yarn package manager
   - Basic understanding of Node.js concepts

2. **Git**
   - Basic Git knowledge
   - GitHub account
   - Understanding of branching and pull requests

3. **Development Environment**
   - A text editor or IDE (VS Code, Vim, etc.)
   - Terminal emulator
   - Basic understanding of HTTP and networking concepts

### Recommended Knowledge

1. **HTTP and Networking**
   - Understanding of HTTP protocols
   - Basic networking concepts
   - Debugging tools and techniques

2. **Development Practices**
   - Version control best practices
   - Code review process
   - Testing methodologies
   - Documentation standards

### System Requirements

- **Operating System**: Linux or macOS
- **CPU**: 1+ core
- **RAM**: 2GB minimum
- **Storage**: 1GB free space minimum
- **Network**: Stable internet connection for npm/yarn packages

### Setting Up Your Environment

1. Install Node.js:
   ```bash
   # For Ubuntu/Debian
   curl -fsSL https://deb.nodesource.com/setup_12.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. Install Git:
   ```bash
   sudo apt-get install git
   ```

3. Clone the repository:
   ```bash
   git clone https://github.com/hperezrodal/debug-kit.git
   cd debug-kit
   ```

4. Install dependencies:
   ```bash
   npm install
   ```

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and considerate of others.

## How to Contribute

### Reporting Issues

1. Check if the issue has already been reported in the [Issues](https://github.com/hperezrodal/debug-kit/issues) section
2. If not, create a new issue with:
   - A clear, descriptive title
   - Detailed description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, Node.js version, etc.)
   - Any relevant error messages or logs

### Feature Requests

1. Check if the feature has already been requested
2. Create a new issue with:
   - A clear, descriptive title
   - Detailed description of the feature
   - Use cases and benefits
   - Any relevant examples or references

### Pull Requests

1. Fork the repository
2. Create a new branch for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Make your changes following the coding standards
4. Test your changes thoroughly
5. Update documentation if necessary
6. Submit a pull request with:
   - A clear description of the changes
   - Reference to any related issues
   - Screenshots or examples if applicable

## Development Guidelines

### Code Standards

- Follow JavaScript best practices:
  - Use ES6+ features where appropriate
  - Add proper error handling
  - Use meaningful variable names
  - Add comments for complex logic
  - Follow the existing code style

### Tool Development

1. When adding new tools:
   - Keep them simple and focused
   - Document usage in README.md
   - Add appropriate error handling
   - Include example usage
   - Add tests if applicable

2. For existing tools:
   - Maintain backward compatibility
   - Update documentation for changes
   - Add new features as options
   - Keep the tool lightweight

### Testing

1. Test your changes locally:
   ```bash
   # For example, testing request-dumper
   cd request-dumper
   node request-dumper.js
   ```

2. Verify the tool works as expected
3. Test edge cases and error conditions
4. Ensure backward compatibility

### Documentation

1. Update README.md for:
   - New tools
   - Configuration changes
   - Usage examples
   - Breaking changes

2. Add inline comments for:
   - Complex logic
   - Configuration options
   - Environment variables

## Release Process

1. Version numbering follows [Semantic Versioning](https://semver.org/)
2. Create a release branch:
   ```bash
   git checkout -b release/vX.Y.Z
   ```
3. Update version numbers and changelog
4. Create a pull request for review
5. After approval, merge and tag the release

## Getting Help

- Open an issue for questions
- Join our community discussions
- Check the documentation

## License

By contributing to this project, you agree that your contributions will be licensed under the project's MIT License. 