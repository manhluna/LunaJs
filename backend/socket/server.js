require('dotenv').config()
const testServer = (data) => console.log(data)
const testButton = (data) => console.log(data)
const connection = (socket) => {
    
    console.log(socket.id)

    socket.emit('testClient', 'Hello Client')

    socket.on('testServer', testServer)

    socket.on('testButton', testButton)
}
module.exports = (io) => {
    io.set('origins', `${process.env.host}:${process.env.http_port || process.env.PORT}`)
    io.on('connection', connection)
}