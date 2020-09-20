import React, { useState } from 'react';
import { useParams } from 'react-router-dom'
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';

const NewPassword = () => {
  const [password, setPassword] = useState("");
  const history = useHistory();
  const {token} = useParams();

  const postData = () => {
    fetch('/newPassword', {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        password,
        token
      })
    }).then(res => res.json())
    .then(result => {
      if(result.error) {
        M.toast({html: result.error, classes: "c62828 red darken-3"})
      } else {
        M.toast({html: result.message, classes: "#43a047 green darken-1"})
        history.push('/login');
      }
    }).catch(err => console.log(err));
  };

  return (
    <div className="myCard">
      <div className="card auth-card input-field">
        <h2>Instagram</h2>
        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="btn waves-effect waves-light #64b5f6 blue darken-1"
          onClick={() => {postData()}}
        >
          Update Password
        </button>
      </div>
    </div>
  );
};

export default NewPassword;