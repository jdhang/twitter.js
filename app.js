var express = require('express'),
    app = express(),
    swig = require('swig'),
    routes = require('./routes'),
    port = 3000

// use Swig for view templates, with html files, using views from views folder
app.engine('html', swig.renderFile)
app.set('views', __dirname + '/views')
app.set('view engine', 'html')

// disables saving of rendered unchanged documents
swig.setDefaults({ cache: false })

// serve public folder
app.use(express.static('public'))

// log request method, path and response status code
app.use(function (req, res, next) {
  console.log(req.method, req.path, res.statusCode)
  next()
})

app.use('/', routes)

app.listen(port, function () {
  console.log('Server listening on', port)
})
