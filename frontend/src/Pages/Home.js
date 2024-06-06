import React, { useState, useEffect} from 'react';
import { useNavigate, Router, Routes, Route } from 'react-router-dom';
import Login from '../Pages/Login'
import { jwtDecode } from 'jwt-decode';
import io from 'socket.io-client';
//import { useSignOut } from 'react-auth-kit/hooks/useSignOut';
import '../App.css';

const socket = io.connect('http://localhost:5000')

function Home() {
    const [room, setRoom] = useState('');
    const [message, setMessage] = useState('');
    const[messages, setMessages] = useState([]);
    const [rooms,setRooms] = useState([]);
    const [emailToAdd, setEmailToAdd] = useState('')

    const [user, setUser] = useState({});

    //const signOut = useSignOut();
    const navigate = useNavigate();

    const logout = () => {
      //signOut();
      navigate('/login');
    };
  
    /* ***************************Socket IO************************************** */
  useEffect(()=> {
    socket.on('chatHistory', (Messages) => {
    setMessages(Messages);
  });

  socket.on('chat message', (msg) => {
    setMessages(prevMessages => [...prevMessages, { message: msg.message, userName: msg.username}]);
  });

  socket.on('roomCreated', (room) => {
    alert(`Room ${room} created!`);
    setRooms(prevRooms => [...prevRooms, room]);
  });

  socket.on('roomJoined', (room) =>{
    alert(`Joined room ${room}!`);
    if(!rooms.includes(room)){
    setRooms(prevRooms => [...prevRooms, room]);
 }});

  socket.on('roomLeft', (room) => {
    alert(`Left room ${room}`);
    setRooms(prevRooms => prevRooms.filter(r => r !== room));
  });

  socket.on('roomDeleted', (room) => {
    alert(`Room ${room} has been deleted!`);
    setMessages([]);
    setRooms(prevRooms => prevRooms.filter(r => r !== room));
  });

  socket.on('userAddedToRoom', ({ email, room }) => {
    if (email === user.email) {
      setRooms((prevRooms) => [...prevRooms, room]);
    }
  });

  socket.on('userRooms', (userRooms) => {
    setRooms(userRooms);
  });

  socket.on('error', (err) => {
    alert('An error occurred: ' + err);
  });

  return () => {
    socket.off('chatHistory');
    socket.off('chat message');
    socket.off('roomCreated');
    socket.off('roomJoined');
    socket.off('roomLeft');
    socket.off('roomDeleted');
    socket.off('userAddedToRoom');
    socket.off('userRooms');
    socket.off('error');
  };
}, [rooms, user.email]);

const createRoom = () => {
  socket.emit('createRoom', {room, email: user.email});
};

const joinRoom = () => {
  socket.emit('joinRoom', {room, email: user.email});
};

const leaveRoom = () => {
  socket.emit('leaveRoom', {room, email: user.email});
};

const deleteRoom = () => {
  socket.emit('deleteRoom', room);
};

const addUserToRoom = () => {
  socket.emit('addUserToRoom', { email: emailToAdd, room });
};

const sendMessage = (e) => {
  e.preventDefault();
  if (message && room) {
    socket.emit('sendMessage', {room, message, userName: user.name });
    setMessage('');
  }else {
    alert('Please enter a room name and a message.');
  }
};

    return (
        <div>
            <h2>Home Page</h2>
            <div className="sidebar">
            <div id = "room-controls">
            <input
                id="roomName"
                type="text"
                placeholder="Enter room name"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
            />
            <button onClick={createRoom}>Create Room</button>
            <button onClick={joinRoom}>Join Room</button>
            <button onClick={leaveRoom}>Leave Room</button>
            <button onClick={deleteRoom}>Delete Room</button>

            <input
                    id="emailToAdd"
                    type="text"
                    placeholder="Enter email to add to room"
                    value={emailToAdd}
                    onChange={(e) => setEmailToAdd(e.target.value)}
                />
                <button onClick={addUserToRoom}>Add User to Room</button>

            </div>

            <div id="room-list">
            <h2>Rooms</h2>
            <ul>
                {rooms.map((room,index) => (
                <li key={index}>{room}</li>
                ))}
            </ul>
            </div>
              <Routes>
                <Route path = '/login' exact>
                  <button onClick={()=> {setIsAuth(false), logout}}>
                    Log Out
                  </button>
                </Route>
              </Routes>
            </div>

            <div className = "chat-container">
            <ul id="messages">
            {messages.map((msg,index)=>(
                <li key={index}><strong>{msg.userName}: </strong>{msg.message}</li>
            ))}
            </ul>

            <form id="form" onSubmit={sendMessage}>
            <input
                id="input"
                autocomplete="off"
                vallue={message}
                onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit">send</button>
                </form>
              </div>
        </div>
    )
}
export default Home;