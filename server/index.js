const { GraphQLServer } = require("graphql-yoga");
const serveStatic = require("serve-static");

const session = require("express-session");
const uuid = require("uuid/v4");
const passport = require("passport");
const { GraphQLLocalStrategy, buildContext } = require("graphql-passport");
const passportGoogle = require("passport-google-oauth");
const jwt = require("jsonwebtoken");
const GoogleStrategy = passportGoogle.OAuth2Strategy;

const resolvers = require("./api/resolver");
const { prisma } = require("./src/generated/prisma-client");
const JWT_SECRET = "bad Secret";
const signToken = user => {
  return jwt.sign({ data: user }, JWT_SECRET, {
    expiresIn: 604800
  });
};

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

  type AuthResponse {
    token: String
    name: String
  }
  input AuthInput {
    accessToken: String!
  }

  type Mutation {
    authGoogle(input: AuthInput!): AuthResponse
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
const GoogleTokenStrategyCallback = (
  accessToken,
  refreshToken,
  profile,
  done
) =>
  done(null, {
    accessToken,
    refreshToken,
    profile
  });

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "771704531356-o82krvt5ua15k04uqmm332s0g6qbojs9.apps.googleusercontent.com",
      clientSecret: "6m4VK3f4etcU7qjP4xbYwMJ6",
      callbackURL: "auth/google/callback"
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
server.express.use(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  })
);

server.express.use(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    return res
      .status(200)
      .cookie("jwt", signToken(req.user), {
        httpOnly: true
      })
      .redirect("/");
  }
);

server.use(serveStatic("build"));
server.start({ port: process.env.PORT || 4001 }, () =>
  console.log(`Server is running on http://localhost:${process.env.port}`)
);
