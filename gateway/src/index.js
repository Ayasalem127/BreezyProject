const express = require('express');
const validateJWT = require("./middleware/jwt")
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Routes publiques (sans JWT)
app.use('/auth', createProxyMiddleware({
  target: 'http://localhost:4000', // ou 'http://auth-service:4000' en Docker
  changeOrigin: true
}));

// Routes protégées (avec JWT)
app.use('/user', createProxyMiddleware({
  target: 'http://localhost:4001',
   changeOrigin: true
// ,
//   onProxyReq: (proxyReq, req, res) => {
// // Transmettre les headers enrichis
// proxyReq.setHeader('X-User-ID', req.headers['x-user-id']);
// proxyReq.setHeader('X-User-Email', req.headers['x-user-email']);
// proxyReq.setHeader('X-User-Role', req.headers['x-user-role']);
// }
}));

app.use('/posts', validateJWT, createProxyMiddleware({
  target: 'http://localhost:4002',
  changeOrigin: true,
  pathRewrite: {
    '^/posts': '', // retire le préfixe /posts pour le service cible
  },
}));

app.use('/comments', validateJWT, createProxyMiddleware({
  target: 'http://localhost:4003',
  changeOrigin: true
}));

app.use('/notifications', validateJWT, createProxyMiddleware({
  target: 'http://localhost:4005',
  changeOrigin: true
}));


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway listening on port ${PORT}`);
});
