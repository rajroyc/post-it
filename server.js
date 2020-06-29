const app = require('./backend/app');
const http = require('http')
const debug = require('debug')('node-angular');

const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.log(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + port;
  console.debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || 3000);
app.set('port', port);

const server = http.createServer(app);
// add a listener to the server to handle errors.
// The on funtion allows to define an event "error"
// and specify a callback which node will invoke when the error event is triggered
server.on("error", onError);

// add a listener to the server to respond to the listening event
// The listening event is triggered when the server is brought up
// and the server starts listening on the specified port
server.on("listening", onListening);
server.listen(port);
