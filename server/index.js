const { GraphQLServer } = require('graphql-yoga');
const serveStatic = require('serve-static');

const session = require('express-session');
const path = require('path');
const passport = require('passport');
const { GraphQLLocalStrategy, buildContext } = require('graphql-passport');
const LocalStrategy = require('passport-local');
const TwitterStrategy = require('passport-twitter');
const GoogleStrategy = require('passport-google-oauth20');
const cookieSession = require('cookie-session');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
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
		const matchingUser = users.find(user => email === user.email && bcrypt.compareSync(password, user.password));
		const error = matchingUser ? null : new Error('no matching user');
		done(error, matchingUser);
	})
);
passport.use(
	new LocalStrategy(
		{
			usernameField: 'email',
			passwordField: 'password'
		},
		async (email, password, done) => {
			const users = await prisma.users();
			const matchingUser = users.find(user => email === user.email && bcrypt.compareSync(password, user.password));
			const error = matchingUser
				? matchingUser.role === 'Admin'
					? null
					: new Error('user not admin')
				: new Error('no matching user');
			done(error, matchingUser);
		}
	)
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

passport.use(
	new TwitterStrategy(
		{
			consumerKey: 'gGDup6JvkmOb4ZT8KhfVCJX8T',
			consumerSecret: 'heOP8jUkaPTKbYYYSf9tZcuJji616iqHClk8fRgpj8fiu7TJOZ',
			callbackURL: 'https://sell--ticket.herokuapp.com/auth/twitter/callback'
		},
		function(token, tokenSecret, profile, cb) {
			console.log(profile);
		}
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

server.express.get('/auth/twitter', () => {
	passport.authenticate('twitter');
});

server.express.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), function(req, res) {
	// Successful authentication, redirect home.
	res.redirect('/index.html');
});

// push notification
// ... See previous article for the rest of the code
const bodyParser = require('body-parser');

const webPush = require('web-push');

// for this application we use allSubscription object to manage our subscriptions
// this is NOT GOOD for production since it makes our application stateful
const allSubscriptions = {};

// We use webpush to generate our public and private keys
const { publicKey, privateKey } = webPush.generateVAPIDKeys();

// We are giving webpush the required information to encrypt our data

webPush.setVapidDetails('mailto:harshit886@outlook.com', publicKey, privateKey);

// bodyParse.json() allows us to easily read json bodies
server.express.use(bodyParser.json());
server.express.use(bodyParser.urlencoded({ extended: true }));
// Send our public key to the client
server.express.get('/vapid-public-key', (req, res) => {
	return res.send({ publicKey });
});

// Allows our client to subscribe
server.express.post('/subscribe', async (req, res) => {
	const subscription = req.body;
	await prisma.updateUser({ data: { endpoint: JSON.stringify(subscription) }, where: { id: req.user.id } });
	// registerTasks(subscription);
	res.send('subscribed!');
});

const registerTasks = subscription => {
	const endpoint = subscription.endpoint;

	// the endpoints are the keys of our subscriptions object
	// Every 3 seconds we will send a notification with the message 'hey this is a push!'
	const intervalID = setInterval(() => {
		// sendNotification(subscription, 'Hey this is a push!');
	}, 10000);
	allSubscriptions[endpoint] = intervalID;
};

// Allows our client to unsubscribe
server.express.post('/unsubscribe', (req, res) => {
	const endpoint = req.body.endpoint;
	// We find the client's endpoint and clear the interval associated with it
	const intervalID = allSubscriptions[endpoint];
	clearInterval(intervalID);
	// We delete the key
	delete allSubscriptions[endpoint];
});

// This function takes a subscription object and a payload as an argument
// It will try to encrypt the payload
// then attempt to send a notification via the subscription's endpoint

server.express.use(serveStatic('build'));

server.express.post('/admin/login', passport.authenticate('local'), async (req, res) => {
	res.send({ user: req.user });
});

server.express.get('/admin/logout', async (req, res) => {
	req.logout();
	res.send('Logout Successfully');
});

server.express.use('/admin', (req, res) => {
	if (req.user && req.user.role === 'Admin') {
		req.next();
	} else {
		res.send(401, 'Bad credentials');
	}
});
server.express.get('/admin/users', async (req, res) => {
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
	}`;
	const users = await prisma.users().$fragment(fragment);
	return res.send(users);
});

server.express.post('/admin/events', async (req, res) => {
	const body = req.body;
	const event = await prisma.createEvent(body);
	return res.send(event);
});

server.express.get('/*', function(req, res) {
	res.sendFile(path.join(__dirname, '../build/index.html'));
});

const options = {
	cors: { origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', preflightContinue: false, optionsSuccessStatus: 204 },
	port: process.env.PORT || 4001,
	endpoint: '/graphql',
	subscriptions: '/subscriptions',
	playground: '/playground'
};
server.start(options, ({ port }) => console.log(`Server is running on http://localhost:${port}`));
