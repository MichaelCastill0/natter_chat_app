Overview
This application is divided into two major components, the frontend and backend. The frontend has an authentication method, application interface, and room controls. The backend has the application logic, data management, and database. Frontend handles the user interaction and the backend handles application logistics.

Back-end:
Database:
MongoDB is used as a database service to store user information and message history.
The database has two collections one for the Users Scheme and another for the Messages Scheme.
Chat Features:
The backend uses Express through Node.js to implement the application logic. The chat create, join, leave, delete, and invite functions are mostly handled here. Managing the data and transfer from the application to the database is done through this component.
Socket.IO:
	Sockets are used through socket.io to communicate commands and information from the backend to the frontend and vice versa. Messages and user account data is passed through this tool and allows for real-time communication between the server and client. The backend side uses socket.io to receive user prompts for the chat features mentioned above. User information is also taken to create user profiles to store in the database.

Front-end:
Socket.IO Client:
	In the frontend, socket.io communicates user actions and collects user input. Some application logic is triggered by these actions which sends information to the server, and updates the user interface.
Oauth:
	Authentication is done through Oauth 2.0, this provides Google one-tap authentication to the app. This allows the user to do account registration or sign in using a Google account. We then use Json Web Tokens (JWT) to gather the user name and email.
Room controls:
	Some chat functionality is done in the frontend through React.js. Using the authentication status, the application decides whether to allow the user’s action to have any effect on the backend. This component handles a  small part of the chat functionality and delegates the rest to the backend.
Interface:
The interface is composed of what is displayed to the user on screen. The user will use the url to go to the application which takes them to the authentication screen, and later on to the chat features. The interface is made of React.js and uses HTML, CSS, and Javascript to render the application interface. This is where the buttons, message and room displays, and input boxes for the application are created. This takes the user actions and calls the relevant application functions to handle the input.
Testing:
No automated testing has been done for this application. We have manually tested some of the features of this application, trying unusual sequences of actions to find any bugs. Some were found and fixed, though the application still needs more testing and debugging to polish it.

Github: MichaelCastill0/natter_chat_app at final (github.com)

URL: Natter (natter-chat-app-vkak.onrender.com)

