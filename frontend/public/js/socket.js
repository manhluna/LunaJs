const testClient = data => alert(data)
jQuery(document).ready(() => {
    const socket = io()
    socket.on('connect', () => {
        console.log(socket.io.engine.id)
    })

    socket.on('testClient', testClient)
    socket.emit('testServer', "Hello Server")

    jQuery('#send').click(() => {
        socket.emit('testButton',jQuery('#name').val())
    })
})