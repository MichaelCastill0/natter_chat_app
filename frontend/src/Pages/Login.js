import logo from '../assets/logo.png'
import React, { useState, useEffect} from 'react';
import io from 'socket.io-client';
import { jwtDecode } from 'jwt-decode';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useAuthContext, AuthContextProvider } from '../Context/AuthContext';
import Home from './Home';

const socket = io.connect('http://localhost:5000')

function Login() {

    
    const [showSignIn, setShowSignIn] = useState(true); // State to control the visibility of the sign-in button
    const [user, setUser] = useState({});
    const { authUser } = useAuthContext();

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
    
    
  if(Object.keys(user).length !== 0){
    return(
        //Code to redirect to '/' a.k.a Home.js
        <BrowserRouter>
          <Routes>
            <AuthContextProvider isAuth={ false } />
            <Route element={<Home />} path="/" />
          </Routes>
        </BrowserRouter>
    );
  }
  else{
    return (
        <div>
            <h2>Login Page</h2>
            <img src={logo} alt="" />
  
            <div id="signInDiv"></div>
  
        </div>
    );
  }

}

export default Login;

/*

const Login = () => {
    // Assuming you have a function to authenticate the user using Google OAuth
    const handleGoogleLogin = () => {
        // Authenticate the user using Google OAuth
        // Once authenticated, obtain the user information
        
        // For example:
        const authUser = {  'User information obtained from Google OAuth'  };

        return (
          <AuthContextProvider authUser={authUser}>
              {'Your authenticated application components' }
          </AuthContextProvider>
      );
  };

  return (
      <div>
          {'Your login button or other login-related UI'}
          <button onClick={handleGoogleLogin}>Login with Google</button>
      </div>
  );
};

export default Login;

*/

/*
            {Object.keys(user).length !== 0 && (
                <div>
                <img src={user.picture} alt="User profile" />
                <h3>{user.name}</h3>
                </div>
            )}
*/