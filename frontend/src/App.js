import React, { useState, useEffect} from 'react';
import { jwtDecode } from 'jwt-decode';
import io from 'socket.io-client';
import './App.css';

const socket = io.connect('http://localhost:5000')

function App() {
  const [user, setUser] = useState({});
  const [showSignIn, setShowSignIn] = useState(true); // State to control the visibility of the sign-in button

  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const[messages, setMessages] = useState([]);
  const [rooms,setRooms] = useState([]);

/* *********************Google Sign-In********************************************** */
  function handleCallbackResponse(response) {
    console.log("Encode JWT ID token:" + response.credential);
    var userObject = jwtDecode(response.credential);
    console.log(userObject);
    setShowSignIn(false); // Hide the sign-in button
  }

  function handleSignOut(event) {
    setUser({});
    setShowSignIn(true); // Show the sign-in button again
  }

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: "your client id/ secret",
      callback: handleCallbackResponse,
    });
    if (showSignIn) {
      google.accounts.id.renderButton(document.getElementById("signInDiv"), {
        theme: "outline",
        size: "large",
      });
      google.accounts.id.prompt();
    }
  }, [showSignIn]); // Re-run this effect only when showSignIn changes

/* ***************************Socket IO************************************** */
  useEffect(()=> {
    socket.on('chatHistory', (Messages) => {
    setMessages(Messages);
  });

  socket.on('chat message', (msg) => {
    setMessages(prevMessages => [...prevMessages, { message: msg}]);
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
    socket.off('error');
  };
}, [rooms]);

const createRoom = () => {
  socket.emit('createRoom', room);
};

const joinRoom = () => {
  socket.emit('joinRoom', room);
};

const leaveRoom = () => {
  socket.emit('leaveRoom', room);
};

const deleteRoom = () => {
  socket.emit('deleteRoom', room);
};

const sendMessage = (e) => {
  e.preventDefault();
  if (message && room) {
    socket.emit('sendMessage', {room, message });
    setMessage('');
  }else {
    alert('Please enter a room name and a message.');
  }
};
 
return (
  <div className="App">
    {showSignIn && <div id="signInDiv"></div>}{" "}
    {/* Conditionally render the sign-in button */}
    {Object.keys(user).length !== 0 && (
      <button onClick={(e) => handleSignOut(e)}>Sign Out</button>
    )}
    {Object.keys(user).length !== 0 && (
      <div>
        <img src={user.picture} alt="User profile" />
        <h3>{user.name}</h3>
      </div>
    )}

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
    </div>

    <div id="room-list">
      <h2>Rooms</h2>
      <ul>
        {rooms.map((room,index) => (
          <li key={index}>{room}</li>
        ))}
      </ul>
    </div>
    </div>

    <div className = "chat-container">
    <ul id="messages">
      {messages.map((msg,index)=>(
        <li key={index}>{msg.message}</li>
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
);
}
export default App;