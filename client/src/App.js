import React, { useEffect, createContext, useReducer, useContext } from 'react';
import Navbar from './components/Navbar'
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
import './App.css';
import Login from './components/screens/Login';
import Profile from './components/screens/Profile';
import Signup from './components/screens/Signup';
import Home from './components/screens/Home';
import CreatePost from './components/screens/CreatePost';
import ResetPassword from './components/screens/ResetPassword';
import NewPassword from './components/screens/NewPassword';
import { reducer, initialState } from './reducers/userReducer';

export const UserContext = createContext();

const Routing = () => {
  const {state, dispatch} = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if(user) {
      dispatch({type: "USER", payload: user});
    } else if(!history.location.pathname.startsWith("/reset")) {
      history.push('/login');
    }
  }, []);

  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/login">
        <Login />
      </Route>
      <Route exact path="/profile/:userId?">
        <Profile />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route path="/createPost">
        <CreatePost />
      </Route>
      <Route exact path="/reset">
        <ResetPassword />
      </Route>
      <Route path="/reset/:token">
        <NewPassword />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <UserContext.Provider value={{state, dispatch}}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
