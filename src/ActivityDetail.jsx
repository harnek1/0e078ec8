import React, { useEffect, useState } from 'react';
import {  BrowserRouter as Router, useParams, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios'
import Header from './Header.jsx';
import Footer from './Footer.jsx';
const ActivityDetail = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
  
    useEffect(() => {
      axios.get(`https://aircall-backend.onrender.com/activities/${id}`)
        .then(response => {
          setPost(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    }, [id]);

    if (!post) {
        return <div>Loading...</div>;
      }
    
      return (
        
        <div>
        
        <Link to={`/`}><button>Back to Home</button></Link>
        <br/>
          <h2>Call Details</h2>
          <p>Direction: {post.direction}</p>
          <p>From: {post.from}</p>
          <p>To: {post.to}</p>
          <p>Date & Time: {new Date(post.created_at).toLocaleString()}</p>
          <p>Call type: {post.call_type}</p>
          <p>Duration: {post.duration}seconds</p>
        </div>
        
      );
    };


export default ActivityDetail;