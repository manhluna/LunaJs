require('dotenv').config()
const md5 = require('md5')
const bcrypt = require('bcrypt')
const db = require('../database/model')
const path = require('path')
const auth = require('../authentic/lite')
module.exports = (app) => {

    app.get('/test',(req,res) => {
        res.render('test')
    })

    app.get('/setcookie',(req, res) => {
        req.session.user = {
            id: 'manh',
        }
        res.send('Done')
    })

    app.get('/getcookie',(req, res) => {
        const session = req.session.user
        res.send(session)
    })

    app.get('/admin',(req, res) => {
            const client = auth.get(req,'restApi')
            if (client.session == null) {
                res.render('admin',{
                    panel: `http://${process.env.host}:${process.env.http_port}/panel`,
                })
            } else {
                res.redirect('/panel')
            }
    })

    app.get('/logout',(req, res) => {
        req.session.destroy(function(err) {
            res.redirect('/')
        })
    })

    app.get('/', (req, res) => {
        res.render('index')
    })

    app.post('/panel',(req,res) => {
        db.action(db.admin, {'email': req.body.email}, null, (doc) => {
                bcrypt.compare(md5(req.body.password), doc.password, (err, equal) => {
                    if (equal) {
                        const client = auth.get(req,'restApi')
                        const sessionId = auth.set(doc.id.toString(), client.ip)
                        req.session.user = {
                            id: sessionId,
                        }
                        res.render('panel',{
                            users: doc.users,
                            sales: doc.sales
                        })
                    }
                })
        })
    })

    app.get('/panel',(req,res) => {
        const client = auth.get(req,'restApi')
        if (client.session == null) {
            res.redirect('/admin')
        } else {
            auth.admin(client.session.id, client.ip, local => {
                    res.render('panel',{
                        users: local.admin.users,
                        sales: local.admin.sales/1000
                    })
            })
        }
    })

    app.get('/check',(req,res) => {
        const client = auth.get(req,'restApi')
        if (client.session == null) {
            res.redirect('/admin')
        } else {
            auth.admin(client.session.id, client.ip, local => {
                    res.render('check',{
                        history: local.admin.history,
                        bank: local.admin.bank
                    })
            })
        }
    })

    app.get('/add',(req,res) => {
        const client = auth.get(req,'restApi')
        if (client.session == null) {
            res.redirect('/admin')
        } else {
            auth.admin(client.session.id, client.ip, local => {
                    res.render('add',{
                        products: local.admin.products
                    })
            })
        }
    })

    const getRank = (ds, level) => {
        for (let i = 0; i < level.length; i++) {
            if (ds < level[i].limit) {
                return level[i]
            }
        }
    }

    app.get('/users',(req,res) => {
        const client = auth.get(req,'restApi')
        if (client.session == null) {
            res.redirect('/admin')
        } else {
            auth.admin(client.session.id, client.ip, local => {
                db.action(db.user, null, null, doc => {
                    db.action(db.admin, {role: 'admin'}, null, ad => {
                        doc.forEach((item) => {
                            item.rank = getRank(item.person + item.system, ad.level).text
                        })
                        res.render('users',{
                            users: doc
                        })
                    })
                })
            })
        }
    })

    app.get('/export/:file',(req, res) => {
        const client = auth.get(req,'restApi')
        if (client.session !== null) {

            const file = req.params['file']
            const filePath =  path.join(__dirname, '..', '..') + '/' + file
            console.log(filePath)
            res.sendFile(filePath)
        }
    })
}
