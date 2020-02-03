require('dotenv').config()
const db = require('../database/model')
const auth = require('../authentic/lite')
const mongoXlsx = require('mongo-xlsx')
const path = require('path')
const shell = require('child_process').execSync

function time(date) {
    let year = date.getFullYear();
    let month = (1 + date.getMonth()).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
  
    return day + '/' + month + '/' + year;
}

module.exports = (io,siofu) => {
    io.set('origins', `${process.env.host}:${process.env.http_port || process.env.PORT}`)
    // io.on('connection', connection)

    io.on('connection', (socket)=>{
        console.log(socket.id)

        var uploader = new siofu()
        uploader.dir = path.join(__dirname, '..', '..', 'frontend/public/images/avatars')
        uploader.listen(socket)

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
                const history = {
                    id: now,
                    carts: data.carts,
                    attach: data.attach,
                    number: 1,
                    total: data.carts[0].pay,
                    status: "Đơn hàng đầu tiên",
                    created: time(new Date()),
                }
                db.action(db.user,{id: local.user.id},{$set: {'wizard': data.wizard}, $push: {'history': history}},(doc)=>{})
                db.action(db.admin,{role: 'admin'},{$push: {'history': history}}, doc => {})  
            })
            io.sockets.emit('wizardComplete', {code: data.attach.commentPay, amount: data.carts[0].pay})
        })

        socket.on('addCart', data => {
            const client = auth.get(socket,'socket')
            auth.check(client.session.id, client.ip, local =>{
                db.action(db.user,{id: local.user.id},{$push: {'orders.carts': data}, $inc:{'orders.total': data.pay, 'orders.number': 1}},(doc)=>{})  
            })
        })

        const treeChild = (doc,cb) => {
            db.user.find({code: doc.id, 'wizard.checkStatus': true}, (err, xdoc) => {
                var tree = [{
                    key: doc.id,
                    name: doc.username,
                    phone: doc.phone,
                    email: doc.email,
                    person: doc.person,
                    // avatar: doc.avatar,
                    // system: doc.system,
                    // profit: doc.profit,
                }]
                xdoc.forEach((item) => {
                    tree.push({
                        key: item.id,
                        name: item.username,
                        phone: item.phone,
                        email: item.email,
                        person: item.person,
                        parent: item.code[3],
                        // avatar: item.avatar,
                        // system: item.system,
                        // profit: item.profit,
                    })
                })
                cb(tree)
            }) 
        }

        const mycart = (socket) => {
            const client = auth.get(socket,'socket')
            auth.check(client.session.id, client.ip, local =>{

                socket.emit('mycart',{
                    carts: local.user.orders.carts,
                    total: local.user.orders.total
                })

                treeChild(local.user, tree => {
                    socket.emit('taocay',{
                        tree: tree
                    })
                })
            })
        }

        const adminHistory = (socket) => {
            const client = auth.get(socket,'socket')
            auth.admin(client.session.id, client.ip, local =>{
                socket.emit('xldonhang',{
                    history: local.admin.history,
                })
            })
        }

        const _products = () => {
            db.action(db.admin, {role: 'admin'}, null, doc => {
                socket.emit('loadsanpham',{
                    products: doc.products,
                })
            })
        }

        const _bank = () => {
            db.action(db.admin, {role: 'admin'}, null, doc => {
                socket.emit('xulirut',{
                    bank: doc.bank,
                })
            })
        }

        if (auth.view(auth.get(socket,'socket').session.id) !== '142858') {
            mycart(socket)
            _products()
        } else {
            adminHistory(socket)
            _bank()
        }

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
                const history = {
                    id: now,
                    carts: local.user.orders.carts,
                    attach: data.attach,
                    total: local.user.orders.total,
                    number: local.user.orders.number,
                    status: 'Đang chờ xử lý',
                    created: time(new Date()),
                }
                db.action(db.user,{id: local.user.id},{$push: {'history': history}, $set: {'orders.carts': [], 'orders.total': 0, 'orders.number': 0}},(doc)=>{})
                db.action(db.admin,{role: 'admin'},{$push: {'history': history}}, doc => {})
            })
            setTimeout(()=>{
                io.sockets.emit('completeModal', {code: data.attach.commentPay, amount: data.total})
            },6000)
        })

        socket.on('goidien', data => {
            db.action(db.user, {'history.id': data.id},{$set: {'history.$.status': data.status}}, doc => {})
            db.action(db.admin, {'history.id': data.id},{$set: {'history.$.status': data.status}}, doc => {})
        })

        socket.on('giaohang', data => {
            db.action(db.user, {'history.id': data.id},{$set: {'history.$.status': data.status}}, doc => {})
            db.action(db.admin, {'history.id': data.id},{$set: {'history.$.status': data.status}}, doc => {})
        })

        socket.on('themsp', data => {
            db.action(db.admin, {role: 'admin'}, {$push: {'products': data}}, doc => {})
        })

        socket.on('xoasp', data => {
            db.action(db.admin, {'products.code': data.code}, {$pull: {'products': {'code': data.code}}}, doc => {})
        })

        socket.on('setbonus', data => {
            db.action(db.admin, {role: 'admin'}, {$set: {'bonus': data.bonus}}, doc => {})
        })

        socket.on('setlevel', data => {
            db.action(db.admin, {role: 'admin'}, {$push: {'level': data}}, doc => {})
        })

        socket.on('ruttien', data => {
            db.action(db.user, {id: data.id}, null, doc => {
                db.action(db.admin, {role: 'admin'}, {$push: {'bank': {
                    st: Date.now(),
                    id: data.id,
                    amount: data.amount,
                    created: time(new Date()),

                    owner: doc.wizard.owner,
                    bank: doc.wizard.bank,
                    account: doc.wizard.account,
                    branch: doc.wizard.branch,
                }}}, xdoc => {
                    db.action(db.user, {id: data.id}, {$inc: {'received': data.amount}}, sdoc => {})
                })
            })
        })

        socket.on('xoalenhrut', data => {
            db.action(db.admin, {'bank.st': data}, {$pull: {'bank': {'st': data}}}, doc => {})
        })

        socket.on('doithongtin', data => {
            db.action(db.user, {id: data.id}, {$set: {
                "username": data.change.username,
                "phone": data.change.phone,
                "email": data.change.email,
                "wizard.owner": data.change.wizard.owner,
                "wizard.account": data.change.wizard.account,
                "wizard.bank": data.change.wizard.bank,
                "wizard.branch": data.change.wizard.branch,
            }}, doc => {})
        })

        socket.on('uploadavt', data => {
            const oldImg = path.join(__dirname, '..', '..', `frontend/public/images/avatars/${data.avatar}`)
            const ext = path.extname(oldImg)
            const newImg  = path.join(__dirname, '..', '..', `frontend/public/images/avatars/${data.id + ext}`)
            shell(`mv ${oldImg} ${newImg}`)
            const avt = data.id + ext
            db.action(db.user, {id: data.id}, {$set:{'avatar': avt}}, doc => {})
        })

        socket.on('xuatfile', data => {
            if (data == 'user') {
                db.user.find({},'id username phone email code wizard person system profit received',(err,doc) => {
                    const data = doc
                    var model = mongoXlsx.buildDynamicModel(data)

                    mongoXlsx.mongoData2Xlsx(data, model, function(err, data) {
                        // const filename = data.fullPath.slice(0,data.fullPath.length -5)
                        socket.emit('download', data.fullPath)
                    })

                })
            }
            if (data == 'order') {
                db.action(db.admin, {role: 'admin'}, null, doc => {
                    const data = doc.history
                    var model = mongoXlsx.buildDynamicModel(data)

                    mongoXlsx.mongoData2Xlsx(data, model, function(err, data) {
                        socket.emit('download', data.fullPath)
                    })
                })
            }
            if (data == 'pay') {
                db.action(db.admin, {role: 'admin'}, null, doc => {
                    const data = doc.bank
                    var model = mongoXlsx.buildDynamicModel(data)

                    mongoXlsx.mongoData2Xlsx(data, model, function(err, data) {
                        socket.emit('download', data.fullPath)
                    })
                })
            }
        })

        socket.on('thanhcong', data => {
            db.action(db.user, {'history.id': data.id},{$set: {'history.$.status': data.status, 'wizard.checkStatus': true}, $inc: {'person': data.total}}, doc => {
                doc.code.forEach((item) => {
                    db.action(db.user,{id: item},{$inc: {'system': data.total}}, xdoc => {})
                })
            })
            db.action(db.admin, {'history.id': data.id},{$inc: {'sales': data.total},$pull: {'history': {'id': data.id}}}, doc => {})
        })
    })
}