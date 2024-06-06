import Header from '../components/Header'
import logo from '../public/logo.png'


export default function Login() {
    
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
        setShowSignIn(true); // Show the sign-in button again
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
      
    return (
        <div>
            <Header />
            <h2>Login Page</h2>
            <img src={logo} alt="" />

        </div>
    )
}