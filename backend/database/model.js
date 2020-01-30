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
    //Sales
    person: {type: Number, default: 0},
    system: {type: Number, default: 0},
    profit: {type: Number, default: 0},
    agency: {type: Number, default: 0},
    rank: {type: Number, default: 0},

    ch: {amount: {type: Number, default: 0}, revenue: {type: Number, default: 0}},
    ctv: {amount: {type: Number, default: 0}, revenue: {type: Number, default: 0}},
    dlbl: {amount: {type: Number, default: 0}, revenue: {type: Number, default: 0}},
    dlbb: {amount: {type: Number, default: 0}, revenue: {type: Number, default: 0}},
    dlcm: {amount: {type: Number, default: 0}, revenue: {type: Number, default: 0}},
    tdl: {amount: {type: Number, default: 0}, revenue: {type: Number, default: 0}},
    npp: {amount: {type: Number, default: 0}, revenue: {type: Number, default: 0}},

    //Wizard
    wizard: {
        //Identifier
        identifier: {type: String, default:null},
        fullname: {type: String, default: null},
        born: {type: String, default: null},
        domicile: {type: String, default: null},
        owner: {type: String, default: null},
        bank: {type: String, default: null},
        account: {type: String, default: null},
        branch: {type: String, default: null},
        checkStatus: {type: Boolean, default: false},
    },
    orders: {
        carts: [{
            time: {type: String, default: null},
            img: {type: String, default: null},
            code: {type: String, default: null},
            name: {type: String, default: null},
            amount: {type: Number, default: 0},
            pay: {type: Number, default: 0},
        }],
        total: {type: Number, default: 0},
        number: {type: Number, default: 0},
    },
    history: [{
        id: {type: String, default: null},
        carts: [{
            time: {type: String, default: null},
            img: {type: String, default: null},
            code: {type: String, default: null},
            name: {type: String, default: null},
            amount: {type: Number, default: 0},
            pay: {type: Number, default: 0},
        }],
        attach: {
            payment: {type: String, default: null},
            commentPay: {type: String, default: null},
            ttphanphoi: {type: String, default: null},
            nguoinhan: {type: String, default: null},
            sodienthoai: {type: String, default: null},
            diachinhan: {type: String, default: null},
        },
        total: {type: Number, default: 0},
        number: {type: Number, default: 0},
        status: {type: String, default: null}
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