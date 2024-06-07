import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:5000');
/*
function Login({ onLogin }) {
  const [showSignIn, setShowSignIn] = useState(true);
  const navigate = useNavigate();

  function handleCallbackResponse(response) {
    console.log(`Encoded JWT ID token: ${response.credential}`);
    const userObject = jwtDecode(response.credential);
    console.log(userObject);
    setShowSignIn(false);
    socket.emit('saveUser', { token: response.credential });
    onLogin(userObject);
    navigate('/chat');
  }

  useEffect(() => {
    if(window.google && window.google.accounts){
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
}
  }, [showSignIn]);

  return (
    <div>
      {showSignIn && <div id="signInDiv"></div>}
    </div>
  );
}
*/

//import React from 'react';
//import { useState } from 'react';

const useGoogleSignIn = () => {
    const [googleAuth, setGoogleAuth] = useState(null);
  
    const initGoogleSignIn = () => {
      window.gapi.load('auth2', () => {
        window.gapi.auth2
          .init({
            client_id: '457934960513-bh8upev2pr2f4hm5tqk245aq7fukbvqp.apps.googleusercontent.com',
          })
          .then(setGoogleAuth)
          .catch(error => {
            console.error('Failed to initialize Google Auth:', error);
          });
      });
    };
  
    useEffect(() => {
      initGoogleSignIn();
    }, []);
  
    return googleAuth;
  };
  
  const GoogleSignIn = async () => {
    const googleAuth = useGoogleSignIn();
    const navigate = useNavigate();
  
   // const handleSignIn = async () => {
      if (!window.gapi || !googleAuth) {
        console.error('Google API not initialized');
        return;
      }
  
      try {
        const auth2 = await window.gapi.auth2.getAuthInstance();
        if (!auth2) {
          console.error('Google Auth2 instance not found');
          return;
        }
  
        const user = await auth2.signIn();
        const idToken = user.getAuthResponse().id_token;
  
        const response = await fetch('http://localhost:5000/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: idToken }),
        });
  
    //    const userData = await response.json();
    //    console.log('User signed in:', userData);
    //    navigate('/chat'); // Redirect to the chat page

        if (response.ok) {
          const userData = await response.json();
          console.log('User signed in:', userData);
          navigate('/chat'); // Redirect to the chat page
        } else {
          console.error('Failed to sign in:', response.statusText);
        }
      } catch (error) {
        console.error('Error signing in:', error);
      }
    //};
  
    return (
      <div>
        <button onClick={GoogleSignIn}>Sign in with Google</button>
      </div>
    );
  };

export default GoogleSignIn;
