var express = require('express'),
    app = express(),
    port = 3000

app.get('/', function (req, res) {
  res.send('Success!')
})


app.listen(3000, function () {
  console.log('Server listening on', port)
})
