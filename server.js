'use strict';

const express = require('express'); // express server library
const cors = require('cors'); // bad bodyguard that allows everyone in
const superagent = require('superagent');
const { json } = require('express');

// bring in the dotenv library
// the job of this library is to find the .env file and get the variables out of it so we can use them in our JS file
require('dotenv').config();

// this gives us a variable that we can use to run all the methods that are in the express library
const app = express();
app.use(cors());

// this lets us serve a website from a directory
app.use(express.static('./public'));
const { response } = require('express');

// the dotenv library lets us grab the PORT var from the .env using the magic words process.env.variableName
const PORT = process.env.PORT || 3001;
const weatherArray = [];


app.get('/location', locationHandler);

app.get('/weather', weatherHandler);


function locationHandler(request, response){
  let city = request.query.city;
  // let geoData = require('./data/location.json');
  let url = `https://us1.locationiq.com/v1/search.php`;

  let queryParams = {
    key: process.env.GEOCODE_API_KEY,
    q: city,
    format: 'json',
    limit: 1
  }

  superagent.get(url)
    .query(queryParams)
    .then(results => {
      let geoData = results.body;
      const obj = new Location(city, geoData);
      response.send(obj);
    })
    .catch((error) => {
      console.log('ERROR', error);
      response.status(500).send('Our bad. Wheels aren\'t spinning!');
    });
}

function weatherHandler(request, response){
  try{
    let weatherData = require('./data/weather.json');

    weatherData.data.map(weatherObj => {
      return new Weather(weatherObj);
    })
    // weatherData.data.forEach(weatherTime => {
    //   new Weather(weatherTime);
    // })
    response.send(weatherArray);
  }
  catch(error){
    console.log('ERROR', error);
    response.status(500).send('It\'s not you it\'s us, we messed up.');
  }
}
function Location(location, obj){
  this.search_query = location;
  this.formatted_query = obj[0].display_name;
  this.latitude = obj[0].lat;
  this.longitude = obj[0].lon;
}

function Weather(obj){
  this.time = new Date(obj.datetime).toDateString();
  this.forecast = obj.weather.description;
  weatherArray.push(this);
}

// app.get('/', function (request, response) {
//   response.send('Hello World');
// });

// app.get('/bananas', (request, response) => {
//   response.send('I am bananas about bananas');
// });
 
// turn on the server

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});