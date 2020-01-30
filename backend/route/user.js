require('dotenv').config()
const md5 = require('md5')
const bcrypt = require('bcrypt')
const db = require('../database/model')
const mail = require('../api/mail')
const path = require('path')
const auth = require('../authentic/lite')
module.exports = (app) => {
    
    app.get('/signup',(req, res) => {
        res.render('signup',{
            code: req.query.code || process.env.root_code,
            login: `http://${process.env.host}:${process.env.http_port}/login`
        })
    })

    app.post('/login',(req, res) => {
        res.render('login',{
            signup: `http://${process.env.host}:${process.env.http_port}/signup`,
            forgot: `http://${process.env.host}:${process.env.http_port}/forgot`,
            dashboard: `http://${process.env.host}:${process.env.http_port}/dashboard`,
            check: 'Please go to your inbox & Confirm your email address now'
        })

        let verify = `http://${process.env.host}:${process.env.http_port}/comfirm?email=${req.body.email}&phone=${req.body.phone}&firstname=${req.body.firstname}&lastname=${req.body.lastname}&username=${req.body.username}&password=${md5(req.body.password)}&code=${req.body.code}&time=${Date.now()}`
        
        if (req.body.code == null) {
            verify = `http://${process.env.host}:${process.env.http_port}/comfirm?email=${auth.en(req.body.email)}&password=${md5(req.body.password)}&code=0&time=${Date.now()}`
        }
        mail(req.body.email, verify)
    })

    app.get('/login',(req,res) => {
        if (req.query.status == 400) {
            res.render('login',{
                signup: `http://${process.env.host}:${process.env.http_port}/signup`,
                forgot: `http://${process.env.host}:${process.env.http_port}/forgot`,
                dashboard: `http://${process.env.host}:${process.env.http_port}/dashboard`,
                check: 'Email or password is incorrect'
            })
        } else {
            const client = auth.get(req,'restApi')
            if (client.session == null) {
                res.render('login',{
                    signup: `http://${process.env.host}:${process.env.http_port}/signup`,
                    forgot: `http://${process.env.host}:${process.env.http_port}/forgot`,
                    dashboard: `http://${process.env.host}:${process.env.http_port}/dashboard`,
                    check: ''
                })
            } else {
                res.redirect('/dashboard')
            }
        }
    })

    app.get('/verify',(req, res)=>{
        res.render('verify')
    })

    app.get('/comfirm',(req, res) => {
        if ((Date.now() - req.query.time) <= 10*60*1000){
            if (req.query.code !== '0' ){
                res.redirect('verify')
                bcrypt.hash(req.query.password, 7, (err, hash) => {
                    const schema = req.query
                    schema.password = hash
                    db.action(db.admin, {id: 'admin'}, {$inc: {'users': 1}}, doc => {
                        schema.id = doc.users + 142857
                        console.log(schema)
                        db.save(db.user, schema)
                    })
                })
            } else {
                const email = auth.de(req.query.email)
                db.action(db.user, {'email': email}, null, (doc) => {
                    if (doc == null) {
                        res.redirect('/forgot?status=400')
                    } else {
                        res.redirect('verify')
                        bcrypt.hash(req.query.password, 7, (err, hash) => {
                            db.action(db.user, {'email': doc.email},{$set: {'password': hash}}, d => {})
                        })
                    }
                })
            }
        } else {
            res.redirect('/')
        }
    })

    app.get('/forgot',(req, res) => {
        if (req.query.status == 400){
            res.render('forgot',{
                login: `http://${process.env.host}:${process.env.http_port}/login`,
                check: 'Email is incorrect'
            })
        } else {
            res.render('forgot',{
                login: `http://${process.env.host}:${process.env.http_port}/login`,
                check: ''
            })
        }
    })

    app.get('/session',(req,res) => {
        const client = auth.get(req,'restApi')
        if (client.session == null) {
            res.redirect('/login')
        } else {
            auth.check(client.session.id, client.ip, local => {
                if ((!local.ip) || (!local.user)){
                    res.redirect('/login')
                } else {
                    res.render('session',{sess: local.user.username})
                }
            })
        }
    })

    app.post('/session',(req,res) => {
        console.log(req.body)
        db.action(db.user, {'email': req.body.email}, null, (doc) => {
            if (doc == null) {
                res.redirect('/login?status=400')
            } else {
                bcrypt.compare(md5(req.body.password), doc.password, (err, equal) => {
                    if (!equal) {
                        res.redirect('/login?status=400')
                    } else {
                        const client = auth.get(req,'restApi')
                        const sessionId = auth.set(doc.id.toString(), client.ip)
                        req.session.user = {
                            id: sessionId,
                        }
                        res.render('session',{sess: sessionId})
                    }
                })
            }
        })
    })

    app.get('/socket',(req, res)=>{
        res.render('socket')
    })

    app.get('/logout',(req, res) => {
        req.session.destroy(function(err) {
            res.render('/')
        })
    })

    const rankString = (rank) =>{
        switch (rank){
            case 0: return 'Chưa Kích Hoạt'
            case 1: return 'Cộng Tác Viên'
            case 2: return 'Đại Lý Bán Lẻ'
            case 3: return 'Đại Lý Bán Buôn'
            case 4: return 'Đại Lý Cấp 1'
            case 5: return 'Tổng Đại Lý'
            case 6: return 'Nhà Phân Phối'
        }
    }
    const dashboard = doc => {
        return {
            number: doc.orders.number,
            total: doc.orders.total /1000,
            carts: doc.orders.carts,
            person: doc.person,
            system: doc.system,
            profit: doc.profit,
            agency: doc.agency,
            code: (doc.wizard.checkStatus == true) ? `https://thienminhhungphat.com/signup?code=${doc.id}`: `Chưa kích hoạt !`,
            rank: rankString(doc.rank),
            ch: {amount: doc.ch.amount, revenue: doc.ch.revenue},
            ctv: {amount: doc.ctv.amount, revenue: doc.ctv.revenue},
            dlbl: {amount: doc.dlbl.amount, revenue: doc.dlbl.revenue},
            dlbb: {amount: doc.dlbb.amount, revenue: doc.dlbb.revenue},
            dlcm: {amount: doc.dlcm.amount, revenue: doc.dlcm.revenue},
            tdl: {amount: doc.tdl.amount, revenue: doc.tdl.revenue},
            npp: {amount: doc.npp.amount, revenue: doc.npp.revenue},
        }
    }

    app.get('/dashboard',(req,res) => {
        const client = auth.get(req,'restApi')
        if (client.session == null) {
            res.redirect('/login')
        } else {
            auth.check(client.session.id, client.ip, local => {
                if ((!local.ip) || (!local.user)){
                    res.redirect('/login')
                } else {
                    res.render('dashboard',dashboard(local.user))
                }
            })
        }
    })

    app.post('/dashboard',(req,res) => {
        console.log(req.body)
        db.action(db.user, {'email': req.body.email}, null, (doc) => {
            if (doc == null) {
                res.redirect('/login?status=400')
            } else {
                bcrypt.compare(md5(req.body.password), doc.password, (err, equal) => {
                    if (!equal) {
                        res.redirect('/login?status=400')
                    } else {
                        const client = auth.get(req,'restApi')
                        const sessionId = auth.set(doc.id.toString(), client.ip)
                        req.session.user = {
                            id: sessionId,
                        }
                        res.render('dashboard',dashboard(doc))
                    }
                })
            }
        })
    })

    app.get('/initial',(req, res)=>{
        const client = auth.get(req,'restApi')
        if (client.session == null) {
            res.redirect('/login')
        } else {
            auth.check(client.session.id, client.ip, local => {
                if ((!local.ip) || (!local.user)){
                    res.redirect('/login')
                } else {
                    if (local.user.wizard.checkStatus){
                        res.render('initialok',{
                            number: local.user.orders.number,
                            total: local.user.orders.total /1000,
                            carts: local.user.orders.carts,
                        })
                    } else {
                        res.render('initial',{
                            number: local.user.orders.number,
                            total: local.user.orders.total /1000,
                            carts: local.user.orders.carts,
                        })
                    }
                }
            })
        }
    })

    app.get('/orders',(req, res)=>{
        const client = auth.get(req,'restApi')
        if (client.session == null) {
            res.redirect('/login')
        } else {
            auth.check(client.session.id, client.ip, local => {
                if ((!local.ip) || (!local.user)){
                    res.redirect('/login')
                } else {
                        res.render('orders',{
                            number: local.user.orders.number,
                            total: local.user.orders.total /1000,
                            carts: local.user.orders.carts,
                        })
                }
            })
        }
    })

    app.get('/mycart',(req, res)=>{
        const client = auth.get(req,'restApi')
        if (client.session == null) {
            res.redirect('/login')
        } else {
            auth.check(client.session.id, client.ip, local => {
                if ((!local.ip) || (!local.user)){
                    res.redirect('/login')
                } else {
                        res.render('mycart',{
                            number: local.user.orders.number,
                            total: local.user.orders.total/1000,
                            carts: local.user.orders.carts,
                        })
                }
            })
        }
    })
}