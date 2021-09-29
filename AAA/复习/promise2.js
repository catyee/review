
const PENDING = 'PENDING'
const FULLFILLED = 'FULLFILLED'
const REJECTED = 'REJECTED'

const resolvePromise = (promise2,x,resolve,reject) => {
    if(promise2 === x) {
        throw new TypeError('chaning cycle detected')
    }
    let called;
    if(typeof x === 'object' && x!== null || typeof x === 'function') {
        try{
            let then = x.then
            if(typeof then === 'function') {
                then.call(x,y=> {
                    if(called) return
                    called = true
                    resolvePromise(promise2,y,resolve,reject)
                },r=> {
                    if(called) return
                    called = true
                    reject(r)
                })
            }else {
                  // 如果 x.then 是个普通值就直接返回 resolve 作为结果  Promise/A+ 2.3.3.4
                resolve(x)
            }
        }catch(e) {
            if(called) return
            called = true
            reject(e)
        }
    }else {
            // 如果 x 是个普通值就直接返回 resolve 作为结果  Promise/A+ 2.3.4  
        resolve(x)
    }
}
class Promise {
    constructor(executor) {
        this.status = PENDING
        this.reason = undefined
        this.value = undefined
        this.resolvedCallbacks = []
        this.rejectedCallbacks = []
        const resolve = (value) => {
            if(this.status === PENDING) {
                this.status = FULLFILLED
                this.value = value
                this.resolvedCallbacks.forEach(fn => fn())
            }
        }
        const reject = (reason) => {
            if(this.status === PENDING) {
                this.status = REJECTED
                this.reason = reason
                this.rejectedCallbacks.forEach(fn => fn())
            }
        }
        try{
            executor(resolve,reject)
        }catch(e) {
            reject(e)
        }
    }
    then(onFullfilled,onRejected) {
        onFullfilled = typeof onFullfilled === 'function'?onFullfilled: value => value
        onRejected = typeof onRejected === 'function'?onRejected:err => {throw new Error(err)}
        let promise2 = new Promise((resolve,reject) => {
            if(this.status === FULLFILLED) {
                setTimeout(() => {
                    try{
                        let x = onFullfilled(this.value)
                        resolvePromise(promise2,x,resolve,reject)
                    }catch(e) {
                        reject(e)
                    }
                },0)
            }
            if(this.status === REJECTED) {
                setTimeout(() => {
                    try{
                        let x = onRejected(this.value)
                        resolvePromise(promise2,x,resolve,reject)
                    }catch(e) {
                        reject(e)
                    }
                },0)
            }
            if(this.status === PENDING) {
                this.resolvedCallbacks.push(() => {
                    setTimeout(() => {
                        try{
                            let x = onFullfilled(this.value)
                            resolvePromise(promise2,x,resolve,reject)
                        }catch(e) {
                            reject(e)
                        }
                    },0)
                })

                this.rejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try{
                            let x = onRejected(this.value)
                            resolvePromise(promise2,x,resolve,reject)
                        }catch(e) {
                            reject(e)
                        }
                    },0)
                })
            }
        })
        return promise2
    }
}