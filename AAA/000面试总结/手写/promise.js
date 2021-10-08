const PENDING = 'PENDING'
const FULLFILLED = 'FULLFILLED'
const REJECTED = 'REJECTED'

const resolvePromise = (promise2,x,resolve,reject) => {
    if(promise2 === x) {throw new TypeError('chaining cycle detected')}
    if(typeof x === 'function' && x!== null || typeof x === 'function') {
        let called
        try {
            let then = x.then
            if(typeof then === 'function') {
                then.call(x, y=> {
                    if(called) return
                    called = true
                    resolvePromise(promise2,y,resolve,reject)
                },r=> {
                    if(called) return
                    called = true
                    reject(r)
                })
            }else{
                if(called) return
                called = true
                resolve(x)
            }
        } catch (e) {
            if(called) return
            called = true
            reject(e)
        }

    }else{
        resolve(x)
    }
}

class Promise {
    constructor(executor) {
        this.value = undefined
        this.reason = undefined
        this.status = PENDING
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
        onRejected = typeof onRejected === 'function'?onRejected: err => {throw err}
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
                        let x = onRejected(this.reason)
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
                            let x = onFullfilled(this.value)
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

    catch(onRejected) {
        return this.then(undefined,onRejected)
    }
    finally(cb) {
        return this.then((value) =>{
            return Promise.resolve(cb()).then(() => value)
        },(err) => {
            return Promise.resolve(cb()).then(() => {throw err})
        })
    }

    static resolve(value) {
        return new Promise((resolve,reject) => {
            if(value instanceof Promise) {
                value.then((v) => {
                    resolve(v)
                },r => {
                    reject(r)
                })
            }else {
                resolve(value)
            }
        })
    }

    static reject(value) {
        return new Promise((resolve,reject) => {
            reject(value)
        })
    }

    static all(values) {
        return new Promise((resolve,reject) => {
            let index = 0,
                result = []
            const processData = (i,data) => {
                result[i] = data
                if(++index === values.length) {
                    resolve(result)
                }
            }
            for(let i = 0; i < values.length; i++) {
                let current = values[i]
                if(current instanceof Promise) {
                    current.then((v) => {
                        processData(i,v)
                    },reject)
                }else{
                    processData(i,current)
                }
            }
        })
    }

    static race(values) {
        return new Promise((resolve,reject) => {
            values.forEach(p => {
                Promise.resolve(p).then(value => {
                    resolve(value)
                },err => {
                    reject(err)
                })
            })
        })
    }

    static any(values) {
        return new Promise((resolve,reject) => {
            let errArr = [],index = 0
            values.forEach(p => {
                if(p instanceof Promise) {
                    p.then(value => {
                        resolve(value)
                    },err => {
                        errArr.push(err)
                        if(++index === values.length) {
                            reject(errArr)
                        }
                    })
                }else {
                    resolve(p)
                }
            })
        })
    }

    static allSettled(values) {
        return new Promise((resolve,reject) => {
            let resultArr = [], index = 0
            const processData = (i,data) => {
                resultArr[i] = data
                if(++index === values.length) {
                    resolve(resultArr)
                }
            }
            for(let i = 0; i < values.length; i++) {
                let current = values[i]
                if(current instanceof Promise) {
                    current.then(value => {
                        processData(i, {status: 'fullfilled',value:value})
                    },err => {
                        processData(i, {status: 'rejected',reason:err})
                    })
                }else{
                    processData(i, {status: 'fullfilled',value:current})
                }
            }
        })
    }
}