var express = require('express');
var router = express.Router();
var rest = require('restler');
var routeHelper = require('../helpers/routeHelper');
var clientId = process.env.ROOMIES_CLIENT_ID;
var apiURI = process.env.API_URI || 'http://localhost:3000';
var token = process.env.ROOMIES_SECRET;

router.get('/', function(req, res) {
  var venmo_id = req.session.venmo_id

  if (venmo_id) {
    res.render('index');
  }
  else {
    res.render('splash', { title: 'Roomies', oauth_url: 'https://api.venmo.com/v1/oauth/authorize?client_id=' + clientId + '&scope=make_payments%20access_profile%20access_email%20access_phone&response_type=code' });
  }
});

routeHelper.get(router, '/search', ['search'], 'users');

router.get('/logout', function(req, res) {
  req.session.venmo_id = '';
  res.redirect('/');
});

/* hit api to wake up heroku */
router.get('/wakeup', function(req, res) {
  rest
    .get(apiURI + '/wakeup', {
      data: {token: token}
    })
    .on('complete', function(data) {
      res.json(data);
    });
});

module.exports = router;
