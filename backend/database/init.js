const db = require('../database/model')
db.save(db.admin, {
    id : 142858,
    role : "admin",
    email : "admin@gmail.com",
    password : "$2a$07$9M3Py2Zsf7Oi5upUH.Tgie3NHkKjln0xjeWpMcwOg4mhZXvULmEVy",
    users : 6,
    sales : 0,
    bonus : 0,
    products : [ 
        {
            img : "https://i.pinimg.com/236x/82/f7/10/82f7101036f0995fa9eba5494971966d--th%E1%BB%83-thao-superstar.jpg",
            code : "AA5601",
            name : "Giày Nữ Xinh",
            unit : 200000,
        }, 
        {
            img : "https://cf.shopee.vn/file/058a71883ec40932430541eb6a395fa8",
            code : "AA5602",
            name : "Giày Nam Tính",
            unit : 300000,
        }
    ],
    "level" : [
        {
            label : "no",
            text : "Chưa Kích Hoạt",
            limit : 900000,
            coe : 0,
        },
        {
            label : "ctv",
            text : "Cộng Tác Viên",
            limit : 4000000,
            coe : 0,
        }, 
        {
            label : "dlbl",
            text : "Đại Lý Bán Lẻ",
            limit : 40000000,
            coe : 0.05,
        }, 
        {
            label : "dlbb",
            text : "Đại Lý Bán Buôn",
            limit : 200000000,
            coe : 0.1,
        }, 
        {
            label : "dlcm",
            text : "Đại Lý Cấp Một",
            limit : 400000000,
            coe : 0.15,
        }, 
        {
            label : "tdl",
            text : "Tổng Đại Lý",
            limit : 2000000000,
            coe : 0.2,
        }, 
        {
            label : "npp",
            text : "Nhà Phân Phối",
            limit : 10000000000.0,
            coe : 0.3,
        }
    ],
    history : [],
    bank : []
})
db.save(db.user, {
    id: 142858,
    code: [142854,142855,142856,142857],
    wizard : {
        identifier : "root",
        fullname : "root",
        born : "root",
        domicile : "root",
        owner : "root",
        bank : "root",
        account : "root",
        branch : "root",
        checkStatus : true
    },
    orders : {
        total : 0,
        number : 0,
        carts : []
    },
    email : "root@gmail.com",
    phone : "root",
    firstname : "root",
    lastname : "root",
    username : "root",
    password : "$2b$07$4ytQjub2nHC4WcMSri9oL.FQb3hXW8a/7zZ9dvorVTdN7yRejr5yO",

    avatar : "https://pngimage.net/wp-content/uploads/2018/05/admin-avatar-png-1.png",
    person : 0,
    system : 0,
    profit : 0,
    received : 0,
    box : [],
    history : []
})
db.save(db.user, {
    wizard : {
        identifier : "163421585",
        fullname : "Lương Văn Mạnh",
        born : "1998-09-16",
        domicile : "Nam Định",
        owner : "Lương Văn Mạnh",
        bank : "Vietcombank",
        account : "0011001996564",
        branch : "Hà Nội",
        checkStatus : true
    },
    orders : {
        total : 0,
        number : 0,
        carts : []
    },
    id : 142859,
    email : "khongminh98123@gmail.com",
    phone : "84977507353",
    firstname : "manh",
    lastname : "luna",
    username : "manhluna",
    password : "$2b$07$4ytQjub2nHC4WcMSri9oL.FQb3hXW8a/7zZ9dvorVTdN7yRejr5yO",
    code : [ 
        142855, 
        142856, 
        142857, 
        142858
    ],
    avatar : "https://pngimage.net/wp-content/uploads/2018/05/admin-avatar-png-1.png",
    person : 0,
    system : 0,
    profit : 0,
    received : 0,
    box : [],
    history : []
})

