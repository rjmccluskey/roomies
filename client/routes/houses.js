var express = require('express');
var router = express.Router();
var rest = require('restler');
var token = process.env.ROOMIES_SECRET;

/* Show a house */
router.get('/:house_id', function(req,res) {
  if (req.session.venmo_id) {
    rest
      .get('http://localhost:3000/houses/' + req.param('house_id'), {
        data: {'token': token}
      })
      .on('complete', function(data) {
        var errors = data.errors;
        var users = data.house.users;
        var house = data.house;

        if (data.errors) {
          res.json({errors: errors});
        }
        else {
          for (var i = 0; i <= users.length; i++) {
            // this first if will only be true if the current user is not a member of the house
            if (i === users.length) {
              res.render('house', {house: data.house, not_a_member: true});
            }
            else if (users[i].venmo_id === req.session.venmo_id) {
              res.json(data);
              break;
            }
          }
        }
      });
  }
  else {
    res.redirect('/')
  }
});

router.get('/:house_id/expenses', function(req, res) {
  rest
    .get('http://localhost:3000/houses/' + req.param('house_id') + '/expenses', {
      data: {'token': token}
    })
    .on('complete', function(data) {
      res.json(data);
    });
});

/* Create new house */
router.post('/', function(req,res) {
  var venmo_id = req.session.venmo_id;
  var name = req.param('name');
  var password = req.param('password');
  var password_confirmation = req.param('password_confirmation');

  rest
    .post('http://localhost:3000/houses',
      {
        data: {
                'venmo_id': venmo_id,
                'name': name,
                'password': password,
                'password_confirmation': password_confirmation,
                'token': token
              }
      }
    )
    .on('complete', function(data) {
      res.json(data);
    });
});

/* Join a house */
router.post('/:house_id/join', function(req,res) {
  var house_id = req.param('house_id')

  rest.post('http://localhost:3000/houses/' + house_id + '/join',
    {
      data: {
              'venmo_id': req.session.venmo_id,
              'password': req.param('password'),
              'token': token
            }
    }
  )
  .on('complete', function(data) {
    res.json(data);
  });
});

router.post('/:house_id/expenses', function(req,res) {
  var house_id = req.param('house_id');

  rest.post('http://localhost:3000/houses/' + house_id + '/expenses', {
    data: {
            'venmo_id': req.session.venmo_id,
            'amount_string': req.param('amount_string'),
            'note': req.param('note'),
            'token': token
          }
  })
  .on('complete', function(data) {
    res.json(data);
  });
});

module.exports = router;