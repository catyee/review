const PENDING = 'PENDING'
const FULLFILLED = 'FULLFILLED'
const REJECTED = 'REJECTED'
const resolvePromise = (promise2,x,resolve,reject) => {
    if(promise2 === x) {
        throw new TypeError('Chaining circle detected')
    }
    if(typeof x === 'object' && x !== null || typeof x === 'function') {
        let called;// 如果 then 的返回值 x 是一个 promise，且 x 同时调用 resolve 函数和 reject 函数，则第一次调用优先，其他所有调用被忽略；「规范 Promise/A+ 2.3.3.3.3」
        try{
            let then = x.then
            if(typeof then === 'function') {
                then.call(x,y=> {
                    if(called) return
                    called = true
                    resolvePromise(promise2,y,resolve,reject)
                },r => {
                    if(called) return
                    called = true
                    reject(r)
                })
            }else {
                resolve(x)
            }
        }catch(e) {
            if(called) return
            called = true
            reject(e)
        }
    }else {
        resolve(x)
    }
}
class Promise{
    constructor(executor) {
        this.status = PENDING
        this.value = undefined
        this.reason = undefined
        this.onResolvedCallbacks = []
        this.onRejectedCallbacks = []
        let resolve = (v) => {
            if(this.status === PENDING) {
                this.status = FULLFILLED
                this.value = v
                this.onResolvedCallbacks.forEach(fn => fn())
            }
        }
        let reject = (v) => {
            if(this.status === PENDING) {
                this.status = REJECTED
                this.reason = v
                this.onRejectedCallbacks.forEach(fn => fn())
            }
        }
        try{
            executor(resolve,reject)
        }catch(e) {
            reject(e)
        }
    }
    then(onResolved,onRejected) {
        onResolved = typeof onResolved === 'function'?onResolved:value => value
        onRejected = typeof onRejected === 'function'?onRejected:err => {throw err}
        let promise2 = new Promise((resolve,reject)=> {
            if(this.status=== PENDING) {
                setTimeout(() => {
                    try{
                        let x = onResolved(this.value)
                        resolvePromise(promise2,x,resolve,reject)
                    }catch(e) {
                        reject(e)
                    }
                },0)
            }
            if(this.status === REJECTED) {
                setTimeout(() => {
                    try{
                        let x = onRejected(this.reason)
                        resolvePromise(promise2,x,resolve,reject)
                    }catch(e) {
                        reject(e)
                    }
                },0)
            }
            if(this.status === PENDING) {
                this.onResolvedCallbacks.push(() => {
                    setTimeout(() => {
                        try{
                            let x = onResolved(this.value)
                            resolvePromise(promise2,x,resolve,reject)
                        }catch(e) {
                            reject(e)
                        }
                    },0)
                })
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try{
                            let x = onRejected(this.reason)
                            resolvePromise(promise2,x,resolve,reject)
                        }catch(e) {
                            reject(e)
                        }
                    },0)
                })
            }
        })
    }
}