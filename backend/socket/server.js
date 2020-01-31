require('dotenv').config()
const db = require('../database/model')
const auth = require('../authentic/lite')

function time(date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
  
    return day + '/' + month + '/' + year;
}

module.exports = (io) => {
    io.set('origins', `${process.env.host}:${process.env.http_port || process.env.PORT}`)
    // io.on('connection', connection)

    io.on('connection', (socket)=>{
        console.log(socket.id)

        socket.emit('testClient', 'Hello Client')
    
        socket.on('testServer', data => console.log(data))
    
        socket.on('testButton', data => console.log(data))

        socket.on('finishInitial', data => {
            let now = Math.floor(Date.now() / 60000).toString()
            data.attach.commentPay = ''
            if (data.attach.payment == 'banking'){
                data.attach.commentPay = now
            }
            const client = auth.get(socket,'socket')
            auth.check(client.session.id, client.ip, local =>{
                db.action(db.user,{id: local.user.id},{$set: {'wizard': data.wizard, 'rank': 1}, $push: {'history': {
                    id: now,
                    carts: data.carts,
                    attach: data.attach,
                    number: 1,
                    total: data.carts[0].pay,
                    status: "Đang chờ xử lý",
                    created: time(new Date()),
                }}},(doc)=>{})  
            })
            io.sockets.emit('wizardComplete', {code: data.attach.commentPay, amount: data.carts[0].pay})
        })

        socket.on('addCart', data => {
            const client = auth.get(socket,'socket')
            auth.check(client.session.id, client.ip, local =>{
                db.action(db.user,{id: local.user.id},{$push: {'orders.carts': data}, $inc:{'orders.total': data.pay, 'orders.number': 1}},(doc)=>{})  
            })
        })

        const mycart = (socket) => {
            const client = auth.get(socket,'socket')
            auth.check(client.session.id, client.ip, local =>{
                socket.emit('mycart',{
                    carts: local.user.orders.carts,
                    total: local.user.orders.total
                })
            })
        }

        mycart(socket)

        socket.on('changeAmount', data => {
            const client = auth.get(socket,'socket')
            auth.check(client.session.id, client.ip, local =>{
                db.action(db.user,{id: local.user.id, 'orders.carts.time': data.time},{$set: {'orders.carts.$.amount': data.amount, 'orders.carts.$.pay': data.pay, 'orders.total': data.total}},(doc)=>{})  
            })
        })

        socket.on('removeCart', data => {
            const client = auth.get(socket,'socket')
            auth.check(client.session.id, client.ip, local =>{
                db.action(db.user,{id: local.user.id, 'orders.carts.time': data.time},{$set: {'orders.total': data.total, 'orders.number': data.number}, $pull:{'orders.carts': {'time': data.time}}},(doc)=>{})  
            })
        })

        socket.on('completeOrder', (data) => {
            let now = Math.floor(Date.now() / 60000).toString()
            data.attach.commentPay = ''
            if (data.attach.payment == 'banking'){
                data.attach.commentPay = now
            }
            const client = auth.get(socket,'socket')
            auth.check(client.session.id, client.ip, local =>{
                db.action(db.user,{id: local.user.id},{$push: {'history': {
                    id: now,
                    carts: local.user.orders.carts,
                    attach: data.attach,
                    total: local.user.orders.total,
                    number: local.user.orders.number,
                    status: 'Đang chờ xử lý',
                    created: time(new Date()),
                }}, $set: {'orders.carts': [], 'orders.total': 0, 'orders.number': 0}},(doc)=>{})  
            })
            setTimeout(()=>{
                io.sockets.emit('completeModal', {code: data.attach.commentPay, amount: data.total})
            },6000)
        })
    })
}