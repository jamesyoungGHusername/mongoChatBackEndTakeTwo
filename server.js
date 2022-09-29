const express = require('express');

const db = require('./config/connection');
const routes = require('./routes');


const PORT = 5000;
const app = express();

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