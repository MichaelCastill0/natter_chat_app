import { useEffect } from "react";
import './App.css';

function App() {
  function handleCallbackResponse(response) {
    console.log("Encode JWT ID token:" + response.credential);
  }

  useEffect(() => {
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
  
    return (
      <div className="App">
        <div id="signInDiv"></div>
        </div>
    );
  }

/*
  }
  return (
    <div className="App">
      <header className="Natter-Chat">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
*/

export default App;
