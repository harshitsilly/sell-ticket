const uuid = require('uuid/v1');
const passport = require('passport');
const notification = require('./notification');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const authenticateGoogle = (req, res) =>
	new Promise((resolve, reject) => {
		passport.authenticate('google-token', { session: false }, (err, data, info) => {
			if (err) reject(err);
			resolve({ data, info });
		})(req, res);
	});

const upsertGoogleUser = async function ({ accessToken, refreshToken, profile, prisma }) {
	// Check if user with this email already exists
	const existingUsers = await prisma.user.findMany({
		where: { email: profile.emails[0].value },
	});

	if (existingUsers.length > 0) {
		return existingUsers[0];
	}

	// Create new user
	const newUser = await prisma.user.create({
		data: {
			firstName: profile.name.givenName,
			lastName: profile.name.familyName,
			email: profile.emails[0].value,
		},
	});

	return newUser;
};

const resolvers = {
	Query: {
		currentUser: (parent, args, context) => context.getUser(),
		events: async (parent, { id, category, location, userTicket, skip, first }, context) => {
			let absFilter = { id, category };
			let filter = location ? { ...absFilter, location: { contains: location } } : absFilter;

			const events = await context.prisma.event.findMany({
				where: filter,
				skip,
				take: first,
				select: {
					id: true,
					name: true,
					category: true,
					date: true,
					location: true,
					ticketType: {
						select: {
							id: true,
							type: true,
							count: true,
						},
					},
					ticketsAvailable: {
						select: {
							id: true,
							passType: true,
							user: {
								select: {
									id: true,
									firstName: true,
									lastName: true,
								},
							},
							numberOfTickets: true,
							cost: true,
						},
					},
				},
			});

			const data = events.map((event) => {
				return {
					...event,
					numberOfTickets: {
						available: event.ticketsAvailable.reduce((count, ticket) => {
							return count + ticket.numberOfTickets;
						}, 0),
					},
				};
			});
			return data;
		},
		eventTickets: async (parent, { id, category, location, passType, userTicket, skip, first }, context) => {
			let absFilter = { id, category };
			let filter = location ? { ...absFilter, location: { contains: location } } : absFilter;

			const events = await context.prisma.event.findMany({
				where: filter,
				skip,
				take: first,
				select: {
					id: true,
					name: true,
					category: true,
					date: true,
					location: true,
					ticketType: {
						select: {
							id: true,
							type: true,
							count: true,
						},
					},
					ticketsAvailable: {
						where: {
							passType,
							user: userTicket
								? { id: context.getUser() ? context.getUser().id : '' }
								: { id: { not: context.getUser() ? context.getUser().id : '' } },
						},
						select: {
							id: true,
							passType: true,
							user: {
								select: {
									id: true,
									firstName: true,
									lastName: true,
								},
							},
							numberOfTickets: true,
							cost: true,
						},
					},
				},
			});

			const data = events.map((event) => {
				return {
					...event,
					numberOfTickets: {
						available: event.ticketsAvailable.reduce((count, ticket) => {
							return count + ticket.numberOfTickets;
						}, 0),
					},
				};
			});
			return data;
		},
		userTickets: async (parent, { id, category, location, skip, first }, context) => {
			const userId = context.getUser().id;
			const user = await context.prisma.user.findUnique({
				where: { id: userId },
				select: {
					id: true,
					tickets: {
						select: {
							id: true,
							name: true,
							passType: true,
							date: true,
							location: true,
							numberOfTickets: true,
						},
					},
				},
			});
			return user;
		},
		eventsSearch: async (parent, { query, queryType, skip, first }, context) => {
			let filterArray = [];
			if (queryType.indexOf('Event') > -1) {
				filterArray.push({ name: { contains: query } });
			}
			if (queryType.indexOf('Location') > -1) {
				filterArray.push({ location: { startsWith: query } });
			}
			if (!filterArray.length) {
				filterArray = [{ name: { contains: query } }, { location: { startsWith: query } }];
			}

			const data = await context.prisma.event.findMany({
				where: {
					OR: filterArray,
				},
				skip,
				take: first,
			});
			return data;
		},
	},
	Mutation: {
		buyTicket: async (parent, { ticketIds, noOfTickets }, context) => {
			const { id: userId } = context.getUser();

			const ticket = await context.prisma.ticketsAvailable.findUnique({
				where: { id: ticketIds[0] },
				select: {
					id: true,
					numberOfTickets: true,
					passType: true,
					event: {
						select: {
							id: true,
							name: true,
							location: true,
							date: true,
						},
					},
				},
			});

			const createTicket = {
				...ticket,
				...ticket.event,
				numberOfTickets: noOfTickets,
			};
			delete createTicket.id;
			delete createTicket.event;

			const userUpdateData = {
				tickets: {
					create: [createTicket],
				},
			};

			await context.prisma.user.update({
				where: { id: userId },
				data: userUpdateData,
			});

			const ticketUpdateData = {
				numberOfTickets: ticket.numberOfTickets - noOfTickets,
			};

			if (ticket.numberOfTickets === noOfTickets) {
				await context.prisma.ticketsAvailable.deleteMany({
					where: { id: { in: ticketIds } },
				});
			} else {
				await context.prisma.ticketsAvailable.update({
					where: { id: ticket.id },
					data: ticketUpdateData,
				});
			}

			return { text: 'Success' };
		},
		addTicket: async (parent, { passType, numberOfTickets, cost, event, comments }, context) => {
			const userId = context.getUser() ? context.getUser().id : '';

			const eventData = await context.prisma.event.findUnique({
				where: { id: event },
				select: {
					id: true,
					name: true,
					category: true,
					date: true,
					location: true,
					ticketType: {
						select: {
							id: true,
							type: true,
							count: true,
						},
					},
					ticketsAvailable: {
						select: {
							id: true,
						},
					},
				},
			});

			const newTicket = {
				passType,
				numberOfTickets,
				cost,
				comments,
				event: {
					connect: {
						id: event,
					},
				},
				user: {
					connect: {
						id: userId,
					},
				},
			};

			const ticketType = eventData.ticketType.filter(({ type }) => type.toLocaleLowerCase() === passType.toLocaleLowerCase());
			const ticketTypePayload = ticketType[0]
				? { count: ticketType[0].count + newTicket.numberOfTickets }
				: { type: passType, count: newTicket.numberOfTickets };

			if (ticketType[0]) {
				await context.prisma.ticketType.update({
					where: { id: ticketType[0].id },
					data: ticketTypePayload,
				});
			} else {
				await context.prisma.ticketType.create({
					data: {
						...ticketTypePayload,
						event: {
							connect: { id: event },
						},
					},
				});
			}

			await context.prisma.ticketsAvailable.create({
				data: newTicket,
			});

			if (eventData.ticketsAvailable.length === 0) {
				notification.sendNotification(event);
			}
			return;
		},
		signup: async (parent, { firstName, lastName, email, password }, context) => {
			const existingUsers = await context.prisma.user.findMany({
				where: { email },
			});
			const userWithEmailAlreadyExists = !!existingUsers.find((user) => user.email === email);

			if (userWithEmailAlreadyExists) {
				throw new Error('User with email already exists');
			}

			const hashPassword = bcrypt.hashSync(password, saltRounds);
			const newUser = {
				firstName,
				lastName,
				email,
				password: hashPassword,
				role: 'Customer',
			};

			const createdUser = await context.prisma.user.create({
				data: newUser,
			});

			const existingUsersUpdate = await context.prisma.user.findMany();
			const loginUser = existingUsersUpdate.filter((user) => user.email === newUser.email);
			await context.login(loginUser[0]);

			return { user: newUser };
		},
		login: async (parent, { email, password }, context) => {
			const { user } = await context.authenticate('graphql-local', {
				email,
				password,
			});

			await context.login(user);
			return { user };
		},
		notifyEvent: async (parent, { eventId, notify }, context) => {
			const userId = context.getUser().id;
			const notifyUser = notify
				? {
						connect: {
							id: userId,
						},
					}
				: {
						disconnect: {
							id: userId,
						},
					};

			const eventUpdateData = {
				notifyUsers: notifyUser,
			};

			await context.prisma.event.update({
				where: { id: eventId },
				data: eventUpdateData,
			});
			return { data: 'Success' };
		},
		logout: (parent, args, context) => context.logout(),

		authGoogle: async (_, { input: { accessToken } }, context) => {
			try {
				const { data, info } = await authenticateGoogle(context.req, context.res);

				if (data) {
					const user = await upsertGoogleUser({ ...data, prisma: context.prisma });

					if (user) {
						const JWT_SECRET = process.env.JWT_SECRET || 'bad Secret';
						const jwt = require('jsonwebtoken');
						const token = jwt.sign({ data: user }, JWT_SECRET, { expiresIn: 604800 });

						return {
							name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
							token: token,
						};
					}
				}

				if (info) {
					console.log(info);
					switch (info.code) {
						case 'ETIMEDOUT':
							return new Error('Failed to reach Google: Try Again');
						default:
							return new Error('something went wrong');
					}
				}
				return Error('server error');
			} catch (error) {
				return error;
			}
		},
	},
};

module.exports = resolvers;
