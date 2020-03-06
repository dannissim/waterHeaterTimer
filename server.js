const express = require('express');
const path = require('path');
// const bodyParser = require('body-parser');
const moment = require('moment')
// const { protectedRoutes } = require('./config')

const app = express();

// Static folder
app.use(express.static(path.join(__dirname, 'build'), { index: false }));

const server = require('http').createServer(app)

// 3rd party middleware

app.use(require('express-basic-auth')({
    users: { 'admin': '8888' },
    challenge: true
}))
app.use(require('helmet')()) // security middleware
app.use(require('compression')()) // zips outgoing requests- better performance 
app.use(express.json())
// // should add middleware which stops from too many requests from same ip
// app.use(require('cookie-session')({
//     name: 'k1ikSession',
//     secret: process.env.SESSION_SECRET,
//     maxAge: 2628000000, // one month, time in ms
//     sameSite: 'lax',
//     // signed: true, // default is true
//     // httpOnly: false, // default is true
//     // secure: false, // default is true for https
//     // signed: false
//     // domain: CLIENT_ORIGIN, // doesn't work with this option
// }))
// app.use(require('cookie-parser')())
// app.use(require('csurf')()) // csrf protection
// app.use(bodyParser.json()); // support json encoded bodies
// app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
const io = require('socket.io')(server, { cookie: false }) // disable unused io cookie

var status = false

// API Routes
// should enforce single check per request - later

app.get('/api/toggleStatus', (req, res) => {
    status = !status
    io.emit('newStatus', status)
    res.end()
    // call python script
})

app.get('/api/status', (req, res) => {
    res.send(status)
})

//All other routes - React app
app.get('*', (req, res) => {
    // req.session.failedUrl = ''
    // res.cookie('XSRF-TOKEN', req.csrfToken())
    res.sendFile(path.join(__dirname + '/build/index.html'))
});

server.listen(process.env.PORT || 5000, () => {
    console.log('listening...')
})