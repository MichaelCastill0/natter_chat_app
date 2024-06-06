import React, { useState, useEffect} from 'react';
import { createContext } from 'react'
import { BrowserRouter, Router, Routes, Route, Outlet } from 'react-router-dom'
import Header from './components/Header'
import Home from './Pages/Home'
import Login from './Pages/Login'
import NoPage from './Pages/NoPage'
import PrivateRoutes from './utils/PrivateRoutes'
import { jwtDecode } from 'jwt-decode';
import io from 'socket.io-client';
import './App.css';


const socket = io.connect('http://localhost:5000')
export const UserContext = createContext();

function App() {
  const [user, setUser] = useState({ loggedIn: false})
 /*
  const loggedIn = false;
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const[messages, setMessages] = useState([]);
  const [rooms,setRooms] = useState([]);
  const [emailToAdd, setEmailToAdd] = useState('')

  const [showSignIn, setShowSignIn] = useState(true); // State to control the visibility of the sign-in button
  const [user, setUser] = useState({});
*/
/* *********************Google Sign-In********************************************** */
/*
  function handleCallbackResponse(response) {
    console.log(`Encode JWT ID token: ${response.credential}`);
    var userObject = jwtDecode(response.credential);
    console.log(userObject);
    setUser(userObject);
    setShowSignIn(false); // Hide the sign-in button
    loggedIn = true;

    socket.emit('saveUser', { token: response.credential });//Call saveUser and send token

    socket.emit('getUserRooms', userObject.email);
  }

  function handleSignIn(event) {
    setUser({});
    setShowSignIn(false); // Show the sign-in button again
    loggedIn = true;
  }

  function handleSignOut(event) {
    setUser({});
    setShowSignIn(true); // Show the sign-in button again
    loggedIn = false;
  }

  useEffect(() => {
*/
    /* global google */
/*
    google.accounts.id.initialize({
      client_id: "457934960513-bh8upev2pr2f4hm5tqk245aq7fukbvqp.apps.googleusercontent.com",
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
*/
    /* ***************************Socket IO************************************** */
/*
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

*/
/* **************************Return********************************** */

  return (
    <div className="App">
      <UserContext.Provider value={{user, setUser}}>
        <BrowserRouter>
          <Routes>
            <PrivateRoutes path='/' component={Home} isAuth={user} />
            <Route element={<Login />} path="/login" />
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
    </div>
  );
}

/*
      <UserContext.Provider value={{user, setUser}}>
        <BrowserRouter>
          <Routes>
            <Route element={<Login />} path="/login" />
            <Route element={<PrivateRoutes />}>
              <Route element ={<Home/>} path="/" />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserContext.Provider>
*/

/*
    {showSignIn && <div id="signInDiv">
      {} // Conditionally render the sign-in button
      {Object.keys(user).length !== 0 && (
        <button onClick={(e) => handleSignOut(e)}>Sign Out</button>
      )}
      {Object.keys(user).length !== 0 && (
        <div>
          <img src={user.picture} alt="User profile" />
          <h3>{user.name}</h3>
        </div>
      )}
    </div>}{" "}
*/
/*<div>
            <Header />
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
      */

export default App;