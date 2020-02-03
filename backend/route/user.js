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
        const html = `<h3>Bấm vào nút "Xác Nhận" để hoàn thành:</h3>
        <table width="100%" cellspacing="0" cellpadding="0">
        <tr>
            <td>
                <table cellspacing="0" cellpadding="0">
                    <tr>
                        <td style="border-radius: 2px;" bgcolor="#ED2939">
                            <a href="${verify}" style="padding: 8px 12px; border: 1px solid #ED2939;border-radius: 2px;font-family: Helvetica, Arial, sans-serif;font-size: 14px; color: #ffffff;text-decoration: none;font-weight:bold;display: inline-block;">
                            Xác Nhận             
                            </a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
      </table>`
        mail(req.body.email, '', html)
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

                    db.action(db.user, {'id': req.query.code}, null, (xdoc) => {
                        let s = xdoc.code.slice(1,4)
                        s.push(Number(req.query.code))

                        const schema = req.query
                        schema.password = hash
                        schema.code = s
                        db.action(db.admin, {role: 'admin'}, {$inc: {'users': 1}}, doc => {
                            schema.id = doc.users + 142858
                            console.log(schema)
                            db.save(db.user, schema)
                        })

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
            res.redirect('/login')
        })
    })

    app.get('/', (req, res) => {
        res.render('index')
    })

    const getRank = (ds, level) => {
        for (let i = 0; i < level.length; i++) {
            if (ds < level[i].limit) {
                return level[i]
            }
        }
    }

    const dashboard = (doc,cb) => {
        var amount = new Map()
        var  revenue = new Map()
        db.action(db.admin, {role: 'admin'}, null, ad => {
            db.user.find({code: doc.id, 'wizard.checkStatus': true}, (err, xdoc) => {
                console.log(xdoc.length, ad.bonus)
                const bonus = xdoc.length*ad.bonus
                xdoc.forEach((item) => {
                    //Cap bac cua con
                    const lv = getRank(item.person + item.system, ad.level)

                    //Dem so luong user moi cap
                    if (amount.get(lv.label) == undefined){
                        amount.set(lv.label,0)
                    }
                    amount.set(lv.label, amount.get(lv.label)+1)

                    //Tinh tong doanh so theo tung cap
                    if (revenue.get(lv.label) == undefined){
                        revenue.set(lv.label,0)
                    }
                    revenue.set(lv.label, revenue.get(lv.label)+item.person)
                })
                cb({
                    id: doc.id,
                    number: doc.orders.number,
                    total: doc.orders.total /1000,
                    avatar: doc.avatar,
                    carts: doc.orders.carts,

                    person: doc.person /1000,
                    system: doc.system /1000,

                    profit: doc.profit + bonus,
                    received: doc.received,
                    agency: xdoc.length,

                    code: (doc.wizard.checkStatus == true) ? `https://thienminhhungphat.com/signup?code=${doc.id}`: `Chưa kích hoạt !`,
                    rank: getRank(doc.person + doc.system, ad.level).text,

                    ctv: {amount: amount.get('ctv') || 0, revenue: revenue.get('ctv') || 0},
                    dlbl: {amount: amount.get('dlbl') || 0, revenue: revenue.get('dlbl') || 0},
                    dlbb: {amount: amount.get('dlbb') || 0, revenue: revenue.get('dlbb') || 0},
                    dlcm: {amount: amount.get('dlcm') || 0, revenue: revenue.get('dlcm') || 0},
                    tdl: {amount: amount.get('tdl') || 0, revenue: revenue.get('tdl') || 0},
                    npp: {amount: amount.get('npp') || 0, revenue: revenue.get('npp') || 0},
                })
            }) 
        })
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
                    dashboard(local.user, xo => {
                        res.render('dashboard', xo)
                    })
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
                        dashboard(doc, xo => {
                            res.render('dashboard', xo)
                        })
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
                            avatar: local.user.avatar,
                        })
                    } else {
                        res.render('initial',{
                            number: local.user.orders.number,
                            total: local.user.orders.total /1000,
                            carts: local.user.orders.carts,
                            avatar: local.user.avatar
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
                    db.action(db.admin, {role: 'admin'}, null, doc => {
                        res.render('orders',{
                            number: local.user.orders.number,
                            total: local.user.orders.total /1000,
                            carts: local.user.orders.carts,
                            avatar: local.user.avatar,
                            products: doc.products
                        })
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
                            avatar: local.user.avatar
                        })
                }
            })
        }
    })

    const mix = (doc,cb) => {
        db.user.find({code: doc.id, 'wizard.checkStatus': true}, (err, xdoc) => {
            var mixHistory =[]
            xdoc.forEach((item) => {
                item.history.forEach((element) => {
                    mixHistory.push(element)
                })
            })
            cb(mixHistory)
        }) 
    }

    app.get('/history',(req, res)=>{
        const client = auth.get(req,'restApi')
        if (client.session == null) {
            res.redirect('/login')
        } else {
            auth.check(client.session.id, client.ip, local => {
                if ((!local.ip) || (!local.user)){
                    res.redirect('/login')
                } else {
                    mix(local.user, mixs => {
                        res.render('history',{
                            number: local.user.orders.number,
                            total: local.user.orders.total/1000,
                            carts: local.user.orders.carts,
                            avatar: local.user.avatar,
                            history: local.user.history,
                            mixs: mixs,
                        })
                    })
                }
            })
        }
    })

    app.get('/agency',(req, res)=>{
        const client = auth.get(req,'restApi')
        if (client.session == null) {
            res.redirect('/login')
        } else {
            auth.check(client.session.id, client.ip, local => {
                if ((!local.ip) || (!local.user)){
                    res.redirect('/login')
                } else {
                        res.render('agency',{
                            number: local.user.orders.number,
                            total: local.user.orders.total/1000,
                            carts: local.user.orders.carts,
                            avatar: local.user.avatar
                        })
                }
            })
        }
    })

    app.get('/center',(req, res)=>{
        const client = auth.get(req,'restApi')
        if (client.session == null) {
            res.redirect('/login')
        } else {
            auth.check(client.session.id, client.ip, local => {
                if ((!local.ip) || (!local.user)){
                    res.redirect('/login')
                } else {
                        res.render('center',{
                            number: local.user.orders.number,
                            total: local.user.orders.total/1000,
                            carts: local.user.orders.carts,
                            avatar: local.user.avatar
                        })
                }
            })
        }
    })

    app.get('/profit',(req, res)=>{
        const client = auth.get(req,'restApi')
        if (client.session == null) {
            res.redirect('/login')
        } else {
            auth.check(client.session.id, client.ip, local => {
                if ((!local.ip) || (!local.user)){
                    res.redirect('/login')
                } else {
                        res.render('profit',{
                            id: local.user.id,
                            number: local.user.orders.number,
                            total: local.user.orders.total/1000,
                            carts: local.user.orders.carts,
                            avatar: local.user.avatar,
                            box: local.user.box,
                        })
                }
            })
        }
    })

    app.get('/profile',(req, res)=>{
        const client = auth.get(req,'restApi')
        if (client.session == null) {
            res.redirect('/login')
        } else {
            auth.check(client.session.id, client.ip, local => {
                if ((!local.ip) || (!local.user)){
                    res.redirect('/login')
                } else {
                        res.render('profile',{
                            id: local.user.id,
                            user: local.user,
                            number: local.user.orders.number,
                            total: local.user.orders.total/1000,
                            carts: local.user.orders.carts,
                            avatar: local.user.avatar
                        })
                }
            })
        }
    })
}