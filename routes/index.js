var express = require('express'),
    router = express.Router(),
    path = require('path'),
    tweetBank = require('../tweetBank')

module.exports = function (io, client) {

  router.get('/', function (req, res) {
    client.query('SELECT tweets.id, tweets.content, users.name, users.pictureurl FROM Tweets JOIN users ON users.id = Tweets.userid', function (err, result) {
      var tweets = result.rows;
      res.render('index', { title: 'All Tweets', tweets: tweets, showForm: true })
    })
  })

  router.get('/users/:name', function (req, res) {
    client.query('SELECT tweets.content, users.name, users.pictureurl, tweets.id FROM tweets JOIN users on users.id = tweets.userid WHERE name=$1', [req.params.name], function (err, result) {
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

  router.get('/tweets/:id', function (req, res) {
    var id = +req.params.id
        client.query('SELECT tweets.content, users.name, users.pictureurl, tweets.id FROM tweets JOIN users on users.id = tweets.userid WHERE tweets.id=$1', [id], function(err, result){
          var tweets = result.rows;
          res.render('index', { title: 'Tweet', tweets: tweets  })
        })    
        
  })

  router.post('/tweets', function (req, res) {
      var name = req.body.name,
        text = req.body.text
    client.query('SELECT * FROM users WHERE name=$1', [name], function (err, result) {
      var user = result.rows;
      if (user.length === 0) {
        client.query('INSERT INTO users (name, pictureurl) VALUES ($1, $2)', [name, 'http://placehold.it/200x200'], function (err, result) {
        }) 
      }
      client.query('SELECT * FROM users WHERE name=$1', [name], function (err, result) {
        var user = result.rows[0];
        client.query('INSERT INTO tweets (userId, content) VALUES ($1, $2)', [user.id, text], function (err, result) {
          // io.sockets.emit('new_tweet', )
          res.redirect('/')
        })
      })
    })
    
  })

  return router

}
