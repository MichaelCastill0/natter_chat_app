const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

require("dotenv").config();
const mongoose = require("mongoose");

const mongoURI = process.env.DATABSE;
require("./model/message");
const Message = mongoose.model("Message");

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connection established"))
  .catch((err) => console.error("MongoDB connection error:",err));

app.use(express.static(join(__dirname, 'client/build')));

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

//io.on('connection', (socket) => {
//  console.log('a user connected');
//});
/*
io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      console.log('message: ' + msg);
    });
  });
*/
io.on('connection', (socket) => {
  console.log('a user connected');


  
  socket.on('createRoom', (room) => {
    socket.join(room);
    console.log(`Room created: ${room}`);
    socket.emit('roomCreated', room);
  });

  socket.on('joinRoom', async (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
    //socket.emit('roomJoined',room)
    io.to(socket.id).emit('roomJoined', room);

    try {
      console.log('finding chat history');
      const messages = await Message.find({ room }).sort({ createdAt: 1 });
      console.log(`Chat history for room ${room}:`, messages);
      socket.emit('chatHistory', messages); 
      console.log('After emit chat history');
    } catch (err) {
      console.log('UH OH error');
      console.error(`Error retrieving chat history for room ${room}:`, err);
    }
  });

  socket.on('leaveRoom', (room) => {
    socket.leave(room);
    console.log(`User left room: ${room}`);
    //socket.emit('roomLeft',room);
    //socket.to(room).emit('message', 'A user has left the room');
    io.to(socket.id).emit('roomLeft', room);
  });

  socket.on('sendMessage', async (data) => {
    const {room, message} = data;
      io.to(room).emit('chat message', message);
      const messageToSave = new Message({room,message});
      messageToSave.save();
    });

    socket.on('deleteRoom', async (room) => {
      //delete chatHistory[messages];
      await Message.deleteMany({room});
      io.in(room).socketsLeave(room);
      io.emit('roomDeleted',room);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected')
    });
  });


/*
io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
*/
server.listen(5000, () => {
  console.log('server running at http://localhost:5000');
});