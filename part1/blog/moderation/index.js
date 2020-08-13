const express = require('express');
const axios = require('axios');
const parser = require('body-parser');
const cors = require('cors');
const { createNoSubstitutionTemplateLiteral } = require('typescript');
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



/**
 * TypeScript code is not within my skills to call y, so I'll build that in JS inline for now
 * 
 * enum ModerationStatus {
    Pending = 'pending',
    Rejected = 'rejected',
    Approved = 'approved'
    }
    export class Moderator {

    private filteredWords = ['orange'];

    constructor(filter: string[]) {
        if (filter.isArray() && filter.length) {
            this.filteredWords = filter;
        }
    }

    private filterVocabulary = function(unfilteredText: string): Boolean {

        return this.filteredWords.some( (e) =>
         unfilteredText.includes(e)
        );
    }
   
    moderate = function(comment: string) : ModerationStatus {
        if (this.filterVocabulary(comment)) {
            return ModerationStatus.Rejected;
        } else {
            return ModerationStatus.Approved;
        }
    }
}
*/

const pending = 0;
const approved = 1;
const rejected = 2;

const moderationStatus = (status) => { 
    switch (status) {
    case pending:
        return "pending";
        break;
    case approved:
        return "approved";
        break;
    case rejected:
        return "rejected";
        break;
    default:
        return "FAIL";
    }
};

const moderation = (comment, filteredWords = ["orange", "cock"]) => {

    if (verbose) {
        console.log("Moderating comment: ", comment);
    }
    const filterVocabulary = (unfilteredText) => { 
        return filteredWords.some( e => unfilteredText.includes(e) );
    };
    
    if (filterVocabulary(comment)) {
        return moderationStatus(0);
    } else {
        return moderationStatus(1);
    }
};

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
        const status = moderation(req.body.data.content);
        await axios.post(`http://localhost:${eventbusPort}/events`, {type: 'CommentModerated', data: {commentId: req.body.data.id, postId: req.body.data.postId, content: req.body.data.content, status: status}});
    }

    res.send({});
});

app.listen(moderationPort, () => {
    if (verbose === true) {
        console.log("Listening on " + moderationPort);
    }
});