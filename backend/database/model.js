const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.connect('mongodb://localhost/mydb',{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const schemaUser = new Schema({
    id: {type: Number, default: 142857},
    email: {type: String, default: 'user@example.com'},
    phone: {type: String, default: '+840987654321'},
    firstname: {type: String, default: 'Manh'},
    lastname: {type: String, default: 'Luna'},
    username: {type: String, default: 'anonymous'},
    password: {type: String, default: 'anonymous'},
    code: {type: Number, default: 142858}
},{
    versionKey: false
})

const User = mongoose.model('User', schemaUser,'users')

const schemaAdmin = new Schema({
    id: {type: String, default: 'admin'},
    users: {type: Number, default: 0}
},{
    versionKey: false
})

const Admin = mongoose.model('Admin', schemaAdmin,'admins')

const action = (model,filter, updater,cb) => {
    if (filter == null) {
        model.find((err,docs) => { cb(docs) })
    } else {
        if (updater == null) {
            model.findOne(filter, (err,doc)=>{ cb(doc) })
        } else {
            model.findOneAndUpdate(filter,updater,{new:true},(err,doc)=>{ cb(doc) })
        }
    }
}

const save = (model,schema) =>{
    const doc = new model(schema)
    doc.save((err,res)=>{
        
    })
}

module.exports ={
    user: User,
    admin: Admin,
    action: action,
    save: save
}