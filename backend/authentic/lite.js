require('dotenv').config()
const aes = require('aes-js')
const db = require('../database/model')

const encrypt = (text) => {
    const data = aes.utils.utf8.toBytes(text)
    const key = aes.utils.utf8.toBytes(process.env.private_key)

    const iv = new aes.Counter(2020)
    const aesCtr = new aes.ModeOfOperation.ctr(key, iv)
    const encryptedBytes = aesCtr.encrypt(data)

    const encryptedHex = aes.utils.hex.fromBytes(encryptedBytes)
    return encryptedHex
}

const decrypt = (encryptedHex) => {
    const encryptedBytes = aes.utils.hex.toBytes(encryptedHex)
    const key = aes.utils.utf8.toBytes(process.env.private_key)

    const iv = new aes.Counter(2020)

    const aesCtr = new aes.ModeOfOperation.ctr(key, iv)
    const decryptedBytes = aesCtr.decrypt(encryptedBytes)
    
    const text = aes.utils.utf8.fromBytes(decryptedBytes)
    return text
}

const enSession = (id,ip) => {
    return id.length+encrypt(id)+encrypt(ip)
}

const deSession = (session, nowIp,cb) => {
    const idHex = session.slice(1, Number(session[0])*2+1)
    const id = decrypt(idHex)
    const ipHex = session.slice(Number(session[0])*2+1, session.length)
    db.action(db.user, {id: id}, null, (res) => {
        cb({user: (res == null) ? false : res, ip: (decrypt(ipHex) == nowIp) ? true : false})  
    })
}

const admin = (session, nowIp,cb) => {
    const idHex = session.slice(1, Number(session[0])*2+1)
    const id = decrypt(idHex)
    const ipHex = session.slice(Number(session[0])*2+1, session.length)
    db.action(db.admin, {id: id}, null, (res) => {
        cb({admin: (res == null) ? false : res, ip: (decrypt(ipHex) == nowIp) ? true : false})  
    })
}

const view = (session) => {
    const idHex = session.slice(1, Number(session[0])*2+1)
    const id = decrypt(idHex)
    return id
}

const get = (protocol,type) => {
    if (type == 'socket') {
        return {
            id: protocol.id,
            ip: protocol.request.connection.remoteAddress,
            session: protocol.handshake.session.user
        }
    }

    return {
        ip: protocol.header('x-forwarded-for') || protocol.connection.remoteAddress ,
        session: protocol.session.user
    }
}

module.exports = {
    en: encrypt,
    de: decrypt,
    get: get,
    set: enSession,
    check: deSession,
    admin: admin,
    view: view,
}