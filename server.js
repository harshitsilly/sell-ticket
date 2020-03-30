var proxy = require("express-http-proxy");
const express = require("express");
var app = express();

app.use("/graphql", proxy("127.0.0.1:4001"));
app.use(express.static("build"));

app.listen({ port: process.env.PORT || 3000 }, () =>
  console.log("Gator app listening on port 3000!")
);
