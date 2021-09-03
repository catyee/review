const PENDING = 'PENDING'
const RESOLVED = 'RESOLVED'
const REJECTED = 'REJECTED'
const resolvePromise = (promise2,x,resolve,reject) => {
    if(promise2 === x) throw new TypeError('Chaining cycle')
    if(typeof x === 'object' && x !== null || typeof x === 'function') {
        let called;
        try{
            let then = x.then
            // x是promise
            if(typeof then === 'function') {
                then.call(x,y => {
                    if(called) return
                    called = true
                    resolvePromise(promise2,y,resolve,reject)
                },r => {
                    if(called) return
                    called = true
                    reject(r)
                })
            }else {
                // {then: 1}
                resolve(x) // ???
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
class Promise {
    constructor(executor) {
        this.status = PENDING
        this.value = undefined
        this.reason = undefined
        this.resolvedCallbacks = []
        this.rejectedCallbacks = []
        let resolve = (value) => {
            if(this.status === PENDING) {
                this.value = value
                this.status = RESOLVED
                this.resolvedCallbacks.forEach(fn => fn())
            }
        }
        let reject = (reason) => {
            if(this.status === PENDING) {
                this.reason = reason
                this.status = REJECTED
                this.rejectedCallbacks.forEach(fn => fn())
            }
        }
        try {
            executor(resolve,reject)
        }catch(e) {
            reject(e)
        }
    }
    then(onResolved,onRejected) {
        onResolved = typeof onResolved === 'function'?onResolved: value => value
        onRejected = typeof onRejected === 'function'?onRejected: err => {throw err}
        let promise2 = new Promise((resolve,reject) => {
            if(this.status === RESOLVED) {
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
                         let x = onResolved(this.value)
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
    }
    // catch方法
    catch(onRejected) {
        return this.then(undefined,onRejected)
    }
    
    // finally
    finally(cb) {
        return this.then(value => {
            return Promise.resolve(cb()).then(() => value)
        },err => {
            return Promise.resolve(cb()).then(() => {throw err})
        })
    }
    // Promise.all
    static all(values) {
        return new Promise((resolve,reject) => {
            const arr = []
            let index = 0
            const processData = (key,value) => {
                arr[key] = value
                if(++index === values.length) {
                    resolve(arr)
                }
            }
            for(let i = 0; i < values.length; i++) {
                let current = values[i]
                if(current instanceof Promise) {
                    current.then((data) => {
                        processData(i,data)
                    },reject)
                }else {
                    processData(i,current)
                }
            }
        })
    }

    // Promise.race
    static race(values) {
        return new Promise((resolve,reject) => {
            values.forEach(p => {
                Promise.resolve(p).then(value => {
                    resolve(value)
                }, reason => {
                    reject(reason)
                })
            })
        })
    }
    
    // Promise.resolve
    static resolve(value) {
        return new Promise((resolve,reject) => {
            if(value instanceof Promise) {
                value.then(
                    value => resolve(value),
                    reason => reject(reason))
            }else {
                resolve(value)
            }
        })
    }
    
    // Promise.reject
    static reject(value) {
        return new Promise((resolve,reject) => {
            reject(value)
        })
    }

    // Promise.any
    static any(values) {
        return new Promise((resolve,reject) => {
            let index = 0
            let errs = []
            for(let i = 0; i < values.length; i++) {
                let current = values[i]
                if(current instanceof Promise) {
                    current.then(value => {
                        resolve(value)
                    },reason => {
                        errs.push(reason)
                        if(++index === values.length) {
                            reject(new AggregateError(errs))
                        }
                    })
                }else {
                   resolve(value)
                }
            }
        })
    }

    // Promise.allSettled
    static allSettled(values) {
        return new Promise((resolve,reject) => {
            let length = values.length
            let arr = []
             const cumpute = () => {
                 if(--length === 0) {
                     resolve(arr)
                 }
             }
            function processData(key,value) {
                if(value instanceof Promise) {
                    value.then((data)=> {
                        arr[key] = {status: 'fullfilled',value: data}
                        compute()
                    }, (err) => {
                        arr[key] = {status: 'rejected',reason: err}
                        compute()
                    })
                }else {
                    arr[key] = {status: 'fullfilled',value: data}
                    compute()
                }
            }
            for(let i = 0; i < values.length; i++){
                processData(i,values[i])
            }
        })
    }



  
}

// Promise.all重写,实现失败数量限制
Promise.all = function(values,count) {

    return new Promise((resolve,reject) => {
        let arr = []
        let index = 0
        const processData = (key,value) => {
            arr[key] = value
            if(++index === values.length) {
                resolve(arr)
            }
        }
        for(let i = 0; i < values.length; i++) {
            let current = values[i]
            if(current instanceof Promise) {
                current.then(val => {
                    processData(i,val)
                },reject)
            }else {
                processData(i,current)
            }
        }
    })
    
}

module.exports = Promise