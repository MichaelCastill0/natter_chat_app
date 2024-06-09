const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');
const cors = require('cors');
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client('457934960513-bh8upev2pr2f4hm5tqk245aq7fukbvqp.apps.googleusercontent.com');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

require("dotenv").config();
const mongoose = require("mongoose");

const mongoURI = process.env.DATABSE;
require("./model/message");
const Message = mongoose.model("Message");

require("./model/users");
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
  socket.on('saveUser', async ({token}) => {
    const decodeToken = jwt.decode(token);  //decode token
    const { name, email } = decodeToken; //get email and name
    const userToSave = new User({ name, email }); //save name to schema
    await userToSave.save(); //save schema to database


//    const ticket = await client.verifyIdToken({
//      idToken: token,
//      audience: '457934960513-bh8upev2pr2f4hm5tqk245aq7fukbvqp.apps.googleusercontent.com',
//    });
    
    //console.log(`User EMAIL: ${email} and USER NAME: ${name}`);
    
    
  });
  
  socket.on('createRoom', async (data) => {
    const {room, email} = data;
    //const email = socket.handshake.query.email; // Assuming email is sent in query params during connection
    const user = await User.findOne({ email });
    if (user) {
      if (!user.rooms.includes(room)) {
        user.rooms.push(room);
        await user.save();
      }
      socket.join(room);
      socket.emit('roomCreated', room);
      io.to(socket.id).emit('userRooms', user.rooms);
    }
  });

  socket.on('joinRoom', async (data) => {
    const {room, email} = data;
  //  const email = socket.handshake.query.email;
    const user = await User.findOne({ email });
    if (user) {
      if (!user.rooms.includes(room)) {
        user.rooms.push(room);
        await user.save();
      }
      socket.join(room);
      socket.emit('roomJoined', room);
      io.to(socket.id).emit('userRooms', user.rooms);
    }
  //  io.to(socket.id).emit('roomJoined', room);
  

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

  socket.on('leaveRoom', async (data) => {
    const {room, email} = data;
    socket.leave(room);
    const user = await User.findOne({ email });
    console.log(`User left room: ${room}`);
    if (user) {
      user.rooms = user.rooms.filter(r => r !== room);
      await user.save();
      io.to(socket.id).emit('userRooms', user.rooms);
    }
  });

  socket.on('sendMessage', async (data) => {
    const {room, message, userName} = data;
      console.log(`Test Message: ${message} from ${userName}`);
      io.to(room).emit('chat message', {message, userName});
      const messageToSave = new Message({room,message, userName});
      messageToSave.save();
    });

    socket.on('addUserToRoom', async ({ email, room }) => {
 
        const user = await User.findOne({ email });
        if (user) {
          if (!user.rooms.includes(room)) {
            user.rooms.push(room);
            await user.save();
          }
          socket.to(room).emit('userAddedToRoom', { email, room });
        } else {
          socket.emit('error', 'User not found');
        }
    });

    socket.on('getUserRooms', async (email) => {
        const user = await User.findOne({ email });
        if (user) {
          socket.emit('userRooms', user.rooms);
        } else {
          socket.emit('error', 'User not found');
        }
      
    });

    socket.on('removeUserFromRoom', async ({ email, room }) => {
 
      const user = await User.findOne({ email });
      if (user) {
        if (user) {
          user.rooms = user.rooms.filter(r => r !== room);
          await user.save();
          io.to(socket.id).emit('userRooms', user.rooms);
        }
        socket.to(room).emit('userRemovedFromRoom', { email, room });
      } else {
        socket.emit('error', 'User not found');
      }
  });

    socket.on('deleteRoom', async ({room,email}) => {
      await Message.deleteMany({room});
      io.of('/').in(room).socketsLeave(room);
      io.of('/').emit('roomDeleted', room);

      const user = await User.findOne({ email });
      console.log(`User left room: ${room}`);
      if (user) {
        user.rooms = user.rooms.filter(r => r !== room);
        await user.save();
        io.to(socket.id).emit('userRooms', user.rooms);
      }
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