db.save(db.user, {
    wizard : {
        identifier : "163421585",
        fullname : "Dao Thu Thao",
        born : "1998-04-04",
        domicile : "Hai Duong",
        owner : "Dao Thu Thao",
        bank : "Tpbank",
        account : "7211001996211",
        branch : "Hà Nội",
        checkStatus : true
    },
    orders : {
        total : 0,
        number : 0,
        carts : []
    },
    id : 142860,
    email : "thaodao@gmail.com",
    phone : "0356603355",
    firstname : "thao",
    lastname : "dao",
    username : "thuthao",
    password : "$2b$07$4ytQjub2nHC4WcMSri9oL.FQb3hXW8a/7zZ9dvorVTdN7yRejr5yO",
    code : [ 
        142856, 
        142857, 
        142858, 
        142859
    ],
    avatar : "https://pngimage.net/wp-content/uploads/2018/05/admin-avatar-png-1.png",
    person : 0,
    system : 0,
    profit : 0,
    received : 0,
    box : [],
    history : []
})

db.save(db.user, {
    wizard : {
        identifier : "7214218321",
        fullname : "Nguyen Thanh Loc",
        born : "1997-10-21",
        domicile : "Ha Nam",
        owner : "Nguyen Thanh Loc",
        bank : "Vpbank",
        account : "32562934923",
        branch : "Hà Nội",
        checkStatus : true
    },
    orders : {
        total : 0,
        number : 0,
        carts : []
    },
    id : 142861,
    email : "locnguyen@gmail.com",
    phone : "0936832632",
    firstname : "loc",
    lastname : "nguyen",
    username : "thanhloc",
    password : "$2b$07$4ytQjub2nHC4WcMSri9oL.FQb3hXW8a/7zZ9dvorVTdN7yRejr5yO",
    code : [ 
        142856, 
        142857, 
        142858, 
        142859
    ],
    avatar : "https://pngimage.net/wp-content/uploads/2018/05/admin-avatar-png-1.png",
    person : 0,
    system : 0,
    profit : 0,
    received : 0,
    box : [],
    history : []
})

db.save(db.user, {
    wizard : {
        identifier : "08237127512",
        fullname : "Nguyen Quoc Tuan",
        born : "1992-05-27",
        domicile : "Ha Tinh",
        owner : "Nguyen Quoc Tuan",
        bank : "Agribank",
        account : "65323287323",
        branch : "Hà Nội",
        checkStatus : true
    },
    orders : {
        total : 0,
        number : 0,
        carts : []
    },
    id : 142862,
    email : "tuannguyen@gmail.com",
    phone : "0983243243",
    firstname : "tuan",
    lastname : "nguyen",
    username : "quoctuan",
    password : "$2b$07$4ytQjub2nHC4WcMSri9oL.FQb3hXW8a/7zZ9dvorVTdN7yRejr5yO",
    code : [ 
        142856, 
        142857, 
        142858, 
        142859
    ],
    avatar : "https://pngimage.net/wp-content/uploads/2018/05/admin-avatar-png-1.png",
    person : 0,
    system : 0,
    profit : 0,
    received : 0,
    box : [],
    history : []
})

db.save(db.user, {
    wizard : {
        identifier : "123478732",
        fullname : "Nguyen Lan Huong",
        born : "1998-07-11",
        domicile : "Nam Dinh",
        owner : "Nguyen Lan Huong",
        bank : "MBbank",
        account : "832753923342",
        branch : "Hà Nội",
        checkStatus : true
    },
    orders : {
        total : 0,
        number : 0,
        carts : []
    },
    id : 142863,
    email : "huongnguyen@gmail.com",
    phone : "0913252332",
    firstname : "huong",
    lastname : "nguyen",
    username : "nguyenhuong",
    password : "$2b$07$4ytQjub2nHC4WcMSri9oL.FQb3hXW8a/7zZ9dvorVTdN7yRejr5yO",
    code : [ 
        142857, 
        142858, 
        142859, 
        142861
    ],
    avatar : "https://pngimage.net/wp-content/uploads/2018/05/admin-avatar-png-1.png",
    person : 0,
    system : 0,
    profit : 0,
    received : 0,
    box : [],
    history : []
})