function getData() {
    return new Promise((resolve, reject) => {
        getD()
    })
}

// Promise
// 特点：状态不受外界影响 三种状态：pending resolved rejected 一旦状态改变就不会再变
// 缺点：无法取消Promise 一旦新建会立即执行 如果不设置回调函数，promise内部抛出的错误，不会反映到外部 pending状态无法得知目前发展到哪个阶段（刚开始还是即将完成）

function Promise(excutor) {
    this.status = 'Pending'
    this.resolvedCallbacks = []
    this.rejectedCallbacks = []
    this.value = ''
    let resolve = (value) => {
        this.status = 'Resolved'
        this.value = value
        for(let i = 0; i< this.resolvedCallbacks.length; i ++ ) {
            this.resolvedCallbacks[i](value)
        }
    }
    let reject = (value) => {
        this.status = 'Rejected'
        this.value = value
        for(let i = 0; i< this.rejectedCallbacks.length; i ++ ) {
            this.rejectedCallbacks[i](value)
        }
    }
    try{
        excutor(resolve,reject)
    }catch(e) {
        reject(e)
    }
}
Promise.prototype.then = function(resolvedCallback, rejectedCallback) {
    if(this.status === 'Pending') {
        return new Promise((resolve, reject) => {
            this.resolvedCallbacks.push(() => {
                try{
                    var x = resolvedCallback(this.value)
                    if(x instanceof Promise) {
                        x.then(resolve, reject)
                    }
                    resolve(x)
                }catch(e) {
                    reject(e)
                }
            })
            this.rejectedCallbacks.push(() => {
              try{
                var x = rejectedCallback(this.value)
                if(x instanceof Promise) {
                    x.then(resolve,reject)
                }
                resolve(x)
              }catch(e) {
                  reject(e)
              }
            })
        })
    }
}