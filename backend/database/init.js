const db = require('../database/model')
db.save(db.admin, {
    role: "admin",
    email: "admin@gmail.com",
    password: "$2a$07$9M3Py2Zsf7Oi5upUH.Tgie3NHkKjln0xjeWpMcwOg4mhZXvULmEVy",
})
db.save(db.user, {
    id: 142858,
    code: [142854,142855,142856,142857]
})