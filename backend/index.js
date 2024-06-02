const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const cors = require('cors');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('457934960513-bh8upev2pr2f4hm5tqk245aq7fukbvqp.apps.googleusercontent.com');


const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:4000',
    methods: ['GET', 'POST'],
  },
});

require("dotenv").config();
const mongoose = require("mongoose");

const mongoURI = process.env.DATABSE;
require("./model/message");
const Message = mongoose.model("Message");
const User = mongoose.model("User");

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

app.use(express.json());



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
  console.log(`User connected: ${socket.id}`);

  /* Original Function
  app.post('/google-login', async (req, res) => {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
      audience: '457934960513-bh8upev2pr2f4hm5tqk245aq7fukbvqp.apps.googleusercontent.com',
  });
  const { name, email, picture } = ticket.getPayload();

  });
*/
  // Modified function with socket
  socket.on('saveUser', async (req, res) => {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '457934960513-bh8upev2pr2f4hm5tqk245aq7fukbvqp.apps.googleusercontent.com',
    });
    const { name, email } = ticket.getPayload;
    const userToSave = new User({ name, email });
    userToSave.save();
  });
  
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
      console.log(`User disconnected: ${socket.id}`)
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