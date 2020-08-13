const express = require('express');

const parser = require('body-parser');

const axios = require('axios');

const { randomBytes } = require('crypto');

const cors = require('cors');

const app = express();

const port = 4001;
const eventbusPort = 4005;
const path = '/posts/:id/comments';

const commentsByPostId = {};

const verbose = (() => {
    const argumentsFromCL = process.argv;
    return argumentsFromCL.some(function (val, index, args) {
        console.log(index + ': ' + val);
        if (val === 'verbose') {
            console.log("Talkative mode engaged. How do you do?")
            return true;
        }
    });
    }
)();

app.use(parser.json());
app.use(cors());

// GET
app.get(path, (req, res) => {
    const comments = commentsByPostId[req.params.id] || [];
    if (verbose) {
       console.log("Comments Array ", commentsByPostId, " : ", comments, ".");
    }
    res.status(200).send(comments);
});

// POST
app.post(path, async (req, res) => {
    const randomId = randomBytes(4).toString('hex');
    const postId = req.params.id;
    const { content } = req.body;
    const comments = commentsByPostId[postId] || [];
    const comment = { id: randomId, content };
    comments.push(comment);
    commentsByPostId[postId] = comments;

    await axios.post(`http://localhost:${eventbusPort}/events`, {type: 'CommentCreated', data: {id: randomId, postId, content, status: 'pending'}});

    res.status(201).send("id & comment: "  + randomId + " : " + content);
});

// Event bus communication
app.post('/events', async (req, res) => {
    if (verbose) {
      console.log("Received event: ", req.body.type);
    }
    if (req.body.type === 'CommentModerated') {
        console.log("Comments was moderated, informing via update event", req.body, req.body.data.commentId, req.body.data.postId, req.body.data.content, req.body.data.status);
        await axios.post(`http://localhost:${eventbusPort}/events`, {
            type: 'CommentUpdated', data: { id: req.body.data.commentId, postId: req.body.data.postId, content: req.body.data.content, status: req.body.data.status }
        });
    }
    res.send({});
});

// LISTEN
app.listen(port, () => {
    if (verbose) {
     console.log('Listening on port '+ port);
    }
});


// curl -X  POST -H "Content-Type: application/json" -d '{ "content": "Commenting with my FIST."}' http://localhost:4001/posts/someid/comments/
// curl  http://localhost:4001/posts/someid/comments/