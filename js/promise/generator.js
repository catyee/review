function *gen(a) {
    console.log(1)
    let b = yield a
    console.log(2)
    let c = yield b
    console.log(3)
    return c
}
//import Promise from './promise'
// let it = gen('hh')
// let r1 = it.next('kk') // 传参数无意义
// console.log(r1, 'r1r1r1')
// let r2 = it.next('oo')
// console.log(r2, 'r2r2')
// let r3 = it.next('ll')
// console.log(r3, 'r3r3')
function getData() {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            let a = Math.random()
            if(a > 0.5) {
                resolve(a)
            }else {
                reject(a+ '000')
            }
            
        },2000)
    })
}
getData().then(function(res) {
    console.log(res + 'success')
    return 'hhhhhhha'
}, function(error) {
    console.log(error + 'fail')
}).then(function(v) {
    console.log(v)
})
console.log(a, 'jjjjjjjjjj')
import a from './case'
console.log(a, 'kkkkkkkkkk')