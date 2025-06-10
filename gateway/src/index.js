const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/auth', createProxyMiddleware({
  target: 'http://localhost:4000/auth', // ou 'http://auth-service:4000' en Docker
  changeOrigin: true
}));

app.use('/user', createProxyMiddleware({
  target: 'http://localhost:4001/user',
  changeOrigin: true
}));

app.use('/posts', createProxyMiddleware({
  target: 'http://localhost:4002/posts',
  changeOrigin: true
}));

app.use('/comments', createProxyMiddleware({
  target: 'http://localhost:4003/comments',
  changeOrigin: true
}));


const PORT = 3001;
app.listen(PORT, () => {
  console.log(`🚀 API Gateway listening on port ${PORT}`);
});
