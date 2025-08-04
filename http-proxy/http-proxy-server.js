const http = require('http');
const axios = require('axios');
const https = require('https');

// Configuration
const config = {
  port: process.env.PORT || 8080,
  target: process.env.TARGET || 'https://localhost:8000', // Target server to proxy requests to
};

// Request counter
let requestCount = 0;

// Create an HTTP server
const server = http.createServer(async (req, res) => {
  // Increment request count
  requestCount++;
  console.log(`Request count: ${requestCount}`);

  // Log request details
  console.log(`Forwarding request to ${config.target + req.url}`);
  console.log('Request headers:', req.headers);

  // Remove the Host header and add authentication if needed
  const headers = { ...req.headers };
  delete headers['host'];
  // headers['Authorization'] = 'Bearer YOUR_TOKEN_HERE'; // Add authentication if needed

  try {
    // Forward the request to the target server using axios
    const response = await axios({
      method: req.method,
      url: config.target + req.url,
      headers: headers,
      data: req,
      responseType: 'stream',
      httpsAgent: new https.Agent({ rejectUnauthorized: false }) // Ignore SSL errors
    });

    // Pipe the response back to the client
    res.writeHead(response.status, response.headers);
    response.data.pipe(res);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.writeHead(502);
    res.end('Bad Gateway');
  }
});

// Start the server
server.listen(config.port, () => {
  console.log(`HTTP Proxy Server running on port ${config.port}`);
  console.log(`Proxying requests to ${config.target}`);
}); 