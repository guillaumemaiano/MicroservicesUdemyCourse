const express = require('express');
const axios = require('axios');
const parser = require('body-parser');
const cors = require('cors');
//import Moderator from './GeneratedJS/Moderator'
const moderator = require('./GeneratedJS/Moderator');

const moderationPort = (() => {
    const arguments = process.argv;
    var customPort;
    if (arguments.some(function (val, index, arguments) {
        if (val === 'port') {
            customPort = arguments[index+1];
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
    const arguments = process.argv;
    return arguments.some(function (val, index, arguments) {
        console.log(index + ': ' + val);
        if (val === 'verbose') {
            console.log("Talkative mode engaged. How do you do?")
            return true;
        }
    });
    }
)();

const pathToPosts='/moderation';
const pathToEvents= '/events';

const app = express();

app.use(parser.json());
app.use(cors());

app.get('/moderation', (req, res) => {

    res.send(500);
});

// Event bus communication
app.post(pathToEvents, (req, res) => {
    if (verbose) {
        console.log("Received event: " + req.body.type);
    }
    // Note: there are now event types all over the place
    // What's the best practice, create an enum in the event-bus?
    if (req.body.type === 'CommentCreated') {
        // Prepare for moderation
        console.log("We should moderate comment " + req.body.id);
    }

    res.send({});
});

app.listen(moderationPort, () => {
    if (verbose === true) {
        console.log("Listening on " + moderationPort);
    }
});