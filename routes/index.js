var express = require('express'),
    router = express.Router(),
    path = require('path'),
    tweetBank = require('../tweetBank')

router.get('/', function (req, res) {
  var tweets = tweetBank.list()
  res.render('index', { title: 'All Tweets', tweets: tweets, showForm: true })
})

router.get('/users/:name', function (req, res) {
  var name = req.params.name,
      tweets = tweetBank.find({ name: name })
  res.render('index', { title: 'Posts by ' + name, name: name, tweets: tweets, showForm: true })
})

router.get('/tweets/:id', function (req, res) {
  var id = +req.params.id,
      tweets = tweetBank.find({ id: id })
  res.render('index', { title: 'Tweet: ' + id, tweets: tweets  })
})

router.post('/tweets', function (req, res) {
  var name = req.body.name,
      text = req.body.text
  tweetBank.add(name, text)
  res.redirect('/')
})

module.exports = router
