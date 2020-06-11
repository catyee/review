let MyPromise = require('./promise')
let p1 = new MyPromise(function(resolve,reject) {
    setTimeout(function() {
        let num = Math.random()
        if(num < .5) {
            resolve(num)
        }else {
            reject('失败')
        }
    },1000)
})
p1.then(function(data) {
    console.log(data)
}, function(err) {
    console.error(err)
})

var a = {
    name: 'xxx'
}
export default a;