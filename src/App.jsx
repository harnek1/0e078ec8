import React, { useState, useEffect } from 'react';
import axios from 'axios';

import ReactDOM from 'react-dom';
import {  BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './Header.jsx';
import ActivityDetail from './ActivityDetail.jsx';
import Archive from './Archive.jsx';
import Footer from './Footer.jsx';


const App = () => {
  let [posts, setPosts] = useState([]);
  let [imageUrl, setImageUrl] = useState("")
  useEffect(() => {
    axios.get('https://aircall-backend.onrender.com/activities')
      .then(response => {
        const formattedPosts = response.data.filter(post => !post.is_archived).map(post => {
          if(post.direction == "inbound")
          {
            setImageUrl("../src/images/incoming-call.png")
          }else
          {
            setImageUrl("../src/images/outcoming-call.png")
          }
          return {
            ...post,
            created_at: new Date(post.created_at).toLocaleString(),
            image: imageUrl
          };
        });
        setPosts(formattedPosts);
      });
  }, [posts]);

  const handleArchive = async (id) => {
    try {
      const response = await axios.patch(`https://aircall-backend.onrender.com/activities/${id}`, {
        is_archived: true
      });

      // Update the UI by filtering out the archived post
      setPosts(posts.filter(post => post.id !== id));
    } catch (error) {
      console.error('Error archiving post:', error);
    }
  };


  const archiveAllCalls = async () => {
    try {
      if (posts.length > 0) {
        for (const post of posts) {
          await axios.patch(`https://aircall-backend.onrender.com/activities/${post.id}`, {
            is_archived: true
          });
        }
      }
     
         // Update the state after all posts are archived
         setPosts(posts.filter(post => post.is_archived !== true));
      
    } catch (error) {
      console.error('Error archiving post:', error);
    }
  };
  return (

      <div className='container'>
      <Header/>
      <Routes>
        <Route path="/" element={
        <div className="container-view"> 
        <Link to="/Archive"><button>Archived</button></Link>
        <button onClick={() => archiveAllCalls()}>Archive All Calls</button>
        <hr/>
        {posts.length === 0 ? (
        <p>Sorry, there are no calls.</p>
      ) : (posts.map(post => (
          <div key={post.id}>
            <Link to={`/post/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <br/>
              <div><img src={imageUrl} height="6%" width="6%"/>From: {post.from}</div> 
              <span id="to">To:{post.to}</span>
              <span>{post.created_at} </span>
            </Link>

            <button id="archiveButton" onClick={() => handleArchive(post.id)}>Archive</button>
            <hr/>
          </div>
          
        ))
      )}  
      </div>
    }/>
      <Route path="/" element={<App />} />
      <Route path="/Archive/*" element={<Archive />} />
      <Route path="/post/:id" element={<ActivityDetail />} />
      
      </Routes>
      <Footer/>
    </div>
  );
};


export default App;
