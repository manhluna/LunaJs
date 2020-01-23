require('dotenv').config()
const express = require('express')
const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const bodyParser = require('body-parser')
const cors = require('cors')
const restUser = require('./route/user')
const restAdmin = require('./route/admin')
const socketServer = require('./socket/server')
const session = require('express-session')({
  resave: true, 
  saveUninitialized: true, 
  secret: process.env.cookie_secret, 
  cookie: { maxAge: 60000 }
})
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const authNormal = require('./authentic/normal')
const sharedsession = require("express-socket.io-session")


app.use(flash())
app.use(cors())

// --> Json req - res
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Public Folder ('/')
app.use(express.static('./frontend/public'))
app.use(express.static('./frontend/labs/ElaAdmin'))

// Session
app.use(session)

// Passport
app.use(passport.initialize())
app.use(passport.session())

// Template Ejs
app.set('view engine', 'ejs')
app.set('views', './frontend/template/test')

restUser(app)
restAdmin(app)

authNormal(passport)

io.use(sharedsession(session, {
  autoSave:true
}))

socketServer(io)

//Starting Server
http.listen(process.env.http_port || process.env.PORT,()=>{
  console.log(`Listening on HTTP Port: ${process.env.http_port}`);
})