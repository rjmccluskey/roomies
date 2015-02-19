var express = require('express');
var router = express.Router();
var rest = require('restler');


/* Show a house */
router.get('/:house_id', function(req,res) {
  if (req.session.venmo_id) {
    rest
      .get('http://localhost:3000/houses/' + req.param('house_id'))
      .on('complete', function(data) {
        var errors = data.errors;
        var users = data.users;
        var house = data.house;

        if (data.errors) {
          res.redirect('/');
        }
        else {
          for (var i = 0; i <= users.length; i++) {
            // this first if will only be true if the current user is not a member of the house
            if (i === users.length) {
              res.render('house', {house: house, users: users, not_a_member: true});
            }
            else if (users[i].venmo_id === req.session.venmo_id) {
              res.render('house', {house: house, users: users});
              break;
            }
          };
        }
      });
  }
  else {
    res.redirect('/')
  }
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
                'password_confirmation': password_confirmation
              }
      }
    )
    .on('complete', function(data) {
      if (data.errors) {
        req.flash('errors', data.errors);
        res.redirect('/');
      }
      else if (data.success) {
        req.flash('success', 'Created house: ' + name)
        res.redirect('/')
      }
    });
});

/* Join a house */
router.patch('/:house_id/join', function(req,res) {
  var house_id = req.param('house_id')

  rest.patch('http://localhost:3000/houses/' + house_id + '/join',
    {
      data: {
              'venmo_id': req.session.venmo_id,
              'password': req.param('password')
            }
    }
  )
  .on('complete', function(data) {
    if (data.errors) {
      req.flash('errors', data.errors)
      res.redirect('/houses/' + house_id)
    }
    else if (data.success) {
      res.redirect('/houses/' + house_id)
    }
  });
});

module.exports = router;