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
                        sales: local.admin.sales
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
                    res.render('check')
            })
        }
    })
}
