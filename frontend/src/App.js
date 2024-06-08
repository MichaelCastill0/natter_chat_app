import React, { useState, useEffect} from 'react';
import { createContext } from 'react'
import { BrowserRouter, Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Header from './components/Header'
import Home from './Pages/Home'
import Login from './Pages/Login'
import NoPage from './Pages/NoPage'
import PrivateRoutes from './utils/PrivateRoutes'
import { jwtDecode } from 'jwt-decode';
import io from 'socket.io-client';
import { AuthContextProvider, useAuthContext } from './Context/AuthContext';
import './App.css';


const socket = io.connect('http://localhost:5000')
export const UserContext = createContext();

function App() {
  const { loggedIn } = useAuthContext();

  return (
    <div className="App">
        <Routes>
          <Route path='/' element={loggedIn ? <Home /> : <Login />} />
          <Route path='/login' element={loggedIn ? <Navigate to='/' /> : <Login />} />
        </Routes>
    </div>
  );
}

export default App;