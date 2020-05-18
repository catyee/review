const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'
function Promise(executor) {

    let _this = this
     _this.status = PENDING
     _this.value = undefined
     _this.onResolvedCallbacks = []
     _this.onRejectedCallbacks = []
    try{
        executor(resolve, reject)
    }catch(e) {
        reject(e)
    }
    function  resolve(value) {
        if(_this.status === PENDING) {
            _this.status = RESOLVED
            _this.value = value
            _this.onResolvedCallbacks.forEach(func => {
                func()
            })
        }
    }
    function reject(error) {
        if(_this.status === PENDING) {
            _this.status = REJECTED
            _this.value = error
            _this.onRejectedCallbacks.forEach(func => {
               func()
            })
        }
    }
}
Promise.prototype.then = function(onFullfilled,onRejected) {
    let _this = this
    typeof onFullfilled === 'function'?onFullfilled:function(v) {return v} 
    typeof onRejected === 'function'?onRejected:function(e) {return e} 
    if(_this.status === RESOLVED) {
        return new Promise(function(resolve, reject) {
            let x = onFullfilled(_this.value)
            resolve(x)
        })
    }
    if(_this.status === REJECTED) {
        return new Promise(function(resolve, reject) {
            let x = onRejected(_this.value)
            reject(x)
        })
    }
    if(_this.status === PENDING) {
        return new Promise(function(resolve, reject) {
            _this.onResolvedCallbacks.push(function() {
                let x = onFullfilled(_this.value)
                resolve(x)
            })
            _this.onRejectedCallbacks.push(function() {
                let x = onRejected(_this.value)
                reject(x)
            })
        })
       
    }
}
export default Promise;

