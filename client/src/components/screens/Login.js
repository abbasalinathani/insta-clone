import React, { useState, useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';
import { UserContext } from '../../App';

const Login = () => {
  const {state, dispatch} = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const postData = () => {
    if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
      M.toast({html: "Invalid Email", classes: "c62828 red darken-3"})
      return;
    }
    fetch('/signin', {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    }).then(res => res.json())
    .then(result => {
      if(result.error) {
        M.toast({html: result.error, classes: "c62828 red darken-3"})
      } else {
        localStorage.setItem("jwt", result.token)
        localStorage.setItem("user", JSON.stringify(result.user));
        dispatch({type: "USER", payload: result.user});
        M.toast({html: "Signin successful!", classes: "#43a047 green darken-1"})
        history.push('/');
      }
    }).catch(err => console.log(err));
  };

  return (
    <div className="myCard">
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn waves-effect waves-light #64b5f6 blue darken-1"
          onClick={() => {postData()}}
        >
          Login
        </button>
        <h5>
          <Link to="/reset">Don't have an account?</Link>
        </h5>
        <h6>
          <Link to="/signup">Forgot Password?</Link>
        </h6>
      </div>
    </div>
  );
};

export default Login;