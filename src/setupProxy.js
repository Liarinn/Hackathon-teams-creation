console.log('[setupProxy] LOADED — wiring /api → http://localhost:8081');

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:8081',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
      logLevel: 'debug',
      onProxyReq: (proxyReq, req) => {
        console.log(`[proxy] → ${req.method} ${req.url} → ${proxyReq.path}`);
      },
      onError: (err, req, res) => {
        console.error(`[proxy] ✗ ${req.method} ${req.url}:`, err.message);
        res.writeHead(502, { 'Content-Type': 'text/plain' });
        res.end(`Proxy error: ${err.message}`);
      },
    })
  );
};