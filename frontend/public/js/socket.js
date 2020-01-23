const testClient = data => alert(data)
$(document).ready(() => {
    const socket = io()
    socket.on('connect', () => {
        console.log(socket.io.engine.id)
    })

    socket.on('testClient', testClient)
    socket.emit('testServer', "Hello Server")

    $('#send').click(() => {
        socket.emit('testButton',$('#name').val())
    })
})