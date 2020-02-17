const { GraphQLServer } = require("graphql-yoga");
const serveStatic = require("serve-static");

// 1
const typeDefs = `
type Query {
  info: String!
}
`;

// 2
const resolvers = {
  Query: {
    info: () => `This is the API of a Hackernews Clone`
  }
};

// 3
const server = new GraphQLServer({
  typeDefs,
  resolvers
});
server.use(serveStatic("build"));
server.start({ port: process.env.PORT || 4001 }, () =>
  console.log(`Server is running on http://localhost:${process.env.port}`)
);
