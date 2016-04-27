var express = require('express'),
    router = express.Router(),
    path = require('path'),
    tweetBank = require('../tweetBank')

router.get('/', function (req, res) {
  var tweets = tweetBank.list()
  res.render('index', { title: 'Twitter.js', tweets: tweets })
})

module.exports = router
