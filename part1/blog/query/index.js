const express = require('express');
const axios = require('axios');
const parser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(parser.json());
app.use(cors());

const queryPort = 4002;
const pathToPosts='/posts';
const pathToEvents= '/events';

const posts = [];

// provides full list of posts and comments
app.get(pathToPosts, (req, res) => {
    
    res.send({status: 'OK', data: posts});
});

// event bus communication
app.post(pathToEvents, (req, res) => {
    //switch req.body.type 

});

app.listen(queryPort, () => {
    console.log("Query server listening on " + queryPort);
});