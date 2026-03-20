const webPush = require('web-push');

const { publicKey, privateKey } = webPush.generateVAPIDKeys();
webPush.setVapidDetails('mailto:harshit886@outlook.com', publicKey, privateKey);

// In-memory storage for subscriptions (not suitable for production)
const allSubscriptions = {};

module.exports = async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

	if (req.method === 'OPTIONS') {
		return res.status(200).end();
	}

	try {
		if (req.path === '/vapid-public-key' && req.method === 'GET') {
			return res.status(200).json({ publicKey });
		}

		if (req.path === '/subscribe' && req.method === 'POST') {
			const token = req.cookies?.jwt || req.headers.authorization?.replace('Bearer ', '');
			if (!token) {
				return res.status(401).send('No token provided');
			}

			// Note: In a real implementation, you'd verify the JWT token
			// For simplicity, we're just storing the subscription
			const subscription = req.body;
			const endpoint = subscription.endpoint;

			allSubscriptions[endpoint] = subscription;

			res.status(200).send('subscribed!');
			return;
		}

		if (req.path === '/unsubscribe' && req.method === 'POST') {
			const { endpoint } = req.body;
			delete allSubscriptions[endpoint];
			res.status(200).send('unsubscribed!');
			return;
		}

		res.status(404).send('Not found');
	} catch (error) {
		console.error('Notification error:', error);
		res.status(500).json({ error: error.message });
	}
};
