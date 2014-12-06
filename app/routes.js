var User = require('./models/user');

module.exports = function(app) {

// api ---------------------------------------------------------------------
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

// application -------------------------------------------------------------
app.get('*', function(req, res) {
  res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});
};
