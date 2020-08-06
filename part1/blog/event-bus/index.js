//import React from 'react';
//import parser from 'body-parser';
const express = require('express');

const parser = require('body-parser');

const axios = require('axios');

const app = express();

app.use(parser.json());

const servicePorts = [4000, 4001, 4002];
const busPort = 4005;

app.post('/events', (req, res) => {

    const event = req.body;

    for (port in servicePorts) {
        axios.post(`http://localhost:${port}/events`, event);
    }
    res.send({status: 'OK'});
});

app.listen(busPort, () => {
    console.log("Listening on port " + busPort);
});