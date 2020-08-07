const express = require('express');
const axios = require('axios');
const parser = require('body-parser');
const cors = require('cors');

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

app.listen(moderationPort, () => {
    if (verbose === true) {
        console.log("Listening on " + moderationPort);
    } else {
        console.log("eeeeee");
    }
});