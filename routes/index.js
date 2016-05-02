var express = require('express'),
  router = express.Router(),
  path = require('path'),
  Promise = require('bluebird')

module.exports = function(io, client) {

  function clientQuery (query, array) {
    return new Promise (function (resolve, reject) {
      client.query(query, array, function (err, result) {
        if (err) reject(err)
        else resolve(result)
      })
    })
  }

  router.get('/', function(req, res) {
    clientQuery('SELECT tweets.id, tweets.content, users.name, users.pictureurl FROM Tweets JOIN users ON users.id = Tweets.userid')
    .then(function (result) {
      var tweets = result.rows
      res.render('index', { title: 'All Tweets', tweets: tweets, showForm: true })
    })
  })

  router.get('/users/:name', function(req, res) {
    clientQuery('SELECT tweets.content, users.name, users.pictureurl, tweets.id FROM tweets JOIN users on users.id = tweets.userid WHERE name=$1', [req.params.name])
    .then(function (result) {
      var tweets = result.rows;
      var name = tweets[0].name;
      res.render('index', {
        title: 'Posts by ' + name,
        name: name,
        tweets: tweets,
        showForm: true
      })
    })
  })

  router.get('/tweets/:id', function(req, res) {
    var id = +req.params.id
    clientQuery('SELECT tweets.content, users.name, users.pictureurl, tweets.id FROM tweets JOIN users on users.id = tweets.userid WHERE tweets.id=$1', [id])
    .then(function (result) {
      var tweets = result.rows;
      res.render('index', { title: 'Tweet', tweets: tweets })
    })
  })

  router.delete('/tweets/:id', function(req, res) {
    var id = +req.params.id
    clientQuery('', [id])
    .then(function () {
      res.redirect('/')
    })
  })

  router.post('/tweets', function(req, res) {
    var name = req.body.name.trim(),
        text = req.body.text
    clientQuery('SELECT * FROM users WHERE name=$1', [name])
    .then(function (result) {
      var user = result.rows;
      if (user.length === 0) {
        clientQuery('INSERT INTO users (name, pictureurl) VALUES ($1, $2)', [name, 'http://placehold.it/200x200'])
        .then(function () {
          clientQuery('SELECT * FROM users WHERE name=$1', [name])
          .then(function (result) {
            var user = result.rows[0]
            clientQuery('INSERT INTO tweets (userId, content) VALUES ($1, $2)', [user.id, text])
            .then(function () {
              // io.sockets.emit('new_tweet', )
              res.redirect('/')
            })
          })
        })
      } else {
        clientQuery('SELECT * FROM users WHERE name=$1', [name])
        .then(function (result) {
          var user = result.rows[0];
          clientQuery('INSERT INTO tweets (userId, content) VALUES ($1, $2)', [user.id, text])
          .then(function () {
            // io.sockets.emit('new_tweet', )
            res.redirect('/')
          })
        })
      }
    })
  })

  return router

}
