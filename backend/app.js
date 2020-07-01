const express = require('express');
const bodyParser = require('body-parser');
const Post = require('./models/post');
const app = express();
const dbConnect = require('./db-connect');

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

// app will now serve this post endpoint /api/posts
app.post("/api/posts", (req, res, next) => {

  // create a new post object
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    createdOn: req.body.createdOn
  })

  // the save method on the mongoose post model willl automatically load the data to mongodb
  post.save()
    .then(result => {
      // console will show that mongoose automatically adds the _id attribute
      console.log("Added a new post\n" + result);
    })
    .catch(error => {
      console.log("Error adding a post: " + error);
    });

  return res.status(201).header("Location", req.hostname + "/api/post/" + post._id).json({
    message: "Post created successfully",
    post: post
  })
});

// app will now serve the endpoint /api/posts
app.get('/api/posts', (req, res, next) => {

  Post.find()
    .then(documents => {
      console.log("Fetched posts:\n");
      documents.forEach(document => console.log(document + "\n"));
      return res.status(200).json({
        message: 'Posts were found',
        posts: documents
      });
    })
    .catch(error => {
      console.log("Unable to fetch document/s: " + error);
    })
    ;
});

// app will now delete documents at this delete endpoint
app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({ _id: req.params.id })
    .then(result => {
      console.log("Deleting: " + req.params.id);
      console.log(result);
      res.status(200).json({ message: "Post " + req.params.id + " has been deleted" });
    })
    .catch(error => {
      console.log("Error on attempting to delete: " + req.params.id);
    });

});

module.exports = app;
