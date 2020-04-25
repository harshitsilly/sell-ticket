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
    name: "EventTickets",
    embedded: false
  },
  {
    name: "TicketsAvailable",
    embedded: false
  },
  {
    name: "CategoryFormat",
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
  endpoint: `https://eu1.prisma.sh/harshit-a88eb5/sellTicket/dev`
});
exports.prisma = new exports.Prisma();
