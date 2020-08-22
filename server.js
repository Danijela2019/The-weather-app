const express = require('express');
const fetch = require('node-fetch');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = 3000;
const apiKey = process.env.API_KEY;

app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

function fetchCoordinates(lat, lon, response) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  fetch(url)
    .then((res) => res.json())
    .then((coordData) => {
      response.render('nearby',
        {
          temp: Math.round(coordData.main.temp),
          name: coordData.name,
          weather: coordData.weather[0].main,
          icon: `http://openweathermap.org/img/wn/${coordData.weather[0].icon}@2x.png`,
          country: coordData.sys.country,
        });
    })
    .catch((error) => {
      console.log('Fetch coordinates error', error);
    });
}
function fetchCity(city, response) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  fetch(url)
    .then((res) => res.json())
    .then((cityData) => {
      response.render('citypage',
        {
          temp: Math.round(cityData.main.temp),
          name: cityData.name,
          weather: cityData.weather[0].main,
          icon: `http://openweathermap.org/img/wn/${cityData.weather[0].icon}@2x.png`,
          country: cityData.sys.country,
        });
    })
    .catch((error) => {
      console.log('Fetch citydata error:', error);
    });
}

app.get('/', (request, response) => {
  response.render('homepage');
});

app.get('/nearby', (request, response) => {
  const { lat } = request.query;
  const { lon } = request.query;
  fetchCoordinates(lat, lon, response);
});

app.post('/nearby/city', (request, response) => {
  const inputVal = request.body.cityname;
  fetchCity(inputVal, response);
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
