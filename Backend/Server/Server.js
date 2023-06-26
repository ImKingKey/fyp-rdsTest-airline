require('dotenv').config();
const serveStatic = require('serve-static')
const app = require('./Controller/App.js')

const port = 8081

app.use(serveStatic(__dirname + "/Server"))

app.use(serveStatic(__dirname + '/public'))

app.listen(port, function () {

    console.log('Web App Hosted at http://localhost:%s', port)

})