import React, { useEffect, useState } from 'react';
import {  BrowserRouter as Router, useParams, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios'
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const Archive = () => {

     let [posts, setPosts] = useState([]);
     let [imageUrl, setImageUrl] = useState("")
       
        useEffect(() => {
          axios.get('https://aircall-backend.onrender.com/activities')
            .then(response => {
              const formattedPosts = response.data.filter(post => post.is_archived).map(post => {
                if(post.length != 0)
                {

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
            }else{
                <p>Sorry, there are no Archived calls.</p>
            }
              });
              
              setPosts(formattedPosts);
              
            });
        
        }, [posts]);

    const handleArchive = async (id) => {
        try {
          const response = await axios.patch(`https://aircall-backend.onrender.com/activities/${id}`, {
            is_archived: false
          });
    
          setPosts(posts.filter(post => post.id !== id));
        } catch (error) {
          console.error('Error unarchiving post:', error);
        }
      }

    const unArchive = async () => {
        try {
            const response = await axios.patch(`https://aircall-backend.onrender.com/reset`, {

            });
            setPosts(posts.filter(post => post.is_archived !== true));
          } catch (error) {
            console.error('Error unarchiving post:', error);
          }
        }

      return (
        <div className='container'>
        <Routes>
          <Route path="/" element={
          <div className="container-view"> 
          <Link to="/"><button>Home</button></Link>
          <button id="UnArchiveCalls"  onClick={() => unArchive()}>UnArchive All Calls</button>
          <hr/>
          {posts.length === 0 ? (
        <p>Sorry, there are no Archived calls.</p>
      ) : (posts.map(post => (
            <div key={post.id}>
              <Link to={`/post/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <br/>
                <div><img src={imageUrl} height="6%" width="6%"/>From: {post.from}</div> 
                <span id="to">To:{post.to}</span>
                <span>{post.created_at} </span>
              </Link>
  
              <button id="archiveButton" onClick={() => handleArchive(post.id)}>UnArchive</button>
              <hr/>
            </div>
              ))
            )}
          
        </div>
      }/>
       
        </Routes>
        
      </div>
        
    );
  };

export default Archive;