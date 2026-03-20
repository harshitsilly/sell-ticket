const { prisma } = require('../lib/prisma');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'bad Secret';

module.exports = async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	if (req.method === 'OPTIONS') {
		return res.status(200).end();
	}

	if (req.method !== 'POST') {
		return res.status(405).send('Method not allowed');
	}

	try {
		const token = req.cookies?.jwt || req.headers.authorization?.replace('Bearer ', '');
		if (!token) {
			return res.status(401).send('No token provided');
		}

		const decoded = jwt.verify(token, JWT_SECRET);
		const userId = decoded.data.id;

		const subscription = req.body;
		await prisma.user.update({
			data: { endpoint: JSON.stringify(subscription) },
			where: { id: userId }
		});

		res.status(200).send('subscribed!');
	} catch (error) {
		console.error('Subscribe error:', error);
		res.status(500).json({ error: error.message });
	}
};
