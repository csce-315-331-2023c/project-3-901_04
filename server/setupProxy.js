const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'https://mos-irish-server-901-04.vercel.app/',
            changeOrigin: true,
        })
    );
};