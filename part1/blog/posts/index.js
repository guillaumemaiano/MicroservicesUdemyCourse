const express = require('express');

const parser = require('body-parser');

const { randomBytes } = require('crypto');

const app = express();
app.use(parser.json());

var portNumber = 4000;

const posts = {};

// GET
app.get('/posts', (req, res
) => {
    res.send(posts);
}
);

// POST
app.post('/posts', (req, res
    ) => {
        // not collision safe
    const randomId = randomBytes(4).toString('hex');
    const { title } = req.body;

    posts[randomId] = {
        randomId, title
    };
    res.status(201).send(posts[randomId]);
}
);

app.listen(portNumber, () => {
    console.log('Listening on '+ portNumber);
}
);

// curl -X  POST -H "Content-Type: application/json" -d '{ "title": "Fist poster"}' http://localhost:4000/posts
// curl http://localhost:4000/posts