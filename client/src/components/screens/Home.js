import React from 'react';

const Home = () => {
  return (
    <div className="home">
      <div className="card home-card">
        <h5>Abbasali</h5>
        <div className="card-image">
          <img src="https://images.unsplash.com/photo-1449034446853-66c86144b0ad?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"/>
        </div>
        <div className="card-content">
        <i className="material-icons" style={{color: "red"}}>favorite</i>
          <h6>Title</h6>
          <p>Body of the post will come here</p>
          <input type="text" placeholder="Add comment"/>
        </div>
      </div>
      <div className="card home-card">
        <h5>Abbasali</h5>
        <div className="card-image">
          <img src="https://images.unsplash.com/photo-1449034446853-66c86144b0ad?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"/>
        </div>
        <div className="card-content">
        <i className="material-icons" style={{color: "red"}}>favorite</i>
          <h6>Title</h6>
          <p>Body of the post will come here</p>
          <input type="text" placeholder="Add comment"/>
        </div>
      </div>
      <div className="card home-card">
        <h5>Abbasali</h5>
        <div className="card-image">
          <img src="https://images.unsplash.com/photo-1449034446853-66c86144b0ad?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"/>
        </div>
        <div className="card-content">
          <i className="material-icons" style={{color: "red"}}>favorite</i>
          <h6>Title</h6>
          <p>Body of the post will come here</p>
          <input type="text" placeholder="Add comment"/>
        </div>
      </div>
    </div>
  );
};

export default Home;