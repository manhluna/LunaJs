// --> Copy to backend/app.js
// Ssl Server
const fs = require('fs')
const sslOptions = {
  key: fs.readFileSync('./backend/ssl/key.pem'),
  cert: fs.readFileSync('./backend/ssl/cert.crt'),
  // passphrase: ''
}
const https = require('https').createServer(sslOptions, app)
https.listen(process.env.https_port,()=>{
  console.log(`Listening on HTTPS Port: ${process.env.https_port}`);
})