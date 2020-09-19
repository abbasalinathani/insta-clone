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

  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        followId: userId
      })
    }).then(res => res.json())
    .then(result => {
      dispatch(
        {
          type: "UPDATE",
          payload: {
            following: result.following,
            followers: result.followers
          }
        });
      localStorage.setItem("user", JSON.stringify(result));
      setUser((prevState) => {
        return {
          ...prevState,
          followers: [...prevState.followers, result._id]
        }
      });
    }).catch(err => console.log(err));
  };
  
  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        unfollowId: userId
      })
    }).then(res => res.json())
    .then(result => {
      dispatch(
        {
          type: "UPDATE",
          payload: {
            following: result.following,
            followers: result.followers
          }
        });
      localStorage.setItem("user", JSON.stringify(result));
      setUser((prevState) => {
      const newFollower = prevState.followers.filter(item => {
        return item !== result._id
      });
      return {
          ...prevState,
          followers: newFollower
        }
      });
    }).catch(err => console.log(err));
  };

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
            <h6>{user && user.followers ? user.followers.length : 0} followers</h6>
            <h6>{user && user.followers ? user.following.length : 0} following</h6>
          </div>
          {
            userId
            ? <button
                className="btn waves-effect waves-light #64b5f6 blue darken-1"
                style={{margin: "10px 0px"}}
                onClick={() => {
                  user && user.followers?.includes(state._id)
                  ? unfollowUser()
                  : followUser()
                }}
              >
                {
                  user && user.followers?.includes(state._id)
                  ? "Unfollow"
                  : "Follow"
                }
              </button>
            : ""
          }
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