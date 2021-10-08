Function.prototype.call = function(context,...args) {
    context = context || window
    context.fn = this
    let result = context.fn(...args)
    delete context.fn
    return result
}
Function.prototype.apply = function(context,args) {
    context = context || window
    context.fn = this
    let result = context.fn(...args)
    delete context.fn
    return result
}
Function.prototype.bind = function(context,...args) {
    context = context || window
    context.fn = this
   return function(...newArg) {
    let arguments = [...args,...newArg]

    let result = context.fn(...args)
    delete context.fn
    return result
   }
}

function _new(func,...args) {
    let obj = Object.create(func.prototype)
    let result = func.call(obj,...args)
    if(typeof result === 'object' && result !== null || typeof result === 'function'){
        return result
    }
    return obj
}


// 节流和防抖

// 防抖 n秒内只执行一次
// 隔一段时间后执行回调，如果在这段时间内再次触发，则重新计时
// 一般用于输入框输入
// window.resize，scroll事件，不断调整浏览器窗口大小或滚动，等其操作停顿几秒后触发
function debounce(func,delay) {
    return function(...args) {
        if(func.id) {
            window.clearTimeout(func.id)
        }
        func.id = window.setTimeout(() => {
            func.call(this,...args)
        },delay)
    }
}

function debounce(func,delay) {
    delay = delay || 300
    return function(...args) {
        if(func.id) {
            window.clearTimeout(func.id)
        }
        func.id = window.setTimeout(() => {
            func.call(this,...args)
        },delay)
    }
}


// 节流
// 每隔n秒触发一次
// 鼠标连续点击 页面无限加载滚动 而不是停下滚动时候

function throttle(func,delay) {
    delay = delay || 300
    let timer = null,previous = 0
    return function(...args) {
        let now = +new Date(),
        remaining = delay - (now - previous),
        result;
        if(remaining <= 0){
            result = func.call(this,...args)
            previous = +new Date()
            timer = clearTimeout(timer)
        }else if(!timer) {
            timer = setTimeout(() => {
                result = func.call(this,...args)
                previous = +new Date()
                timer = clearTimeout(timer)
            },remaining)
        }
        return result
    }
}


function throttle(func,delay) {
    delay = delay || 300
    let timer = null,previous = 0
    return function(...args) {
        let now = +new Date(),result,remaining = delay - (now - previous)
        if(remaining <= 0){
            result = func.call(this,...args)
            timer = window.clearTimeout(timer)
            previous = +new Date()
        }else if(!timer) {
            timer = window.setTimeout(() => {
                result = func.call(this,...args)
                timer = window.clearTimeout(timer)
                previous = +new Date()
            },remaining)
        }
    }
}

function throttle(func,delay) {
    delay = delay || 300
    let previous = 0,timer = null
    return function(...args) {
        let now = +new Date(), remaining = delay - (now - previous)
        if(remaining <= 0) {
            func.call(this,...args)
            timer = window.clearTimeout(timer)
            previous = +new Date()
        }else if(!timer) {
            timer = window.setTimeout(() => {
                func.call(this,...args)
                timer = window.clearTimeout(timer)
                previous = +new Date()
            },remaining)
        }
    }
}

// 区别 
// 事件持续触发的时候，如果还没有到达等待的时间，防抖的回调将一直被推迟，可能不会执行
// 节流则每个n秒执行一次




// 图片懒加载
1. img.offsetTop - scrollTop < clientHeight

function getTop(e) {
    var T = e.offsetTop
    while(e = e.offsetParent) {
        T+= e.offsetTop
    }
    return T
}

2. getBoundingClientRect
返回元素的大小以及其相对于视口的位置

bottom < clinetHeight && top > 0

3. IntersectionObserver
异步观察目标元素与其祖先元素或文档视窗交叉状态的方法
