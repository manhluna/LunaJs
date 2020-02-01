const getRank = (ds, level) => {
    // level.forEach((item)=>{
    //     if (ds < item.limit) {
    //         return item
    //         break
    //     }
    // })

}
const xx = [ { label: 'ctv',
text: 'Cộng Tác Viên',
limit: 4000000,
coe: 0 },
{ label: 'dlbl',
text: 'Đại Lý Bán Lẻ',
limit: 40000000,
coe: 0.05 },
{ label: 'dlbb',
text: 'Đại Lý Bán Buôn',
limit: 200000000,
coe: 0.1 },
{ label: 'dlcm',
text: 'Đại Lý Cấp Một',
limit: 400000000,
coe: 0.15 },
{ label: 'tdl',
text: 'Tổng Đại Lý',
limit: 2000000000,
coe: 0.2},
{ label: 'npp',
text: 'Nhà Phân Phối',
limit: 10000000000,
coe: 0.3 } ]

console.log(getRank(0,xx))