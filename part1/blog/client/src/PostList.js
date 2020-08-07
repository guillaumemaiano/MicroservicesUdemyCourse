import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CommentCreate from './CommentCreate';
import CommentList from './CommentList';

export default() => {

    const [posts, setPosts] = useState({});

    const serviceUrl = "http://localhost:4002/posts";

    const verbose = true;

    const fetchPosts = async () => {
      const res = await axios.get(serviceUrl);
      if (verbose) {
        console.log("Service responded with ", res.data.posts);
      }
      setPosts(res.data.posts);
    };

    useEffect(
        () => {
            fetchPosts();
        },
        []
    );

    if (verbose) {
       console.log("Posts retrieved from query service ", posts);
    }
    // console.log("Testing map",{"posts": []}.posts.map(test => {return test;}));
    // console.log([].map(e => {return e;}));
    
    const renderedPosts = Object.values(posts)
                                .map(
                                    post => {
                                        if (verbose) {
                                            console.log(post);
                                        }
                                        return <div className='card' key={post.id}>
                                            <div className='card-body'>
                                            <h3>{post.content}</h3>
                                            </div>
                                            <CommentCreate postId={post.id}/>
                                            <CommentList comments={post.comments || []}/>
                                        </div>;
                                    }
                                );
    return <div className="justify-content-between d-flex flex-right flex-wrap">
        {renderedPosts}
    </div>;
};