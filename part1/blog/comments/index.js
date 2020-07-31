const express = require('express');

const parser = require('body-parser');

const { random } = require('crypto');

const app = express();

const port = 4001;
const path = '/posts/:id/comments';

const commentsByPostId = {};

app.use(parser.json());

// GET
app.get(path, (req, res) => {
    const comments = commentsByPostId[req.params.id] || [];
    res.status(200).send(comments);
});

// POST
app.post(path, (req, res) => {
    const randomId = random(4).toString('hex');
    const { content } = req.body;
    const comments = commentsByPostId[req.params.id] || [];
    const comment = { id: randomId, content };
    comments.push(comment);
    res.status(201).send(randomId + comment);
});

// LISTEN
app.listen(port, () => {console.log('Listening on port '+ port);});


// curl -X  POST -H "Content-Type: application/json" -d '{ "title": "Fist poster"}' http://localhost:4001/posts/someid/comments/
// curl  http://localhost:4001/posts/someid/comments/