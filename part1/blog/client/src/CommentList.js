import React from 'react';
import axios from 'axios';

export default({ postId }) => {
    const commentsUrl = "http://localhost:4001/posts/{$postId}}/comments/";
    const renderedComments = Object.values(comments)
                                .map(
                                    comment => {
                                        return <div className='comment' key={comment.randomId}>
                                           {comment.title}
                                        </div>;
                                    }
                                );
 
    return <div className="justify-content-between d-flex flex-right flex-wrap">
        {renderedComments}
    </div>;
};       