// const ioSession = require('socket.io-express-session')
// io.use(ioSession(session))

// io.use((socket, next) => {
//     io.engine.generateId = (req) => socket.handshake.session.user.id
//     next(null, true)
// })

// io.engine.generateId = (req) => {
//     return 1
// }

// const cookie = req.headers.cookie
// const cookie = socket.handshake.headers.cookie

//const ip = req.ip
//const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null)
//const ip = (req.headers['x-forwarded-for'] || '').split(',').pop() || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress

console.log(Date.now())