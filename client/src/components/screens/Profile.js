import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const [myPosts, setMyPosts] = useState([]);
  const [user, setUser] = useState({})
  const {state, dispatch} = useContext(UserContext);
  const {userId} = useParams();

  useEffect(() => {
    if(userId) {
      fetch(`/user/${userId}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwt")
        }
      }).then(res => res.json())
      .then(result => {
        setMyPosts(result.posts);
        setUser(result.user);
      }).catch(err => console.log(err));
    } else {
      setUser(state);
      fetch('/myPosts', {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("jwt")
        }
      }).then(res => res.json())
      .then(result => {
        setMyPosts(result.posts);
      }).catch(err => console.log(err));
    } 
  }, [userId]);

  useEffect(() => {
    if(!userId && state) {
      setUser(state);
    }
  }, [state]);

  return (
    <div style={{maxWidth: "550px", margin: "10px auto"}}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          margin: "18px 0px",
          borderBottom: "1px solid grey",
          }}
        >
        <div>
          <img
            style={{width: "160px", height:"160px", borderRadius: "80px"}}
            src="https://images.unsplash.com/photo-1550927407-50e2bd128b81?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
          />
        </div>
        <div>
          <h4>{user && user.name}</h4>
          <h4>{user && user.email}</h4>
          <div style={{display: "flex", justifyContent: "space-between", width: "108%"}}>
            <h6>{myPosts.length} Posts</h6>
            <h6>40 followers</h6>
            <h6>40 following</h6>
          </div>
        </div>
      </div>
      <div className="gallery">
        {
          myPosts.map(item => {
            return (
            <img className="item" src={item.photo} key={item._id}/>
            );
          })
        }
      </div>
    </div>
  );
};

export default Profile;