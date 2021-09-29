// const PENDING = 'PENDING'
// const FULLFILLED = 'FULLFILLED'
// const REJECTED = 'REJECTED'

const { reject } = require("../es6/note/手写Promise/myTest/myPromise")

// const resolvePromise = (promise2,x,resolve,reject) => {
//     if(promise2 === x) {
//         throw new TypeError('chaining cycle')
//     }
//     if(typeof x === 'object' && x!== null || typeof x === 'function') {
//         try{
//             let then = x.then
//             if(typeof then === 'function') {
//                 then.call(x,y=> {resolvePromise(promise2,y,resolve,reject)},
//                 r=> {reject(r)})
//             }else {
//                 resolve(x)
//             }

//         }catch(e) {
//             reject(e)
//         }
//     }else {
//         resolve(x)
//     }
// }

// class Promise {
//     constructor(executor) {
//         this.status = PENDING
//         this.value = undefined
//         this.reason = undefined
//         this.resolvedCallbacks = []
//         this.rejectedCallbacks = []
//         const resolve = (value) => {
//             if(this.status === PENDING) {
//                 this.status = FULLFILLED
//                 this.value = value
//                 this.resolvedCallbacks.forEach(fn => fn())
//             }
//         }
//         const reject = (reason) => {
//             if(this.status === PENDING) {
//                 this.status = REJECTED
//                 this.reason = reason
//                 this.rejectedCallbacks.forEach(fn => fn())
//             }
//         }
//         try{
//             executor(resolve,reject)
//         }catch(e) {
//             reject(e)
//         }
//     }

//     then(onFullfilled,onRejected) {
//         onFullfilled = typeof onFullfilled === 'function'?onFullfilled:value => value
//         onRejected = typeof onRejected === 'function'? onRejected:err => {throw err}
//         let promise2 = new Promise((resolve,reject)=>{
//             if(this.status === FULLFILLED) {
//                 setTimeout(() => {
//                    try{
//                     let x = onFullfilled(this.value)
//                     resolvePromise(promise2,x,resolve,reject)
//                    }catch(e) {
//                        reject(e)
//                    }
//                 },0)
//             }
//         })
//         return promise2
//     }
// }
Promise.all = (values)=> {
    return new Promise((resolve,reject) => {
        let index = 0,arr = []
        const processData = (i,data) => {
            arr[i] = data
            if(++index === arr.length){
                resolve(arr)
            }
        }
        for(let i = 0; i < values.length;i++){
            let current = values[i]
            if(current instanceof Promise) {
                current.then((data)=> {
                    processData(i,data)
                },reject)
            }else {
                processData(i,current)
            }
        }
    })
}

Promise.resolve = (value) => {
    return new Promise((resolve,reject)=> {
        if(value instanceof Promise) {
            value.then(
                data => resolve(data),
                reason => reject(reason)
            )
        }else {
            resolve(value)
        }
    })
}

Promise.prototype.catch = (onRejected) => {
    return this.then(null, onRejected)
}

Promise.prototype.finally = (callback) => {
    return this.then((value)=> {
        return Promise.resolve(callback()).then(()=> value)
    },(reason)=>{
        return Promise.resolve(callback()).then(()=> {throw reason})
    })
}

Promise.prototype.finally = (callback)=> {
    return this.then((value)=> {
        return Promise.resolve(callback()).then(()=> value)
    },err=>{
        return Promise.resolve(callback()).then(()=> {throw err})
    })
}

Promise.race = (values) => {
    return new Promise((resolve,reject)=> {
        values.forEach(p=> {
            Promise.resolve(p).then(value => {
                resolve(value)
            })
        },reason => {
            reject(reason)
        })  
    })
}

Promise.prototype.catch = (onRejected) =>{
    return this.then(null,onRejected)
}

Promise.all = (values) => {
    return new Promise((resolve,reject)=> {
        let arr = [],index = 0
        const processData = (i,data) => {
            arr[i] = data
            if(++index === values.length) {
                resolve(arr)
            }
        }
        for(let i = 0; i < values.length; i++){
            let current = values[i]
            if(current instanceof Promise) {
                current.then(data => {
                    processData(i,data)
                },reject)
            }else {
                processData(i,current)
            }
        }
    })
}

Promise.prototype.finally = (callback) => {
    return this.then((value) => {
        return Promise.resolve(callback()).then(()=> value)
    },err => {
        return Promise.resolve(callback()).then(()=> {throw err})
    })
}

Promise.resolve = () => {
    
}