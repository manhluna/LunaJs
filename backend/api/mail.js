require('dotenv').config()
const nodemailer = require('nodemailer')
module.exports = (mail,text, html) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.usermail,
            pass: process.env.passmail
        }
    })
    
    const mailOptions = {
        from: process.env.usermail,
        to: mail,
        subject: `Thiên Minh Hưng Phát`,
        text: text,
        html: html,
    }
    
    transporter.sendMail(mailOptions, (err, res) => {if (err) { 
        console.log(err)
    } else { 
        console.log(res) 
    }})
}