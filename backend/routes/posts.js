const express = require('express');
const Post = require('../models/post');

const router = express.Router();

// app will now serve this post endpoint /api/posts
router.post("", (req, res, next) => {

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
      res.status(201).header("Location", req.hostname + "/api/post/" + post._id).json({
        message: "Post created successfully",
        post: post
      });
    })
    .catch(error => {
      console.log("Error adding a post: " + error);
      res.status(500).json({ message: "Error adding a post: " + error });
    });
});

// app will now serve the endpoint /api/posts
router.get("", (req, res, next) => {

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

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id)
    .then(result => {
      if (result) {
        console.log("Fetched single post:\n" + result);
        res.status(200).json(result);
      } else {
        res.status(400).json({ message: "No post found for id: " + req.params.id });
      }

    })
    .catch(error => {
      console.log("Error fetching post: " + req.params.id);
      console.log(error);
      res.status(500).json({ message: error });
    })
});

// app will now delete documents at this delete endpoint
router.delete("/:id", (req, res, next) => {
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

router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content
  })
  Post.updateOne({ _id: req.params.id }, post)
    .then((result) => {
      console.log("Updated post: " + req.params.id);
      console.log(result);
      res.status(200).json({ message: "Post " + req.params.id + " updated successfully" });
    })
    .catch(error => {
      console.log("Error on updating the post: " + req.params.id);
      console.log(error.message);
    })
})

module.exports = router;
