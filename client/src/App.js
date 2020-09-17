import React from 'react';
import Navbar from './components/Navbar'
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import Login from './components/screens/Login';
import Profile from './components/screens/Profile';
import Signup from './components/screens/Signup';
import Home from './components/screens/Home';
import CreatePost from './components/screens/CreatePost';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/profile">
        <Profile />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route path="/createPost">
        <CreatePost />
      </Route>
    </BrowserRouter>
  );
}

export default App;
