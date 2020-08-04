import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

export default() => {

    const [posts, setPosts] = useState({});

    const serviceUrl = "http://localhost:4000/posts";

    const fetchPosts = async () => {
      const res = await axios.get(serviceUrl);
      setPosts(res.data);
    };

    useEffect(
        () => {
            fetchPosts();
        },
        []
    );
    
    const renderedPosts = Object.values(posts)
                                .map(
                                    post => {
                                        return <div className='card' key={post.randomId}>
                                            <div className='card-body'>
                                            <h3>{post.title}</h3>
                                            </div>
                                            <CommentCreate postId={post.randomId}/>
                                            <CommentList postId={post.randomId}/>
                                        </div>;
                                    }
                                );
 
    return <div className="justify-content-between d-flex flex-right flex-wrap">
        {renderedPosts}
    </div>;
};