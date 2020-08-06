const express = require('express');
const axios = require('axios');
const parser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(parser.json());
app.use(cors());

const queryPort = 4002;
const path= 'events';

// provides full list of posts and comments
app.get(path, (req, res) => {});

// event bus communication
app.post(path, (req, res) => {});

app.listen(queryPort, () => {
    console.log("Query server listening on " + queryPort);
});