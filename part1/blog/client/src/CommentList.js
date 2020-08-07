import React from 'react';

export default({ comments }) => {

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