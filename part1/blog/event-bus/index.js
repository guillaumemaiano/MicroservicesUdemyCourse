//import React from 'react';
//import parser from 'body-parser';
const express = require('express');

const parser = require('body-parser');

const axios = require('axios');

const app = express();

app.use(parser.json());

const servicePorts = [4000, 4001, 4002, 4003];
const busPort = 4005;

app.post('/events', (req, res) => {

    const event = req.body;
    
    servicePorts.forEach((port) => {
        axios.post(`http://localhost:${port}/events`, event);
        console.log(`posted on ${port}`);
    });
    // Note to self: this is not valid JavaScript, you dumb Swift programmer!
    // for (const port in servicePorts) {
    //  axios.post(`http://localhost:${port}/events`, event);
    //  console.log(`posted on ${port}`);
    // }
    res.send({status: 'OK'});
});

app.listen(busPort, () => {
    console.log("Listening on port " + busPort);
});