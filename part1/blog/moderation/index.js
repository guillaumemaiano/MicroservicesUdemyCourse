const express = require('express');
const axios = require('axios');
const parser = require('body-parser');
const cors = require('cors');
//const Moderator = require('./GeneratedJS/Moderator');
//import { Moderator } from './GeneratedJS/Moderator.js';
//import * as Moderator from './GeneratedJS/Moderator.js';

const moderationPort = (() => {
    const argumentsFromCL = process.argv;
    var customPort;
    if (argumentsFromCL.some(function (val, index, args) {
        if (val === 'port') {
            customPort = args[index+1];
            return true;
        }
    })) {
        console.log(`Custom port detected: ${customPort}`);
        return customPort;
    } else {
        return 4003;
    }
    }
)();

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

const pathToEvents= '/events';

//const moderation = Moderator();

const app = express();

app.use(parser.json());
app.use(cors());

// Event bus communication
app.post(pathToEvents, async (req, res) => {
    if (verbose) {
        console.log("Received event: " + req.body.type);
    }
    // Note: there are now event types all over the place
    // What's the best practice, create an enum in the event-bus?
    if (req.body.type === 'CommentCreated') {
        const status = moderation.moderate(req.body.content);
        await axios.post(`http://localhost:${eventbusPort}/events`, {type: 'CommentModerated', data: {id: req.body.id, postId: req.body.postId, content: req.body.content, status: status}});
    }

    res.send({});
});

app.listen(moderationPort, () => {
    if (verbose === true) {
        console.log("Listening on " + moderationPort);
    }
});