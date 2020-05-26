const uuid = require('uuid/v1');
const passport = require('passport');
const notification = require('./notification');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const authenticateGoogle = (req, res) =>
	new Promise((resolve, reject) => {
		passport.authenticate('google-token', { session: false }, (err, data, info) => {
			if (err) reject(err);
			resolve({ data, info });
		})(req, res);
	});

const upsertGoogleUser = async function({ accessToken, refreshToken, profile }) {
	const User = this;

	const user = await User.findOne({ 'social.googleProvider.id': profile.id });

	// no user was found, lets create a new one
	if (!user) {
		const newUser = await User.create({
			name: profile.displayName || `${profile.familyName} ${profile.givenName}`,
			email: profile.emails[0].value,
			'social.googleProvider': {
				id: profile.id,
				token: accessToken
			}
		});

		return newUser;
	}
	return user;
};

const resolvers = {
	Query: {
		currentUser: (parent, args, context) => context.getUser(),
		events: async (parent, { id, category, location, skip, first }, context) => {
			//  code for fragment

			const fragment = `
    fragment EventsWithTicketAvailable on Event {
      id
      name
      category
      date
      location
      ticketsAvailable(where:{user :{id_not : "${context.getUser().id}"}}) {
		id
		passType
		user {
			id
			firstName
			lastName
		}
		numberOfTickets
		cost
      }
    }
  `;
			let absFilter = { id, category };

			let filter = location ? { ...absFilter, location } : absFilter;
			let data;

			data = await context.prisma.events({ where: filter, skip, first }).$fragment(fragment);

			data = data.map(event => {
				return {
					...event,
					numberOfTickets: {
						available: event.ticketsAvailable.reduce((count, ticket) => {
							return count + ticket.numberOfTickets;
						}, 0)
					}
				};
			});
			return data;
			// return await context.prisma.events({ where: { category },skip,first});
		},
		userTickets: async (parent, { id, category, location, skip, first }, context) => {
			//  code for fragment
			const fragment = `
    fragment UsersWithTicket on user {
		id
		tickets{
			id
			name
			passType
			date
			location
			numberOfTickets
		}
	}`;
			let userId = context.getUser().id;
			return await context.prisma.user({ id: userId }).$fragment(fragment);
		},
		eventsSearch: async (parent, { query, queryType, skip, first }, context) => {
			let filterArray = [];
			if (queryType.indexOf('Event') > -1) {
				filterArray.push({ name_contains: query });
			}
			if (queryType.indexOf('Location') > -1) {
				filterArray.push({ location_starts_with: query });
			}
			if (!filterArray.length) {
				filterArray = [{ name_contains: query }, { location_starts_with: query }];
			}
			let data = await context.prisma.events({
				where: {
					OR: filterArray
				}
			});
			return data;
		}
	},
	Mutation: {
		buyTicket: async (parent, { ticketIds, noOfTickets }, context) => {
			const { id } = context.getUser();
			const fragment = `
    fragment TicketAvailablesWithEvent on TicketAvailable {
      id
     numberOfTickets
	  passType
	  event{
		  id
		  name
		  location
		  date
	  }
      
    }
  `;
			const ticket = await context.prisma.ticketsAvailable({ id: ticketIds[0] }).$fragment(fragment);

			let createTicket = {
				...ticket,
				...ticket.event,
				numberOfTickets: noOfTickets
			};
			delete createTicket.comments;
			delete createTicket.id;
			delete createTicket.event;
			let userUpdateData = {
				tickets: {
					create: [createTicket]
				}
			};
			await context.prisma.updateUser({ where: { id: id }, data: userUpdateData });
			let ticketUpdateData = {
				numberOfTickets: ticket.numberOfTickets - noOfTickets
			};
			ticket.numberOfTickets === noOfTickets
				? await context.prisma.deleteManyTicketsAvailables({ id_in: [...ticketIds] })
				: await context.prisma.updateTicketsAvailable({ where: { id: ticket.id }, data: ticketUpdateData });

			return { text: 'Success' };
		},
		addTicket: async (parent, { passType, numberOfTickets, cost, event, comments }, context) => {
			const fragment = `
    fragment EventsWithTicketAvailable on Event {
      id
      name
      category
      date
      location
      ticketsAvailable {
		id
		passType
		user {
			id
			firstName
			lastName
		}
		numberOfTickets
		cost
      }
    }
  `;
			const newTicket = {
				passType,
				numberOfTickets,
				cost,
				comments,
				event: {
					connect: {
						id: event
					}
				},
				user: {
					connect: {
						id: context.getUser() ? context.getUser().id : ''
					}
				}
			};
			let eventData = await context.prisma.event({ id: event }).$fragment(fragment);

			await context.prisma.createTicketsAvailable(newTicket);
			if (eventData.ticketsAvailable.length === 0) {
				notification.sendNotification(event);
			}
			return;
		},
		signup: async (parent, { firstName, lastName, email, password }, context) => {
			const existingUsers = await context.prisma.users();
			const userWithEmailAlreadyExists = !!existingUsers.find(user => user.email === email);

			if (userWithEmailAlreadyExists) {
				throw new Error('User with email already exists');
			}
			const hashPassword = bcrypt.hashSync(password, saltRounds);
			const newUser = {
				firstName,
				lastName,
				email,
				password: hashPassword
			};

			await context.prisma.createUser(newUser);
			const existingUsersUpdate = await context.prisma.users();
			const loginUser = existingUsersUpdate.filter(user => user.email === newUser.email);
			await context.login(loginUser[0]);

			return { user: newUser };
		},
		login: async (parent, { email, password }, context) => {
			console.log(context.req._passport);
			const { user } = await context.authenticate('graphql-local', {
				email,
				password
			});

			await context.login(user);
			return { user };
		},
		notifyEvent: async (parent, { eventId, notify }, context) => {
			let notifyUser = notify
				? {
						connect: {
							id: context.getUser().id
						}
				  }
				: {
						disconnect: {
							id: context.getUser().id
						}
				  };
			let eventUpdateData = {
				notifyUsers: notifyUser
			};
			await context.prisma.updateEvent({ where: { id: eventId }, data: eventUpdateData });
			return { data: 'Success' };
		},
		logout: (parent, args, context) => context.logout(),

		authGoogle: async (_, { input: { accessToken } }, context) => {
			try {
				// data contains the accessToken, refreshToken and profile from passport
				const { data, info } = await authenticateGoogle(context.req, context.res);

				if (data) {
					const user = await upsertGoogleUser(data);

					if (user) {
						return {
							name: user.name,
							token: user.generateJWT()
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
		}
	}
};

module.exports = resolvers;
