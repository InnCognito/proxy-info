require('newrelic');
const express = require('express');
const proxy = require('http-proxy-middleware');
const axios = require('axios');

const app = express();

const dirPath = `${__dirname}/../public/dist/`;
app.use(express.static(dirPath));

const { routes } = require('../proxyconfig.json');

app.get('/api/:component/:id', (req, res) => {
  axios.get(`${routes[req.params.component].address}/${req.params.id}`)
  .then(data => res.send(data.data))
  .catch(err => {
      console.log('ERROR RETRIEVING INFORMATION', err);
      res.send(err);
  })
});

app.listen(3000, () => console.log('Listening on port: 3000'));
