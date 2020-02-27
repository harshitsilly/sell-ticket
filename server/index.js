const { GraphQLServer } = require("graphql-yoga");
const serveStatic = require("serve-static");

const session = require("express-session");
const uuid = require("uuid/v4");
const passport = require("passport");
const { GraphQLLocalStrategy, buildContext } = require("graphql-passport");

const resolvers = require("./api/resolver");
const { prisma } = require("./src/generated/prisma-client");

const PORT = 4000;
const SESSION_SECRECT = "bad secret";

const typeDefs = `
  type User {
    id: ID
    firstName: String
    lastName: String
    email: String
  }

  type Query {
    currentUser: User
  }

  type AuthPayload {
    user: User
  }

  type Mutation {
    signup(firstName: String!, lastName: String!, email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    logout: Boolean
  }
`;

passport.use(
  new GraphQLLocalStrategy(async (email, password, done) => {
    const users = await prisma.users();
    const matchingUser = users.find(
      user => email === user.email && password === user.password
    );
    const error = matchingUser ? null : new Error("no matching user");
    done(error, matchingUser);
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (req, id, done) => {
  const users = await prisma.users();
  const matchingUser = users.find(user => user.id === id);
  done(null, matchingUser);
});

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: ({ request, response }) =>
    buildContext({ req: request, res: response, prisma })
});
server.express.use(
  session({
    secret: SESSION_SECRECT,
    resave: false,
    saveUninitialized: false
  })
);
server.express.use(passport.initialize());

server.express.use(passport.session());

server.use(serveStatic("build"));
server.start({ port: process.env.PORT || 4001 }, () =>
  console.log(`Server is running on http://localhost:${process.env.port}`)
);
