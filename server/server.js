require('newrelic');
const express = require('express');
const proxy = require('http-proxy-middleware');
const axios = require('axios');

const app = express();

const dirPath = `${__dirname}/../public/dist/`;
app.use(express.static(dirPath));

const { routes } = require('../proxyconfig.json');

app.get('/api/:id', (req, res) => {
  const moreHomesPromise = 
  axios.get(`${routes.moreHomes.address}/${req.params.id}`)
    .then(data => {
      console.log('RETRIEVED MOREHOMES DATA');
      return data.data;
    })
    .catch(err => {
        console.log('ERROR RETRIEVING MOREHOMES INFORMATION', err);
        return err;
  });

  const reviewsPromise = 
  axios.get(`${routes.reviews.address}/${req.params.id}`)
  .then(data => {
    console.log('RETRIEVED REVIEWS DATA');
    return data.data;
  })
  .catch(err => {
      console.log('ERROR RETRIEVING REVIEWS INFORMATION', err);
      return err;
  });

  const listingsPromise = 
  axios.get(`${routes.listings.address}/${req.params.id}`)
  .then(data => {
    console.log('RETRIEVED LISTINGS DATA');
    return data.data;
  })
  .catch(err => {
      console.log('ERROR RETRIEVING LISTINGS INFORMATION', err);
      return err;
  });

  Promise.all([moreHomesPromise, reviewsPromise, listingsPromise])
  .then((values) => { res.status(200).send(values) })
  .catch(error => { res.status(500).send(error) });

});

app.get('/api/:component/:id', (req, res) => {
  axios.get(`${routes[req.params.component].address}/${req.params.id}`)
  .then(data => res.send(data.data))
  .catch(err => {
      console.log('ERROR RETRIEVING INFORMATION', err);
      res.send(err);
  })
});

app.listen(3000, () => console.log('Listening on port: 3000'));
