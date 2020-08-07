const express = require('express');

const parser = require('body-parser');

const axios = require('axios');

const cors = require('cors');

const { randomBytes } = require('crypto');

const app = express();
app.use(parser.json());

app.use(cors());

var portNumber = 4000;
var eventbusPortNumber = 4005;

const posts = {};

// GET
app.get('/posts', (req, res) => {
    res.send(posts);
}
);

// POST
app.post('/posts', async (req, res
    ) => {
        // not collision safe
    const randomId = randomBytes(4).toString('hex');
    const { title } = req.body;

    posts[randomId] = {
        randomId, title
    };

    await axios.post(`http://localhost:${eventbusPortNumber}/events`, { type: 'PostCreated', data: posts[randomId]});
    res.status(201).send(posts[randomId]);
}
);

// Event bus communication
app.post('/events', (req, res) => {
    console.log("Received event: " + req.body.type);
    res.send({});
});

app.listen(portNumber, () => {
    console.log('Listening on '+ portNumber);
}
);

// curl -X  POST -H "Content-Type: application/json" -d '{ "title": "Fist poster"}' http://localhost:4000/posts
// curl http://localhost:4000/posts