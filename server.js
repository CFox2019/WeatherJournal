// POST: curl -H "Content-Type: application/json" -d '{"zip": "30019", "feelings": "happy"}' localhost:3000/journal
// GET: curl localhost:3000/journal

projectData = [];

const express = require('express');
const app = express();
const fetch = require('node-fetch');

/* Dependencies */
const bodyParser = require('body-parser')

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

const port = 3000;

const server = app.listen(port, ()=>{console.log(`running on localhost:${port}`)})

const openWeatherMapApiKey = "08a5357a79e5e1e6bf484328b9fe0360";
const openWeatherDataApiUrl = "https://api.openweathermap.org/data/2.5/weather";

app.post('/journal', async (req, res) => {
    const { zip, feelings } = req.body;
    const weatherRes = await fetch(`${openWeatherDataApiUrl}?zip=${zip},us&appid=${openWeatherMapApiKey}&units=imperial`)
    const weatherJson = await weatherRes.json();
    const temp = weatherJson.main.temp
    console.log("temp", temp);
    const data = {
        zip: zip,
        temp: temp,
        feelings: feelings,
        date: new Date().toISOString()
    }
    projectData.push(data);
    res.status(201).send(data);
})

app.get('/journal', async (req, res) => {
    res.send(projectData);
})

app.get('/journal/latest', async (req, res) => {
    // get latest journal entry, if empty, fallback to empty object default
    const latest = projectData[projectData.length-1] || {};
    res.send(latest);
})