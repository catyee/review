// const Promise = require('./myPromise.js')
// console.log(Promise, 44444444444444)

// let p = new Promise((resolve,reject) => {
//     setTimeout(() => {
//         let a = new Promise((resolve,reject) => {

//         })
//     },1000)
// })
// let p2 = p.then((v) => {
//     console.log(v)
// }, (err) => {
//     console.log(err)
// }).finally(v => {
//     console.log(v)
// })
// setTimeout(() => {
//     console.log(p2, '22222222222')
// },2000)
const pErr = new Promise((resolve, reject) => {
    reject("总是失败");
  });
  
  const pSlow = new Promise((resolve, reject) => {
    setTimeout(resolve, 500, "最终完成");
  });
  
  const pFast = new Promise((resolve, reject) => {
    setTimeout(resolve, 100, "很快完成");
  });
  
  Promise.any([pErr, pSlow, pFast]).then((value) => {
    console.log(value);
    // pFast fulfils first
  })