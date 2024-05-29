import { useState, useEffect} from 'react';
import { jwtDecode } from 'jwt-decode';
import io from 'socket.io-client';
import './App.css';

const socket = io();

function App() {
 const [room, setRoom] = useState('');
 const [message, setMessage] = useState('');
 const[messages, setMessages] = useState([]);

 function handleCallbackResponse(response) {
  console.log("Encode JWT ID token:" + response.credential);
  var userObject = jwtDecode(response.credential);
  console.log(userObject);
 }
  useEffect( ()=>{
    /* global google */
    google.accounts.id.initialize({
      client_id:
      "457934960513-bh8upev2pr2f4hm5tqk245aq7fukbvqp.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });
    
    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "outline",
      size: "large",
    });
  }, []);

  useEffect(()=> {
    socket.on('chatHistory', (Messages) => {
      setMessages(Messages);
    });

    socket.on('chat message', (msg) => {
      setMessages(prevMessages => [...prevMessages, { message: msg}]);
    });

    socket.on('roomCreated', (room) => {
      alert('Room ${room} created!');
    });

    socket.on('roomJoined', (room) =>{
      alert('Joined room ${room}!');
    });

    socket.on('roomLeft', (room) => {
      alert('Left room ${room}');
    });

    socket.on('roomDeleted', (room) => {
      alert('Room ${room} has been deleted!');
      setMessages([]);
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

  }, []);

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
      <div id="signInDiv"></div>
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
  );
}
export default App;
