const { prisma } = require('../lib/prisma');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'bad Secret';

module.exports = async (req, res) => {
	// Enable CORS
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

	if (req.method === 'OPTIONS') {
		return res.status(200).end();
	}

	try {
		// Check for JWT token
		const token = req.cookies?.jwt || req.headers.authorization?.replace('Bearer ', '');
		if (!token) {
			return res.status(401).send('No token provided');
		}

		const decoded = jwt.verify(token, JWT_SECRET);
		const user = decoded.data;

		// Check if user is admin
		if (user.role !== 'Admin') {
			return res.status(403).send('Bad credentials');
		}

		// Handle different admin routes
		if (req.path === '/users' && req.method === 'GET') {
			const fragment = `
        fragment UsersWithTicket on user {
          id
          firstName
          lastName
          email
          tickets{
            id
            name
            passType
            date
            location
            numberOfTickets
          }
        }
      `;
			const users = await prisma.user.findMany({
				select: {
					id: true,
					firstName: true,
					lastName: true,
					email: true,
					tickets: {
						select: {
							id: true,
							name: true,
							passType: true,
							date: true,
							location: true,
							numberOfTickets: true
						}
					}
				}
			});
			return res.status(200).json(users);
		}

		if (req.path === '/events' && req.method === 'POST') {
			const event = await prisma.event.create({
				data: req.body
			});
			return res.status(200).json(event);
		}

		if (req.path === '/logout' && req.method === 'GET') {
			return res.status(200).send('Logout Successfully');
		}

		res.status(404).send('Not found');
	} catch (error) {
		console.error('Admin error:', error);
		res.status(500).json({ error: error.message });
	}
};
