const http = require('http');
const os = require('os');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const now = new Date().toISOString();

  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: now }));
    return;
  }

  if (req.url === '/api/info') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      hostname: os.hostname(),
      platform: os.platform(),
      uptime: os.uptime(),
      memory: {
        total: os.totalmem(),
        free: os.freemem()
      },
      node_version: process.version,
      timestamp: now
    }));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Node.js on EC2</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Courier New', monospace;
      background: #0d1117;
      color: #c9d1d9;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card {
      border: 1px solid #30363d;
      border-radius: 8px;
      padding: 40px;
      max-width: 520px;
      width: 100%;
      background: #161b22;
    }
    .badge {
      display: inline-block;
      background: #238636;
      color: #fff;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 12px;
      margin-bottom: 20px;
    }
    h1 { font-size: 24px; color: #f0f6fc; margin-bottom: 8px; }
    p  { font-size: 14px; color: #8b949e; margin-bottom: 24px; }
    .info { background: #0d1117; border: 1px solid #30363d; border-radius: 6px; padding: 16px; font-size: 13px; }
    .info div { display: flex; justify-content: space-between; padding: 4px 0; border-bottom: 1px solid #21262d; }
    .info div:last-child { border-bottom: none; }
    .label { color: #8b949e; }
    .value { color: #58a6ff; }
    .links { margin-top: 20px; display: flex; gap: 12px; }
    a { color: #58a6ff; text-decoration: none; font-size: 13px; border: 1px solid #30363d; padding: 6px 14px; border-radius: 6px; }
    a:hover { background: #21262d; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">● LIVE</span>
    <h1>Node.js EC2 App</h1>
    <p>Your Node.js application is running successfully on AWS EC2.</p>
    <div class="info">
      <div><span class="label">Host</span><span class="value">${os.hostname()}</span></div>
      <div><span class="label">Platform</span><span class="value">${os.platform()}</span></div>
      <div><span class="label">Node.js</span><span class="value">${process.version}</span></div>
      <div><span class="label">Port</span><span class="value">${PORT}</span></div>
      <div><span class="label">Time</span><span class="value">${now}</span></div>
    </div>
    <div class="links">
      <a href="/health">Health Check</a>
      <a href="/api/info">Server Info</a>
    </div>
  </div>
</body>
</html>
  `);
});

server.listen(PORT, () => {
  console.log(\`[${new Date().toISOString()}] Server started on port ${PORT}\`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => process.exit(0));
});
