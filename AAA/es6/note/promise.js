// Promise Promise.all Promise.allSettiled Promise.any Promise.race Promise.reject Promise.resolve

let p1 = new Promise((resolve,reject) => {
    if() {
        resolve()
    }else {
        reject()
    }
})

p1.then(() => {},() => {})

// Promise的特点：状态不受外界影响，三种状态pending，resolved，rejected，一旦状态改变就不会再变
// 缺点：无法取消promise，一旦新建就会立即执行，如果不设置回调函数promise内部抛出的错误不会反映到外部，pending状态无法得知目前发展到哪个阶段(刚开始还是即将完成)

function Promise(excutor) {
    this.status = 'pending'
    this.value = ''
    this.reason = ''
    this.onResolvedCallbacks = []
    this.onRejectedCallback = []

    let resolve = value => {
        if(this.status === 'pending') {
            this.status = 'fullfilled'
            this.value = value
            this.onResolvedCallbacks.forEach(fn => fn())
        }
    }
    let reject = reason => {
        if(this.status === 'pending') {
            this.status = 'rejected'
            this.reason = reason
            this.onRejectedCallback.forEach(fn => fn())
        }
    }
    try{
        excutor(resolve,reject)
    }catch(e) {
        reject(e)
    }
}
Promise.prototype.then = function(onResolved,onRejected) {
    onResolved = typeof onResolved === 'function'?onResolved:v=>v
    onRejected = typeof onRejected === 'function'? onRejected: e=>{
        throw e
    }
    if(this.status === 'resolved') {
        return new Promise((resolve,reject)=> {
            try{
                let x = onResolved(this.data)
                if(x instanceof Promise) {
                    x.then(resolve,reject)
                }
                resolve(x)
            }catch(e) {
                reject(e)
            }
        })
    }
    if(this.status === 'rejected') {
        return new Promise((resolve,reject)=> {
            try{
                let x = onRejected(this.reason)
                if(x instanceof Promise) {
                    x.then(resolve,reject)
                }
                resolve(x)
            }catch(e) {
                reject(e)
            }
        })
    }
    if(this.status === 'pending') {
        return new Promise((resolve,reject) => {
            this.onResolvedCallbacks.push(() => {
                try{
                    let x = onResolved(this.data)
                    if(x instanceof Promise) {
                        x.then(resolve,reject)
                    }
                    resolve(x)
                }catch(e) {
                    reject(e)
                }
            })  
            this.onRejectedCallback.push(() => {
                try{
                    let x = onRejected()
                }catch(e) {
                    reject(e)
                }
            })
        })
    }

}