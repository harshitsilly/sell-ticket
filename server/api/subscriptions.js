const { GraphQLServer } = require('graphql-yoga');
const { prisma } = require('../lib/prisma');
const resolvers = require('../api/resolver');
const { buildContext } = require('graphql-passport');
const path = require('path');

const server = new GraphQLServer({
	typeDefs: path.join(__dirname, '../server/schema.graphql'),
	resolvers,
	context: ({ request, response }) => buildContext({ req: request, res: response, prisma }),
});

module.exports = server.getMiddleware({
	endpoint: '/graphql',
	subscriptions: '/subscriptions',
	playground: '/playground',
});
