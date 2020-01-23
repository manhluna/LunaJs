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

    })

    app.get('admin/panel',(req,res) => {

    })
}