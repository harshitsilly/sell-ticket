const { GraphQLServer } = require('graphql-yoga');
const serveStatic = require('serve-static');

const session = require('express-session');
const path = require('path');
const passport = require('passport');
const { GraphQLLocalStrategy, buildContext } = require('graphql-passport');
const GoogleStrategy = require('passport-google-oauth20');
const cookieSession = require('cookie-session');
const jwt = require('jsonwebtoken');

const resolvers = require('./api/resolver');
const { prisma } = require('./src/generated/prisma-client');
const JWT_SECRET = 'bad Secret';
const signToken = user => {
	return jwt.sign({ data: user }, JWT_SECRET, {
		expiresIn: 604800
	});
};

const PORT = 4000;
const SESSION_SECRECT = 'bad secret';

passport.use(
	new GraphQLLocalStrategy(async (email, password, done) => {
		const users = await prisma.users();
		const matchingUser = users.find(user => email === user.email && password === user.password);
		const error = matchingUser ? null : new Error('no matching user');
		done(error, matchingUser);
	})
);
const GoogleTokenStrategyCallback = async (accessToken, refreshToken, profile, done) => {
	await prisma.createUser({
		firstName: profile.name.givenName,
		lastName: profile.name.familyName,
		email: profile.emails[0].value
	});
	done(null, {
		profile
	});
};

passport.use(
	new GoogleStrategy(
		{
			clientID: '771704531356-o82krvt5ua15k04uqmm332s0g6qbojs9.apps.googleusercontent.com',
			clientSecret: '6m4VK3f4etcU7qjP4xbYwMJ6',
			callbackURL: 'http://localhost:4001/auth/google/callback'
		},
		GoogleTokenStrategyCallback
	)
);

passport.serializeUser((user, done) => {
	if (user && user.profile) {
		done(null, user.profile.id);
	} else {
		done(null, user.id);
	}
});

passport.deserializeUser(async (req, id, done) => {
	const users = await prisma.users();
	const matchingUser = users.find(user => user.id === id);
	done(null, matchingUser);
});

const server = new GraphQLServer({
	typeDefs: './server/schema.graphql',
	resolvers,
	context: ({ request, response }) => buildContext({ req: request, res: response, prisma }),
	playground: {
		settings: {
			'request.credentials': 'same-origin'
		}
	}
});

server.express.use(
	cookieSession({
		maxAge: 24 * 60 * 60 * 1000, // One day in milliseconds
		keys: ['randomstringhere']
	})
);
server.express.use(
	session({
		secret: SESSION_SECRECT,
		resave: false,
		saveUninitialized: false
	})
);
server.express.use(passport.initialize());

server.express.use(passport.session());
server.express.use(
	'/auth/google',
	passport.authenticate('google', {
		scope: ['profile', 'email']
	})
);

server.express.use('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
	return res
		.status(200)
		.cookie('jwt', signToken(req.user), {
			httpOnly: true
		})
		.redirect('/');
});

server.express.use(serveStatic('build'));
server.express.get('/*', function(req, res) {
	res.sendFile(path.join(__dirname, '../build/index.html'));
});
const options = {
	port: process.env.port || 4001,
	endpoint: '/graphql',
	subscriptions: '/subscriptions',
	playground: '/playground'
};
server.start(options, ({ port }) => console.log(`Server is running on http://localhost:${port}`));
