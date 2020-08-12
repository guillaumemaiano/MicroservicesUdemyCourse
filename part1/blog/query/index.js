const express = require('express');
const axios = require('axios');
const parser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(parser.json());
app.use(cors());

const queryPort = (() => {
    const arguments = process.argv;
    var customPort;
    if (arguments.some(function (val, index, arguments) {
        if (val === 'port') {
            customPort = arguments[index + 1];
            return true;
        }
    })) {
        console.log(`Custom port detected: ${customPort}`);
        return customPort;
    } else {
        return 4002;
    }
}
)();

const verbose = (() => {
    const arguments = process.argv;
    return arguments.some(function (val, index, arguments) {
        console.log(index + ': ' + val);
        if (val === 'verbose') {
            console.log("Talkative mode engaged. How do you do?")
            return true;
        }
    });
}
)();

const pathToPosts = '/posts';
const pathToEvents = '/events';

const posts = [];

// provides full list of posts and comments
app.get(pathToPosts, (req, res) => {
    //res.status(200).send({status: 'OK', posts: posts});
    res.send({ status: 'OK', posts: posts });
});

// event bus communication
app.post(pathToEvents, (req, res) => {

    const parseCommentFromData = (data) => {
        // data.postId is the comment's parent's id
        const postId = data.postId;
        // data.id is the comment's id
        const commentId = data.id;
        // data.content is the comment's actual content (currently a string)
        const commentContent = data.content;
        // data.status is the comment's moderation status (pending, rejected or approved)
        const commentStatus = data.status;
        return { postId, commentId, commentContent, commentStatus };
    };

    const storeComment = (comment, update = false) => {
        // parentPost must exist at this stage (since someone commented on it)
        const parentPost = ((postArray, id) => {
            for (var i = 0; i < postArray.length; i++) {
                if (postArray[i].id === id) {
                    return postArray[i];
                }
                console.log("Coherence error: Post not found.");
            }
        })(posts, comment.postId);
        const commentsForPost = parentPost.comments || [];
        if (update) {
            // delete by id, then store in empty array place
            // TODO
        } else {
            commentsForPost.push({ id: comment.commentId, content: comment.commentContent, status: comment.commentStatus });
        }
        parentPost.comments = commentsForPost;
        if (verbose) {
            // is post modified in place?
            console.log(posts, " Comments ", commentsForPost);
        }
    };

    switch (req.body.type) {
        case 'CommentCreated':
            if (verbose) {
                console.log('Comment Creation detected.');
            }
            const comment = parseCommentFromData(req.body.data);
            storeComment(comment);
            break;
        case 'CommentModerated':
            if (verbose) {
                console.log('Comment Moderation detected, ignoring in Query.');
                // Comment Moderation is managed by the Comments service
            }
            break;
        case 'CommentUpdated':
            if (verbose) {
                console.log('Comment Update detected, updating data known to Query.');
                const comment = parseCommentFromData(req.body.data);
                storeComment(comment, true);
            }
            break;
        case 'PostCreated':
            if (verbose) {
                console.log('Post Creation detected.');
            }
            posts.push({ id: req.body.data.randomId, content: req.body.data.title });
            break;
        default:
            console.log('Type unknown, event bus format change unimplemented: ' + req.body.type);
            res.send(500);
            return;
            res.send(201);
    }

});

app.listen(queryPort, () => {
    console.log("Query server listening on " + queryPort);
});