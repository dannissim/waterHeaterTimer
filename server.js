const express = require('express');
const path = require('path');
const app = express();
const { spawn } = require('child_process');
const moment = require('moment')

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
const io = require('socket.io')(server, { cookie: false }) // disable unused io cookie

var status = {
    isOn : false,
    timeToHeat : 60,
    timeLeft : 3600,
    lastTimeOn : null
}
var onFor = 0
var lastTimeOnFor = 0
var timeout = null

// API Routes
app.get('/api/stopTimer', (req, res) => {
    clearInterval(timeout)
    lastTimeOnFor = Math.floor(onFor/60)
    onFor = 0
    status = {
        isOn: false,
        timeToHeat: 60,
        timeLeft: 3600,
        reset: req.query.reset === 'true',
        stop: req.query.stop === 'true',
        lastTimeOn: moment().valueOf(),
        lastTimeOnFor: lastTimeOnFor
    }
    timeout = null
    io.emit('newStatus', status)
    spawn('python', ['./turnHeaterOff.py']) // may need to change to python3
    res.end()
})

app.get('/api/startTimer', (req, res) =>{
    status = {
        isOn: true,
        timeToHeat: parseInt(req.query.timeToHeat),
        timeLeft: parseInt(req.query.timeLeft),
    }
    timeout = setInterval(() => {
        status.timeLeft -= 1
        onFor += 1
    }, 1000)
    io.emit('newStatus', status)
    // call python script
    spawn('python', ['./turnHeaterOn.py'])
    res.end()
})

app.get('/api/status', (req, res) => {
    res.send({...status, lastTimeOnFor: lastTimeOnFor})
})

//All other routes - React app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/build/index.html'))
});

server.listen(process.env.PORT || 5000, () => {
    console.log('listening...')
})