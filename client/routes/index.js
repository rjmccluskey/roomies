var express = require('express');
var router = express.Router();
var routeHelper = require('../helpers/routeHelper');
var clientId = process.env.ROOMIES_CLIENT_ID

router.get('/', function(req, res) {
  var venmo_id = req.session.venmo_id

  if (venmo_id) {
    res.render('index');
  }
  else {
    res.render('splash', { title: 'Roomies', oauth_url: 'https://api.venmo.com/v1/oauth/authorize?client_id=' + clientId + '&scope=make_payments%20access_profile%20access_email%20access_phone&response_type=code' });
  }
});

// router.get('/search', function(req,res) {
//   if (req.session.venmo_id) {
//     rest
//       .get('http://localhost:3000/users/search', {
//         data: {search: req.param('search'), 'token': token}
//       })
//       .on('complete', function(data) {
//         res.json(data);
//       });
//   }
//   else {
//     res.redirect('/')
//   }
// });

routeHelper.get(router, '/search', ['search'], 'users');

router.get('/logout', function(req, res) {
  req.session.venmo_id = '';
  res.redirect('/');
});

module.exports = router;
