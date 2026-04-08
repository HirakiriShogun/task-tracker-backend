const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const { Readable, pipeline } = require('node:stream');

const distDir = path.join(__dirname, 'dist');
const backendBaseUrl = process.env.BACKEND_URL ?? 'http://backend:3000';
const port = Number(process.env.PORT ?? 80);

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
};

function sendFile(filePath, response) {
  const ext = path.extname(filePath).toLowerCase();
  response.writeHead(200, {
    'Content-Type': contentTypes[ext] ?? 'application/octet-stream',
    'Cache-Control':
      ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
  });

  pipeline(fs.createReadStream(filePath), response, () => {});
}

async function proxyRequest(request, response) {
  const upstreamPath = request.url.startsWith('/api/')
    ? request.url.replace(/^\/api/, '')
    : request.url;
  const targetUrl = new URL(upstreamPath, backendBaseUrl);
  const headers = new Headers();

  for (const [key, value] of Object.entries(request.headers)) {
    if (typeof value === 'string') {
      headers.set(key, value);
    }
  }

  headers.set('host', new URL(backendBaseUrl).host);

  const upstream = await fetch(targetUrl, {
    method: request.method,
    headers,
    body:
      request.method === 'GET' || request.method === 'HEAD'
        ? undefined
        : request,
    duplex: 'half',
  });

  const responseHeaders = {};
  upstream.headers.forEach((value, key) => {
    responseHeaders[key] = value;
  });

  response.writeHead(upstream.status, responseHeaders);

  if (!upstream.body) {
    response.end();
    return;
  }

  pipeline(Readable.fromWeb(upstream.body), response, () => {});
}

function resolveFilePath(urlPath) {
  const cleanPath = urlPath.split('?')[0];
  const normalizedPath = cleanPath === '/' ? '/index.html' : cleanPath;
  const candidatePath = path.join(distDir, normalizedPath);

  if (candidatePath.startsWith(distDir) && fs.existsSync(candidatePath)) {
    return candidatePath;
  }

  return path.join(distDir, 'index.html');
}

const server = http.createServer(async (request, response) => {
  try {
    if (!request.url) {
      response.writeHead(400);
      response.end('Bad Request');
      return;
    }

    if (
      request.url.startsWith('/api/') ||
      request.url === '/graphql' ||
      request.url.startsWith('/graphql?')
    ) {
      await proxyRequest(request, response);
      return;
    }

    sendFile(resolveFilePath(request.url), response);
  } catch (error) {
    response.writeHead(502, {
      'Content-Type': 'application/json; charset=utf-8',
    });
    response.end(
      JSON.stringify({
        message: error instanceof Error ? error.message : 'Proxy error',
      }),
    );
  }
});

server.listen(port, '0.0.0.0');
