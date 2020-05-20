const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
function Promise(executor) {
    let self = this
    self.status = PENDING
    self.value = undefined
    self.onFulfilledCallbacks = []
    self.onRejectedCallbacks = []
    function resolve(value) {
        // todo..............................
        if(value != null && value.then && typeof value.then === 'function'){
           return value.then(resolve,reject)
        }
        setTimeout(function() {
            if(self.status === PENDING) {
                self.status = FULFILLED
                self.value = value
                self.onFulfilledCallbacks.forEach(cb => cb(self.value))
            }
        })
    }
    function reject(value) {
        setTimeout(function() {
            if(self.status === PENDING) {
                self.status = REJECTED
                self.value = value
                self.onRejectedCallbacks.forEach(cb => cb(self.value))
            }
        })
    }
    try{
        executor(resolve,reject)
    }catch(e) {
        reject(e)
    }
}
function resolvePromise(promise2, x, resolve,reject) {
    if(promise2 === x) {
        return reject(new TypeError('循环引用'))
    }
    if(x instanceof Promise) {
        if(x.status === PENDING) {
            x.then(function(y) {
                resolvePromise(promise2,y,resolve,reject)
            },reject)
        }else{
            x.then(resolve,reject)
        }
    }else if(x && ((typeof x === 'function') || (typeof x === 'object'))) {
        let called = false
        let then = x.then;
        try{
            if(typeof then === 'function') {
                if(called) return
                called = true
                then.call(x, function(y) {
                    resolvePromise(promise2,y,resolve,reject)
                }, function(e) {
                    reject(e)
                })
            }else{
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
Promise.prototype.then = function(onFulfilled, onRejected) {
    let self = this
    let promise2
    typeof onFulfilled === 'function' ? onFulfilled : function(value) {return value}
    typeof onRejected === 'function' ? onRejected : function(e) {throw e}
    if(self.status === FULFILLED) {
        return promise2 = new Promise(function(resolve,reject) {
            setTimeout(function() {
                let x = onFulfilled(self.value)
                resolvePromise(promise2,x,resolve, reject)
            })
        })
    }
    if(self.status === REJECTED) {
        return promise2 = new Promise(function(resolve,reject) {
            setTimeout(function() {
                let x = onRejected(self.value)
                resolvePromise(promise2,x,resolve, reject)
            })
        })
    }
    if(self.status === PENDING) {
        return promise2 = new Promise(function(resolve,reject) {
            self.onFulfilledCallbacks.push(function() {
                let x = onFulfilled(self.value)
                resolvePromise(promise2,x,resolve, reject)
            })
            self.onRejectedCallbacks.push(function() {
                let x = onRejected(self.value)
                resolvePromise(promise2,x,resolve, reject)
            })
        })
    }
}