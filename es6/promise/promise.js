class Promise {
    constructor(executor) {
        this.status = 'pending'
        this.value = null
        this.reason = null
        this.fullfilledCallbacks = []
        this.rejectedCallbacks = []
        let resolve = (v) => {
            if (this.status === 'pending') {
                this.status = 'fullfilled'
                this.value = v
                this.fullfilledCallbacks.forEach((cb) => {
                    cb && cb(this.value)
                })
            }
        }
        let reject = (v) => {
            if (this.status === 'pending') {
                this.status = 'rejected'
                this.reason = v
                this.rejectedCallbacks.forEach((cb) => {
                    cb && cb(this.reason)
                })
            }
        }
        try {
            executor(resolve, reject)
        } catch (e) {
            reject(e)
        }
    }
    then(onFullfilled, onRejected) {
        onFullfilled = typeof onFullfilled === 'function' ? onFullfilled : (v) => { return v }
        onRejected = typeof onRejected === 'function' ? onRejected : (e) => { throw e }
        if (this.status === 'pending') {
            return new Promise((resolve, reject) => {
                this.fullfilledCallbacks.push(() => {
                    let x = onFullfilled(this.value)
                    if (x instanceof Promise) {
                        x.then(resolve, reject)
                    }
                    resolve(x)
                })
                this.rejectedCallbacks.push(() => {
                    let x = onRejected(this.reason)
                    if (x instanceof Promise) {
                        x.then(resolve, reject)
                    }
                    resolve(x)
                })
            })
        }
        if (this.status === 'fullfilled') {
            return new Promise((resolve, reject) => {
                let x = onFullfilled(this.value)
                if (x instanceof Promise) {
                    x.then(this.value)
                }
                resolve(x)
            })
        }
        if (this.status === 'rejected') {
            return new Promise((resolve, reject) => {
                let x = onRejected(this.reason)
                if (x instanceof Promise) {
                    x.then(this.value)
                }
                resolve(x)
            })
        }
    }
    catch(onRejected) {
        return this.then(null, onRejected)
    }
    // finally 表示不是最终的意思，而是无论如何都会执行的意思。 如果返回一个 promise 会等待这个 promise 也执行完毕。如果返回的是成功的 promise，会采用上一次的结果；如果返回的是失败的 promise，会用这个失败的结果，传到 catch 中。
    finally(callback) {
        return this.then((v) => {
            return Promise.resolve(callback()).then(() => v)
        }, (reason) => {
            return Promise.resolve(callback()).then(() => { throw reason })
        })
    }
    static resolve(data) {
        return new Promise((resolve, reject) => {
            resolve(data);
        })
    }
    static reject(reason) {
        return new Promise((resolve, reject) => {
            reject(reason);
        })
    }

    static all(values) {
        if(!Array.isArray(values)) {
            return new TypeError('参数应为数组类型')
        }
        return new Promise((resolve, reject) => {
            let resultArr = []
            let orderIndex = 0
            const processResultByKey = (value, index) => {
                resultArr[index] = value
                if(++orderIndex === values.length) {
                    resolve(resultArr)
                }
            }
            for(let i = 0; i < values.length; i++) {
                let value = values[i]
                if(value && typeof value.then === 'function'){
                    value.then((value)=> {
                        processResultByKey(value,i)
                    },reject)
                }else{
                    processResultByKey(value, i)
                }
            }
        })
    }
    static race(promises) {
        return new Promise((resolve, reject) => {
            for(let i = 0; i < promises.length; i ++) {
                let val = promises[i]
                if(val && typeof val.then === 'function') {
                    val.then(resolve,reject)
                }else{
                    resolve(val)
                }
            }
        })
    }

}
let p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('ok1');
    }, 1000);
  })
  
  let p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('ok2');
    }, 1000);
  })
  
  Promise.all([1,2,3,p1,p2]).then(data => {
    console.log('resolve', data);
  }, err => {
    console.log('reject', err);
  })
  // resolve,[ 1, 2, 3, 'ok1', 'ok2' ]