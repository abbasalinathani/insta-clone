import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';
import { useParams } from 'react-router-dom';

const Profile = () => {
  const [myPosts, setMyPosts] = useState([]);
  const [user, setUser] = useState({})
  const [image, setImage] = useState("");
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

  const updatePic = (file) => {
    setImage(file);
  };

  useEffect(() => {
    if(image) {
      const data = new FormData();
      data.append('file', image);
      data.append('upload_preset', 'insta-clone');
      data.append('cloud_name', 'abbasali');
      fetch("https://api.cloudinary.com/v1_1/abbasali/image/upload", {
        method: "post",
        body: data
      }).then(res => res.json())
      .then(result => {
        fetch('/updatePic', {
          method: "put",
          headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
              pic: result.url
            })
        }).then(res => res.json())
        .then(result => {
          localStorage.setItem("user", JSON.stringify(user));
          dispatch({type: "UPDATEPIC", payload: result});
        })
      }).catch(err => console.log(err));
    }
  }, [image]);

  return (
    <div style={{maxWidth: "550px", margin: "10px auto"}}>
      <div
        style={{
          margin: "18px 0px",
          borderBottom: "1px solid grey",
          }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            }}
          >
          <div>
            <img
              style={{width: "160px", height:"160px", borderRadius: "80px"}}
              src={user && user.pic}
            />
          </div>
          <div>
            <h4>{user && user.name}</h4>
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
        {
          !userId
          ?   
            <div className="file-field input-field">
              <div className="btn #64b5f6 blue darken-1">
                <span>Update Pic</span>
                <input
                  type="file"
                  onChange={(e) => {updatePic(e.target.files[0])}}
                />
              </div>
              <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
              </div>
            </div>
            : ""
        }
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