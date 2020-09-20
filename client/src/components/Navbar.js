import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom'
import { UserContext } from '../App';
import M from 'materialize-css';

const Navbar = () => {
  const {state, dispatch} = useContext(UserContext);
  const history = useHistory();
  const searchModal = useRef(null);
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);

  const renderList = () => {
    if(state) {
      return [
        <li key="1">
          <i
            data-target="modal1"
            className="large material-icons modal-trigger"
            style={{color: "black"}}
          >
            search
          </i>
        </li>,
        <li key="2"><Link to="/profile">Profile</Link></li>,
        <li key="3"><Link to="/createPost">Create Post</Link></li>,
        <li key="4">
          <button
            className="btn #c62828 red darken-3"
            onClick={() => {
              localStorage.clear();
              dispatch({type:"CLEAR"});
              history.push('/login');
            }}
          >
            Logout
          </button>
        </li>
      ];
    } else {
      return [
        <li key="5"><Link to="/login">Login</Link></li>,
        <li key="6"><Link to="/signup">Signup</Link></li>
      ]
    }
  };

  const fetchUsers = (query) => {
    setSearch(query);
    fetch('/searchUsers', {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        query
      })
    }).then(res => res.json())
    .then(result => {
      let users = result.users.filter(user => {
        return user._id !== state._id;
      })
      setUserDetails(users);
    }).catch(err => console.log(err));
  };

  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);

  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? "/" : "/login"} className="brand-logo left">Instagram</Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
      <div id="modal1" className="modal" ref={searchModal} style={{color: "black"}}>
        <div className="modal-content">
          <input
            type="text"
            placeholder="Search users"
            value={search}
            onChange={(e) => fetchUsers(e.target.value)}
          />
          <ul className="collection">
          {
            userDetails.map(item => {
              return (
                <Link
                  key={item._id}
                  to={`/profile/${item._id}`}
                  onClick={() => {
                    M.Modal.getInstance(searchModal.current).close();
                    setSearch("");
                  }}
                >
                  <li className="collection-item">
                    <div>
                      <div>{item.name}</div>
                      {/* <div>Email: {item.email}</div> */}
                    </div>
                  </li>
                </Link>
                
              );
            })
          }
          </ul>
        </div>
        <div className="modal-footer">
          <button 
            className="modal-close waves-effect waves-green btn-flat"
            onClick={() => {setSearch("")}}
          >
            Close
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;