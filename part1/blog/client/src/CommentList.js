import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default({ postId }) => {

    const commentsUrl = `http://localhost:4001/posts/${postId}}/comments/`;

    const [comments, setComments] = useState({});

    const fetchComments = async () => {
        const res = await axios.get(commentsUrl);
        setComments(res.data);
        console.log(res.data);
    };

    useEffect(
        () => {
            fetchComments();
        },

// eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const renderedComments = Object.values(comments)
                                .map(
                                    comment => {
                                        console.log('hello');
                                        console.log(comment.randomId);
                                        return <div className='comment' key={comment.randomId}>
                                           {comment.title}
                                        </div>;
                                    }
                                );
 
    return <div className="justify-content-between d-flex flex-right flex-wrap">
        {renderedComments}
    </div>;
};       