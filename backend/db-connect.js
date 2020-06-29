// export this fuction so that this becomes available for use on the app.js
module.exports = function dbConnect() {
  const mongoose = require('mongoose');

  mongoose.connect("mongodb+srv://rajroyc-admin:rajroyc-admin@cluster0-yrpuz.mongodb.net/test?retryWrites=true", {
    useNewUrlParser: true  });

  const db = mongoose.connection;

  db.on('error', console.error.bind(console, 'Connection Error: '));
  db.once('open', () => {
    console.log("Connected to database");
  });
}
