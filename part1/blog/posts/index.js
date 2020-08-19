const express = require('express');

const parser = require('body-parser');

const axios = require('axios');

const cors = require('cors');

const { randomBytes } = require('crypto');

const app = express();
app.use(parser.json());

app.use(cors());

var portNumber = 4000;

const eventbusPort = (() => {
    const argumentsFromCL = process.argv;
    var customPort;
    if (argumentsFromCL.some(function (val, index, args) {
        if (val === 'eventbus') {
            customPort = args[index+1];
            return true;
        }
    })) {
        console.log(`Custom event bus port detected: ${customPort}`);
        return customPort;
    } else {
        return 4005;
    }
    }
)();

const eventbusSrv = (() => {
    const argumentsFromCL = process.argv;
    var customPort;
    if (argumentsFromCL.some(function (val, index, args) {
        if (val === 'eventbusService') {
            customPort = args[index+1];
            return true;
        }
    })) {
        console.log(`Custom event bus service detected: ${eventbusSrv}`);
        return customPort;
    } else {
        return "localhost";
    }
    }
)();

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

    await axios.post(`http://${eventbusSrv}:${eventbusPort}/events`, { type: 'PostCreated', data: posts[randomId]});
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