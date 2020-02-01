const rankString = (rank) =>{
    switch (rank){
        case 0: return 'Chưa Kích Hoạt'
        case 1: return 'Cộng Tác Viên'
        case 2: return 'Đại Lý Bán Lẻ'
        case 3: return 'Đại Lý Bán Buôn'
        case 4: return 'Đại Lý Cấp 1'
        case 5: return 'Tổng Đại Lý'
        case 6: return 'Nhà Phân Phối'
    }
}

const dashboard = doc => {

    return {
        number: doc.orders.number,
        total: doc.orders.total /1000,
        carts: doc.orders.carts,

        person: doc.person,
        system: doc.system,

        profit: doc.profit,
        agency: doc.agency,

        code: (doc.wizard.checkStatus == true) ? `https://thienminhhungphat.com/signup?code=${doc.id}`: `Chưa kích hoạt !`,

        rank: rankString(doc.rank),

        ch: {amount: doc.ch.amount, revenue: doc.ch.revenue},
        ctv: {amount: doc.ctv.amount, revenue: doc.ctv.revenue},
        dlbl: {amount: doc.dlbl.amount, revenue: doc.dlbl.revenue},
        dlbb: {amount: doc.dlbb.amount, revenue: doc.dlbb.revenue},
        dlcm: {amount: doc.dlcm.amount, revenue: doc.dlcm.revenue},
        tdl: {amount: doc.tdl.amount, revenue: doc.tdl.revenue},
        npp: {amount: doc.npp.amount, revenue: doc.npp.revenue},
    }
}


// rank: {type: Number, default: 0},
// agency: {type: Number, default: 0},

// ch: {amount: {type: Number, default: 0}, revenue: {type: Number, default: 0}},
// ctv: {amount: {type: Number, default: 0}, revenue: {type: Number, default: 0}},
// dlbl: {amount: {type: Number, default: 0}, revenue: {type: Number, default: 0}},
// dlbb: {amount: {type: Number, default: 0}, revenue: {type: Number, default: 0}},
// dlcm: {amount: {type: Number, default: 0}, revenue: {type: Number, default: 0}},
// tdl: {amount: {type: Number, default: 0}, revenue: {type: Number, default: 0}},
// npp: {amount: {type: Number, default: 0}, revenue: {type: Number, default: 0}},
