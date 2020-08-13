import React from 'react';

export default ({ comments }) => {

    const statusOfComment = (status) => {
        switch (status) {
            case "pending":
                return <div className='unmoderated'>This comment is awaiting moderation.</div>
            case "rejected":
                return  <div className='rejected'>
                    This comment was rejected
                </div>
            case "approved":
            // no action required
                break;
            default:
                return <div className="error">
                    {status}
                </div>;
        }
    };

    const renderedComments = comments
        .map(
            comment => {
                return <li className='comment' key={comment.id}>
                    {comment.content}
                    {statusOfComment(comment.status)}
                </li>;
            }
        );

    return <ul className="justify-content-between d-flex flex-right flex-wrap">
        {renderedComments}
    </ul>;
};       