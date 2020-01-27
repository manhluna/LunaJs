const mongoose = require('mongoose')
const Schema = mongoose.Schema
mongoose.connect('mongodb://localhost/mydb',{ useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const schemaUser = new Schema({
    //Info
    id: {type: Number, default: null},
    email: {type: String, default: null},
    phone: {type: String, default: null},
    firstname: {type: String, default: null},
    lastname: {type: String, default: null},
    username: {type: String, default: null},
    password: {type: String, default: null},
    code: {type: Number, default: 142858},
    avatar: {type: String, default: null},
    rank: {type: String, default: null},
    //Sales
    $person: {type: Number, default: null},
    $system: {type: Number, default: null},
    $profit: {type: Number, default: null},
    agency: {type: Number, default: null},
    active: {type: Boolean, default: false},
    //Banks
    owner: {type: String, default: null},
    bank: {type: String, default: null},
    account: {type: String, default: null},
    branch: {type: String, default: null},
    //Identifier
    identifier: {type: String, default:null},
    fullname: {type: String, default: null},
    born: {type: String, default: null},
    domicile: {type: String, default: null},
    //History
    order: [{
        center: {type: String, default: null},
        agency: {type: String, default: null},
        amount: {type: Number, default: null},
        status: {type: String, default: null},
    }],
    bought: [{
        amount: {type: Number, default: null},
        center: {type: String, default: null},
        confirm: {type: String, default: null},
        created: {type: String, default: null},
    }],
    sysbought: [{
        agency: {type: String, default: null},
        amount: {type: Number, default: null},
        center: {type: String, default: null},
        confirm: {type: String, default: null},
        created: {type: String, default: null},
    }],
    bonus: [{
        agency: {type: String, default: null},
        amount: {type: Number, default: null},
        created: {type: String, default: null},
    }]
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