var express = require('express');
var router = express.Router();
var rest = require('restler');
var token = process.env.ROOMIES_SECRET;
var apiURI = process.env.API_URI || 'http://localhost:3000';
var routeHelper = require('../helpers/routeHelper');

router.get('/venmo_oauth', function(req, res) {
  var code = req.query.code;

  if (code) {
    rest
      .post(apiURI + '/users', {
          data: {'code': code, 'token': token}
      })
      .on('complete', function(data) {
        if (data.error) {
          res.redirect('/');
        }
        else {
          req.session.venmo_id = data.user.venmo_id;
          res.redirect('/');
        }
      });
  }
  else {
    res.redirect('/');
  };
});

router.get('/', function(req,res) {
  var venmo_id = req.session.venmo_id;

  if (venmo_id) {
    rest
      .get(apiURI + '/users/' + venmo_id, {
        data: {'token': token}
      })
      .on('complete', function(data) {
        if (data.error) {
          res.redirect('/')
        }
        else {
          res.json(data);
        }
      });
  }
  else {
    res.redirect('/');
  }
});

module.exports = router;
