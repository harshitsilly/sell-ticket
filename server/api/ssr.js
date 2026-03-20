const path = require('path');

module.exports = (req, res) => {
	const filePath = path.join(__dirname, '../../build/index.html');

	res.setHeader('Content-Type', 'text/html');
	res.sendFile(filePath, (err) => {
		if (err) {
			console.error('SSR error:', err);
			res.status(404).send('Not found');
		}
	});
};
