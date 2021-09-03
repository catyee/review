/*
 * let和var的区别? 
 *   @1 变量提升
 *   @2 重复声明
 *   @3 块级上下文
 *   @4 和GO的关系
 *   .....
 * 
 * const和let的区别?
 *   @1 不能修改赋值指向
 */

/* // let num = 3;
// 改写:
(function () {
    var num = 3;
    console.log(num); //3
})();
console.log(num); //Uncaught ReferenceError: num is not defined */

// const num = 3;
// num = 4; //Assignment to constant variable
// 改写:
var _const = function _const(key, value) {
    window[key] = value;
    Object.defineProperty(window, key, {
        enumerable: false,
        configurable: false,
        get() {
            return value;
        },
        set(newValue) {
            if (newValue !== value) {
                throw new TypeError('Assignment to constant variable');
            }
            return value;
        }
    });
};
_const('num', 3);
console.log(num);
num = 4; //Assignment to constant variable