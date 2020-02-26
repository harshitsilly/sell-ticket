const uuid = require("uuid/v1");

const resolvers = {
  Query: {
    currentUser: (parent, args, context) => context.getUser()
  },
  Mutation: {
    signup: async (
      parent,
      { firstName, lastName, email, password },
      context
    ) => {
      const existingUsers = await context.prisma.users();
      const userWithEmailAlreadyExists = !!existingUsers.find(
        user => user.email === email
      );

      if (userWithEmailAlreadyExists) {
        throw new Error("User with email already exists");
      }

      const newUser = {
        firstName,
        lastName,
        email,
        password
      };

      await context.prisma.createUser(newUser);

      await context.login(newUser);

      return { user: newUser };
    },
    login: async (parent, { email, password }, context) => {
      console.log(context.req._passport);
      const { user } = await context.authenticate("graphql-local", {
        email,
        password
      });

      await context.login(user);
      return { user };
    },
    logout: (parent, args, context) => context.logout()
  }
};

module.exports = resolvers;
