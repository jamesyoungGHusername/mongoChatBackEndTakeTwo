const express = require('express');
const webSocketsServerPort = 8000;
const webSocketServer = require('websocket').server;
const http = require('http');
const db = require('./config/connection');
const routes = require('./routes');


const PORT = 5000;
const app = express();

const server = http.createServer();
server.listen(webSocketsServerPort);
const wsServer = new webSocketServer({
  httpServer: server
});

const clients = {};

const sendMessage = (json) => {
  // We are sending the current data to all connected clients
  Object.keys(clients).map((client) => {
    console.log(clients[client]);
    clients[client].sendUTF(json);
  });
}

const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

wsServer.on('request', function(request) {
  var userID = getUniqueID();
  console.log((new Date()) + ' Recieved a new connection from origin ' + request.origin + '.');
  // You can rewrite this part of the code to accept only the requests from allowed origin
  const connection = request.accept(null, request.origin);
  clients[userID] = connection;
  console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients))
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      console.log(message);
      const dataFromClient = JSON.parse(message.utf8Data);
      const json = { type: dataFromClient.type };
      console.log(json);
      console.log(dataFromClient);
      sendMessage(JSON.stringify({message:"test message"}));
    }
  });
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

const io = require('socket.io')();
require('./socket')(io)



db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
    });
  });


module.exports = { app, io };  