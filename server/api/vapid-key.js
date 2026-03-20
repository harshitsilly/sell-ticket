const webPush = require('web-push');

// Generate VAPID keys (in production, these should be stored in env vars)
const { publicKey, privateKey } = webPush.generateVAPIDKeys();

webPush.setVapidDetails('mailto:harshit886@outlook.com', publicKey, privateKey);

module.exports = (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

	if (req.method === 'OPTIONS') {
		return res.status(200).end();
	}

	return res.status(200).json({ publicKey });
};
