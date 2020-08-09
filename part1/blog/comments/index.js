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

app.use(parser.json());
app.use(cors());

// GET
app.get(path, (req, res) => {
    const comments = commentsByPostId[req.params.id] || [];
    // console.log("Comments Array ", commentsByPostId, " : ", comments, ".");
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
    console.log("Received event: " + req.body.type);
    if (req.body.type === 'CommentModerated') {
        await axios.post(`http://localhost:${eventbusPort}/events`, {type: 'CommentUpdated', data: {id: req.body.id, postId: req.body.postId, content: req.body.content, status: req.body.status}});
    }
    res.send({});
});

// LISTEN
app.listen(port, () => {console.log('Listening on port '+ port);});


// curl -X  POST -H "Content-Type: application/json" -d '{ "content": "Commenting with my FIST."}' http://localhost:4001/posts/someid/comments/
// curl  http://localhost:4001/posts/someid/comments/