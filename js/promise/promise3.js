import { reject } from "./promise2";

const PENDING = 'pending';
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
function Promise(executor) {
    let self = this
    self.status = PENDING
    self.value = undefined
    self.onResolvedCallbacks = []
    self.onRejectedCallbacks = []
    function resolve(value) {
        if(value !== null && value.then && typeof value.then === 'function') {
            return value.then(resolve, reject)
        }
        setTimeout(function() {
            if(self.status === PENDING) {
                self.status = FULFILLED
                self.value = value
                self.onResolvedCallbacks.forEach(function(cb) {
                    cb(self.value)
                })
            }
        })
    }
    function reject(reason) {
        setTimeout(function() {
            if(self.status === PENDING) {
                self.status = REJECTED
                self.value = reason
                self.onRejectedCallbacks.forEach(function(cb) {
                    cb(self.value)
                })
            }
        });
    }
    try{
        executor(resolve, reject)
    }catch(e) {
        reject(e)
    }

}
function resolvePromise(promise2, x, resolve, reject) {
    if(promise2 === x) {
        return reject(new TypeError('循环引用'))
    }
    let called = false // promise2是否已经resolve或reject了
    if(x instanceof Promise) {
        if(x.status === PENDING) {
            x.then(function(y){
                resolvePromise(promise2,y,resolve,reject)
            }, reject)
        }else {
            x.then(resolve, reject)
        }
    }else if(x !== null && ((typeof x === 'object' || typeof x === 'function'))) {
        try{
            let then = x.then
            if(typeof then === 'function') {
                then.call(x, function(y) {
                    if(called) return
                    called = true
                    resolvePromise(promise2,y,resolve,reject)
                }, function(err) {
                    if(called) return
                    called = true
                    reject(err)
                })
            }else{
                resolve(x)
            }
        }catch(e) {
            if(called) return
            called = true
            reject(e)
        }
    }else{
        resolve(x)
    }
}