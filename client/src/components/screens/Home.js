import React, { useEffect, useState, useContext } from 'react';
import { UserContext } from '../../App';

const Home = () => {
  const [data, setData] = useState([]);
  const {state, dispatch} = useContext(UserContext);

  useEffect(() => {
    fetch('/allPosts', {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    }).then(res => res.json())
    .then(result => {
      setData(result.posts);
    }).catch(err => console.log(err));
  }, []);

  const likePost = (postId) => {
    fetch('/likePost', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId
      })
    }).then(res => res.json())
    .then(result => {
      const newData = data.map(item => {
        if(item._id === result._id) {
          return result;
        } else {
          return item;
        }
      })
      setData(newData);
    }).catch(err => console.log(err));
  };
  
  const unlikePost = (postId) => {
    fetch('/unlikePost', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        postId
      })
    }).then(res => res.json())
    .then(result => {
      const newData = data.map(item => {
        if(item._id === result._id) {
          return result;
        } else {
          return item;
        }
      })
      setData(newData);
    }).catch(err => console.log(err));
  };

  const postComment = (text, postId) => {
    fetch('/comment', {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      },
      body: JSON.stringify({
        text,
        postId
      })
    }).then(res => res.json())
    .then(result => {
      const newData = data.map(item => {
        if(item._id === result._id) {
          return result;
        } else {
          return item;
        }
      })
      setData(newData);
    }).catch(err => console.log(err));
  };

  return (
    <div className="home">
      {
        data.map(item => {
          return (
            <div className="card home-card" key={item._id}>
              <h5>{item.postedBy.name}</h5>
              <div className="card-image">
                <img src={item.photo} alt={item.title}/>
              </div>
              <div className="card-content">
              <i
                className="material-icons"
                style={{color: item.likes.includes(state._id) ? "red" : "black"}}
                onClick={() => {
                  item.likes.includes(state._id)
                  ? unlikePost(item._id)
                  : likePost(item._id)
                }}
              >
                {
                  item.likes.includes(state._id)
                  ? 'favorite'
                  : 'favorite_border'
                }
              </i>
                <h6>{item.likes.length} Likes</h6>
                <h6>{item.title}</h6>
                <p>{item.body}</p>
                {
                  item.comments.map(comment => {
                    return (
                      <h6 key={comment._id}>
                        <span style={{fontWeight: "500"}}>{comment.postedBy.name} </span>
                        {comment.text}
                      </h6>
                    );
                  })
                }
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    postComment(e.target[0].value, item._id)
                  }}
                >
                  <input
                    type="text"
                    placeholder="Add comment"
                  />
                </form>
              </div>
            </div>
          );
        })
      }
    </div>
  );
};

export default Home;