const passport = require('passport');
const { GraphQLLocalStrategy } = require('graphql-passport');
const LocalStrategy = require('passport-local');
const TwitterStrategy = require('passport-twitter');
const GoogleStrategy = require('passport-google-oauth20');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { prisma } = require('../lib/prisma');

const JWT_SECRET = process.env.JWT_SECRET || 'bad Secret';
const SESSION_SECRECT = process.env.SESSION_SECRET || 'bad secret';

const signToken = user => {
	return jwt.sign({ data: user }, JWT_SECRET, {
		expiresIn: 604800
	});
};

passport.use(
	new GraphQLLocalStrategy(async (email, password, done) => {
		const users = await prisma.user.findMany({
			where: { email }
		});
		const matchingUser = users.find(user => bcrypt.compareSync(password, user.password));
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
			const users = await prisma.user.findMany({
				where: { email }
			});
			const matchingUser = users.find(user => bcrypt.compareSync(password, user.password));
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
	await prisma.user.create({
		data: {
			firstName: profile.name.givenName,
			lastName: profile.name.familyName,
			email: profile.emails[0].value
		}
	});
	done(null, {
		profile
	});
};

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID || '771704531356-o82krvt5ua15k04uqmm332s0g6qbojs9.apps.googleusercontent.com',
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || '6m4VK3f4etcU7qjP4xbYwMJ6',
			callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:4001/auth/google/callback'
		},
		GoogleTokenStrategyCallback
	)
);

passport.use(
	new TwitterStrategy(
		{
			consumerKey: process.env.TWITTER_CONSUMER_KEY || 'gGDup6JvkmOb4ZT8KhfVCJX8T',
			consumerSecret: process.env.TWITTER_CONSUMER_SECRET || 'heOP8jUkaPTKbYYYSf9tZcuJji616iqHClk8fRgpj8fiu7TJOZ',
			callbackURL: process.env.TWITTER_CALLBACK_URL || 'https://sell--ticket.herokuapp.com/auth/twitter/callback'
		},
		function(token, tokenSecret, profile, cb) {
			console.log(profile);
			cb(null, profile);
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
	const users = await prisma.user.findMany({
		where: { id }
	});
	const matchingUser = users.find(user => user.id === id);
	done(null, matchingUser);
});

module.exports = (req, res) => {
	if (req.path === '/google' || req.path === '/google/callback') {
		return passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
	}

	if (req.path === '/twitter' || req.path === '/twitter/callback') {
		return passport.authenticate('twitter')(req, res);
	}

	res.status(404).send('Not found');
};
