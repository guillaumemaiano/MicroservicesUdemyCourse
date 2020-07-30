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

    posts[id] = {
        id, title
    };
    res.status(201).send(posts[id]);
}
);

app.listen(portNumber, () => {
    console.log('Listening on '+ portNumber);
}
);