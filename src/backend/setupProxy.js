const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://project-3-901-04.vercel.app/api',
            changeOrigin: true,
        })
    );
};