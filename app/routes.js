var User = require('./models/user');
var Tag = require('./models/tag');

module.exports = function(app, passport) {

  // api ===================================================================

  // Users -----------------------------------------------------------------

  // get all todos
  app.get('/api/user', function(req, res) {

    // use mongoose to get all todos in the database
    User.find(function(err, user) {

      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err)
        res.send(err);

      res.json(user); // return all user in JSON format
    });
  });

  // create todo and send back all user after creation
  app.post('/api/user', function(req, res) {

    // create a todo, information comes from AJAX request from Angular
    User.create({
      username: req.body.username,
      password: req.body.password,
      peerID: req.body.peerID,
      done: false
    }, function(err, todo) {
      if (err)
        res.send(err);

      // get and return all the user after you create another
      User.find(function(err, user) {
        if (err)
          res.send(err);
        res.json(user);
      });
    });

  });

  // delete a todo
  app.delete('/api/user/:user_id', function(req, res) {
    User.remove({
      _id: req.params.todo_id
    }, function(err, todo) {
      if (err)
        res.send(err);

      // get and return all the user after you create another
      User.find(function(err, users) {
        if (err)
          res.send(err);
        res.json(users);
      });
    });
  });

  // update peerID
  app.put('/api/user/:username/:peer_id', function(req, res) {
    var query = User.where({
      username: req.params.username
    });
    query.findOne(function(err, user) {
      // if there are any errors, return the error
      if (err)
        res.send(err);

      user.peerID = req.params.peer_id;
      user.save(function(err) {
        if (err)
          res.send(err);

        res.json({
          message: 'User updated!'
        });
      });
      // check to see if theres already a user with that email

    });
  });

  // get peerID from username
  app.get('/api/user/:username', function(req, res) {
    var query = User.where({
      username: req.params.username
    });
    query.findOne(function(err, user) {
      // if there are any errors, return the error
      if (err)
        res.send(err);
      res.send(user.peerID);

    });
  });

  // get username from peerID
  app.get('/api/ID/:peerID', function(req, res) {
    var query = User.where({
      peerID: req.params.peerID
    });
    query.findOne(function(err, user) {
      // if there are any errors, return the error
      if (err)
        res.send(err);
      res.send(user.username);

    });
  });

  // Tags -------------------------------------------------------------------

  // get all tags
  app.get('/api/tag', function(req, res) {

    // use mongoose to get all todos in the database
    Tag.find(function(err, tag) {

      // if there is an error retrieving, send the error. nothing after res.send(err) will execute
      if (err)
        res.send(err);

      res.json(tag); // return all user in JSON format
    });
  });

  // get ids from tag
  app.get('/api/tag/:tag', function(req, res) {

    var query = Tag.where({
      tag: req.params.tag
    });
    query.findOne(function(err, tag) {
      // if there are any errors, return the error
      if (err)
        res.send(err);

        
      res.json({
        message: tag.peerIDs
      });

          // check to see if theres already a user with that email

        });
    });

  // Create tag
  app.post('/api/tag/:tag', function(req, res) {

    // create a todo, information comes from AJAX request from Angular
    Tag.create({
      tag: req.params.tag,
      done: false
    }, function(err, tag) {
      if (err)
        res.send(err);

      // get and return all the user after you create another
      Tag.find(function(err, tag) {
        if (err)
          res.send(err);
        res.json(tag);
      });
    });

  });

  // add peerID to tag
  app.put('/api/tag/:tag/:peer_id', function(req, res) {
    var query = Tag.where({
      tag: req.params.tag
    });
    query.findOne(function(err, tag) {
      // if there are any errors, return the error
      if (err)
        res.send(err);

      tag.peerIDs.push(req.params.peer_id);
      tag.save(function(err) {
        if (err)
          res.send(err);

        res.json({
          message: 'peerID added!'
        });
      });
      // check to see if theres already a user with that email

    });
  });

  // remove peerID from tag
  app.delete('/api/tag/:tag/:peer_id', function(req, res) {
    var query = Tag.where({
      tag: req.params.tag
    });
    query.findOne(function(err, tag) {
      // if there are any errors, return the error
      if (err)
        res.send(err);

      var index = tag.peerIDs.indexOf(req.params.peer_id);
      if (index > -1) {
        tag.peerIDs.splice(index, 1);
        tag.save(function(err) {
          if (err)
            res.send(err);

          res.json({
            message: 'peerID removed!'
          });
        });
      } else {
        res.json({
          message: 'peerID does not exist'
        });
      }

    });
  });

  // delete a tag
  app.delete('/api/tag/:tag_id', function(req, res) {
    Tag.remove({
      _id: req.params.tag_id
    }, function(err, tag) {
      if (err)
        res.send(err);

      // get and return all the user after you create another
      Tag.find(function(err, tags) {
        if (err)
          res.send(err);
        res.json(tags);
      });
    });
  });

  // End API =================================================================


  // application -------------------------------------------------------------

  app.get('/login', function(req, res) {
    res.sendfile('./public/login.html'); // load the single view file (angular will handle the page changes on the front-end)
  });

  app.get('/register', function(req, res) {
    res.sendfile('./public/register.html'); // load the single view file (angular will handle the page changes on the front-end)
  });

  app.get('/', isLoggedIn, function(req, res) {
    res.sendfile('./public/app.html', {
      user: req.user
    }); // load the single view file (angular will handle the page changes on the front-end)
  });

  app.get('/logout', function(req, res) {
    req.logOut();
    res.redirect('/login');
  });

  app.post('/register', passport.authenticate('local-signup', {
    successRedirect: '/',

    failureRedirect: '/register',

    failureFlash: true
  }));

  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/',

    failureRedirect: '/login',

    failureFlash: true
  }));

};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/login');
}
