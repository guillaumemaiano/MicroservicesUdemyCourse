import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default({ postId }) => {

    const commentsUrl = `http://localhost:4001/posts/${postId}/comments/`;

    const [comments, setComments] = useState([]);

    const fetchComments = async () => {
        const res = await axios.get(commentsUrl);
        setComments(res.data);
        console.log(commentsUrl," ",postId, " data: ", res.data, res);
    };

    useEffect(
        () => {
            fetchComments();
        },

    // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const renderedComments = comments
                                .map(
                                    comment => {
                                        return <li className='comment' key={comment.id}>
                                            {comment.content }
                                        </li>;
                                    }
                                );
 
    return <ul className="justify-content-between d-flex flex-right flex-wrap">
        {renderedComments}
    </ul>;
};       