const express = require('express');

const parser = require('body-parser');

const { randomBytes } = require('crypto');

const cors = require('cors');

const app = express();

const port = 4001;
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
app.post(path, (req, res) => {
    const randomId = randomBytes(4).toString('hex');
    const { content } = req.body;
    const comments = commentsByPostId[req.params.id] || [];
    const comment = { id: randomId, content };
    comments.push(comment);
    commentsByPostId[req.params.id] = comments;
    res.status(201).send("id & comment: "  + randomId + " : " + content);
});

// LISTEN
app.listen(port, () => {console.log('Listening on port '+ port);});


// curl -X  POST -H "Content-Type: application/json" -d '{ "content": "Commenting with my FIST."}' http://localhost:4001/posts/someid/comments/
// curl  http://localhost:4001/posts/someid/comments/