const mongoose = require('mongoose');

// this is the schema or the blueprint of the model of the mongodb posts collection
const postSchema = mongoose.Schema({
  title: {
    // type of this field
    type: String,
    // is this a mandatory field?
    required: true
  },
  content: {
    type: String,
    required: false,
    // default value
    default: "No Content"
  },
  createdOn: {
    type: String,
    required: true
  }
});

// in order to create the data on the table, we need to create a model object
// the model name Post should be in pascal case
// export the model for use outside this file
module.exports = mongoose.model('Post', postSchema);
