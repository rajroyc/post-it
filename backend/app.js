const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const dbConnect = require('./db-connect');

const postsRouter = require('./routes/posts');

// connect to mongodb
dbConnect();

// this will intercept every request, parse their body
app.use(bodyParser.json());

// intercept the response, add CORs specific headers to it before sending it back to client
// when we do not specify a path segment as a method parameter, it means that this interceptor
// is applicable to all requests irrespective of the path
app.use((req, res, next) => {
  // this indicates that any client from any domain can access this endpoint
  res.setHeader("Access-Control-Allow-Origin", "*");
  // the client must send these headers in addition to the default headers when accessing the endpoint
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  // the client can use these HTTP verbs when accessing this endpoint
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

app.use("/api/posts", postsRouter);

module.exports = app;
