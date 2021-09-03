// 验证是否为promise实例
var isPromise = function isPromise(x) {
    if (x !== null && /^(object|function)$/.test(typeof x)) {
        // 这是一个对象
        var then;
        try {
            then = x.then;
        } catch (err) {
            return false;
        }
        if (typeof then === 'function') return true;
    }
    return false;
};

Promise.all = function all(promises) {
    if (!Array.isArray(promises)) throw new TypeError('promises must be an array');
    var n = 0,
        values = [];
    return new Promise(function (resolve, reject) {
        for (var i = 0; i < promises.length; i++) {
            (function (i) {
                var promise = promises[i];
                if (!isPromise(promise)) promise = Promise.resolve(promise);
                promise.then(function onfulfilled(value) {
                    // 当前实例是成功的
                    n++;
                    values[i] = value;
                    // 都成功了
                    if (n >= promises.length) resolve(values);
                }).catch(function onrejected(reason) {
                    // 一个失败整体就是失败
                    reject(reason);
                });
            })(i);
        }
    });
};

Promise.allLimit = function allLimit(promises, limit) {
    if (!Array.isArray(promises)) throw new TypeError('promises must be an array');
    limit = +limit;
    if (isNaN(limit)) limit = 1;
    if (limit < 1 || limit > promises.length) throw new RangeError('limit invalid');
    var n = 0,
        m = 0,
        values = [],
        reasons = [];
    return new Promise(function (resolve, reject) {
        for (var i = 0; i < promises.length; i++) {
            (function (i) {
                var promise = promises[i];
                if (!isPromise(promise)) promise = Promise.resolve(promise);
                promise.then(function onfulfilled(value) {
                    n++;
                    values[i] = value;
                    reasons[i] = null;
                    if (n >= promises.length) resolve(values);
                }).catch(function onrejected(reason) {
                    m++;
                    reasons[i] = reason;
                    if (m === limit) {
                        // 失败
                        reject(reasons);
                    } else {
                        n++;
                        values[i] = null;
                        if (n >= promises.length) resolve(values);
                    }
                });
            })(i);
        }
    });
};


//==================
let p1 = new Promise(resolve => {
    setTimeout(() => {
        resolve(1);
    }, 2000);
});
let p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject(2);
    }, 1000);
});
let p3 = Promise.resolve(3);
let p4 = Promise.reject(4);
let p5 = 5;

Promise.allLimit([p1, p2, p3, p4, p5], 2).then(values => {
    // 集合中所有promise实例都是成功整体才是成功
    //   + 集合中有一个非promise实例，默认会处理为成功的promise，值还是这个值
    //   + values按照之前集合的顺序,存储peomise成功的结果
    console.log(values);
}).catch(reason => {
    // 只有有一个实例，则整体直接失败，后续没处理完的也不再处理了
    console.log(reason);
});