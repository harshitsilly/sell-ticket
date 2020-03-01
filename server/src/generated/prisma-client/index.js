"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "User",
    embedded: false
  },
  {
    name: "TicketsAvailable",
    embedded: false
  },
  {
    name: "Event",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `https://sell-ticket-0758f5f180.herokuapp.com/sell-ticket/dev`
});
exports.prisma = new exports.Prisma();
