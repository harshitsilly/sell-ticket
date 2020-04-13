const uuid = require('uuid/v1');
const passport = require('passport');

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
		events: async (parent, { category }, context) => {
			const fragment = `
    fragment EventsWithTicketAvailable on Event {
      id
      name
      category
      date
      location
      ticketsAvailable {
        id
        info
      }
    }
  `;

			return await context.prisma.events({ where: { category } }).$fragment(fragment);
		}
	},
	Mutation: {
		signup: async (parent, { firstName, lastName, email, password }, context) => {
			const existingUsers = await context.prisma.users();
			const userWithEmailAlreadyExists = !!existingUsers.find(user => user.email === email);

			if (userWithEmailAlreadyExists) {
				throw new Error('User with email already exists');
			}

			const newUser = {
				firstName,
				lastName,
				email,
				password
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
