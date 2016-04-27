var express = require('express'),
    app = express(),
    socketio = require('socket.io'),
    swig = require('swig'),
    routes = require('./routes'),
    bodyParser = require('body-parser'),
    port = 3000

// use Swig for view templates, with html files, using views from views folder
app.engine('html', swig.renderFile)
app.set('views', __dirname + '/views')
app.set('view engine', 'html')

// disables saving of rendered unchanged documents
swig.setDefaults({ cache: false })

// serve public folder
app.use(express.static('public'))

// parse the request body
app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

// log request method, path and response status code
app.use(function (req, res, next) {
  console.log(req.method, req.path, res.statusCode)
  next()
})

// start express server
var server = app.listen(port, function () {
  console.log('Server listening on', port)
})

// launching Socket.io to listen to our server
var io = socketio.listen(server)

app.use('/', routes(io))
