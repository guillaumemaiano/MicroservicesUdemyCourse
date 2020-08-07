const express = require('express');
const axios = require('axios');
const parser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(parser.json());
app.use(cors());

const queryPort = 4002;
const eventbusPort = 4005;
const pathToPosts='/posts';
const pathToEvents= '/events';

// not likely the most efficient structure in any way except quick coding
const posts = [];
const comments = [];

// provides full list of posts and comments
app.get(pathToPosts, (req, res) => {
    
    res.send({status: 'OK', data: {"posts": posts, "comments": comments}});
});

// event bus communication
app.post(pathToEvents, (req, res) => {
    switch (req.body.type) {
        case 'CommentCreated':
            console.log('Comment Creation detected.');
            posts.push({id: req.body.data.randomId, content: req.body.data.content});   
            break;
        case 'PostCreated':
            console.log('Post Creation detected.');
            posts.push({id: req.body.data.randomId, content: req.body.data.content});          
            break;
        default:
            console.log('Type unknown, event bus format change unimplemented: ' + req.body.type);
    }

});

app.listen(queryPort, () => {
    console.log("Query server listening on " + queryPort);
});