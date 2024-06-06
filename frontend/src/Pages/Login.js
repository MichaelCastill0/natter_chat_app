import logo from '../assets/logo.png'
import React, { useState, useEffect} from 'react';
import io from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from '../App'
import loggedIn from '../App'

const socket = io.connect('http://localhost:5000')

function Login() {

    
    const [showSignIn, setShowSignIn] = useState(true); // State to control the visibility of the sign-in button
    const [user, setUser] = useState({});

    function handleCallbackResponse(response) {
        console.log(`Encode JWT ID token: ${response.credential}`);
        var userObject = jwtDecode(response.credential);
        console.log(userObject);
        setUser(userObject);
        setShowSignIn(false); // Hide the sign-in button
    
        socket.emit('saveUser', { token: response.credential });//Call saveUser and send token
    
        socket.emit('getUserRooms', userObject.email);
      }
    
      function handleSignOut(event) {
        setUser({});
        setShowSignIn(true);
         // Show the sign-in button again
      }
    
      useEffect(() => {
        /* global google */
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
    
    if(!loggedIn/*Need to use Context*/){
      return (
          <div>
              <h2>Login Page</h2>
              <img src={logo} alt="" />

              {showSignIn && <div id="signInDiv">
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
              </div>}{" "}

          </div>
      );
  }
  if(loggedIn/*Need to use Context*/){
    return(
        //Code to redirect to '/' a.k.a Home.js
        <BrowserRouter>
          <Routes>
            <Route element={<App />} path="/" />
          </Routes>
        </BrowserRouter>
    );
  }

}

export default Login