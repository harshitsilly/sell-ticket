const { createProxyMiddleware } = require('http-proxy-middleware');
module.exports = function(app) {
	app.use(
		'/api',
		createProxyMiddleware({
			target: 'http://localhost:4001',
			pathRewrite: { '^/api': '' },
			changeOrigin: true
		})
	);
};
