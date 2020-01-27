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
            panel: `http://${process.env.host}:${process.env.http_port}/panel`,
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
                panel: `http://${process.env.host}:${process.env.http_port}/panel`,
                check: 'Email or password is incorrect'
            })
        } else {
            const client = auth.get(req,'restApi')
            if (client.session == null) {
                res.render('login',{
                    signup: `http://${process.env.host}:${process.env.http_port}/signup`,
                    forgot: `http://${process.env.host}:${process.env.http_port}/forgot`,
                    panel: `http://${process.env.host}:${process.env.http_port}/panel`,
                    check: ''
                })
            } else {
                res.redirect('/panel')
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

    app.get('/logout',(req, res) => {
        req.session.destroy(function(err) {
            res.render('/')
        })
    })

    app.get('/socket',(req, res)=>{
        res.render('socket')
    })

    app.get('/dashboard',(req, res)=>{
        res.render('dashboard',{
            $person: 720,
            $system: 360,
            $profit: 90,
            agency: 10,
            code: 123456,
            rank: "ĐẠI LÝ BÁN LẺ",
            ch: {amount: 100, revenue: 100},
            ctv: {amount: 100, revenue: 100},
            dlbl: {amount: 100, revenue: 100},
            dlbb: {amount: 100, revenue: 100},
            dlcm: {amount: 100, revenue: 100},
            tdl: {amount: 100, revenue: 100},
            npp: {amount: 100, revenue: 100},
        })
    })

    app.get('/initial',(req, res)=>{
        res.render('initial')
    })

    app.get('/orders',(req, res)=>{
        res.render('orders')
    })

    app.get('/mycart',(req, res)=>{
        res.render('mycart')
    })
}