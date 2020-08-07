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
            customPort = arguments[index+1];
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

const pathToPosts='/posts';
const pathToEvents= '/events';

const posts = [];

// provides full list of posts and comments
app.get(pathToPosts, (req, res) => {  
    //res.status(200).send({status: 'OK', posts: posts});
    res.send({status: 'OK', posts: posts});
});

// event bus communication
app.post(pathToEvents, (req, res) => {
    switch (req.body.type) {
        case 'CommentCreated':
            if (verbose) {
                console.log('Comment Creation detected.');
            }
            // data.postId is the comment's parent's id
            const postId = req.body.data.postId;
            // parentPost must exist at this stage (since someone commented on it)
            const parentPost = ((postArray, id) => {
                for (var i = 0; i < postArray.length; i++) {
                    if (postArray[i].id === id) {
                        return postArray[i];
                    }
                    console.log("Coherence error: Post not found.");
                }
            })(posts, postId);
            const commentsForPost = parentPost.comments || [];
            // data.id is the comment's id
            const commentId = req.body.data.id;
            commentsForPost.push({id: commentId, content: req.body.data.content});
            parentPost.comments = commentsForPost;
            // is post modified in place?
            console.log(posts, " Comments ", commentsForPost);
            break;
        case 'CommentModerated':
            if (verbose) {
                console.log('Comment Moderation detected.');
            }
            break;
        case 'PostCreated':
            if (verbose) {
                console.log('Post Creation detected.');
            }
            posts.push({id: req.body.data.randomId, content: req.body.data.title});      
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