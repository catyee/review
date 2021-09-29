# 1. js实现symbol
- Symbol值可以通过Symbol()函数生成
var s = Symbol('s')

- Symbol函数，不能使用new 命令

- typeof s // "symbol"

- s instanceof Symbol  // false

- Symbol函数接受一个字符串作为参数，表示对Symbol实例的描述

- Symbol参数如果是一个对象，就会调用该对象的toString方法，将其转换成字符串，然后生成一个Symbol值

- Symbol 函数的参数只是表示对当前 Symbol 值的描述，相同参数的 Symbol 函数的返回值是不相等的。

-  Symbol 值不能与其他类型的值进行运算，会报错。

-  Symbol 值可以显式转为字符串。
var sym = Symbol('My symbol');

console.log(String(sym)); // 'Symbol(My symbol)'
console.log(sym.toString()); // 'Symbol(My symbol)'


- Symbol 值可以作为标识符，用于对象的属性名，可以保证不会出现同名的属性。

- Symbol 作为属性名，该属性不会出现在 for...in、for...of 循环中，也不会被 Object.keys()、Object.getOwnPropertyNames()、JSON.stringify() 返回。但是，它也不是私有属性，有一个 Object.getOwnPropertySymbols 方法，可以获取指定对象的所有 Symbol 属性名。

- 如果我们希望使用同一个 Symbol 值，可以使用 Symbol.for。它接受一个字符串作为参数，然后搜索有没有以该参数作为名称的 Symbol 值。如果有，就返回这个 Symbol 值，否则就新建并返回一个以该字符串为名称的 Symbol 值。

- Symbol.keyFor 方法返回一个已登记的 Symbol 类型值的 key。



// 第一版
(function() {
    var root = this;

    var SymbolPolyfill = function Symbol(description) {

        // 实现特性第 2 点：Symbol 函数前不能使用 new 命令
        if (this instanceof SymbolPolyfill) throw new TypeError('Symbol is not a constructor');

        // 实现特性第 5 点：如果 Symbol 的参数是一个对象，就会调用该对象的 toString 方法，将其转为字符串，然后才生成一个 Symbol 值。
        var descString = description === undefined ? undefined : String(description)

        var symbol = Object.create(null)

        Object.defineProperties(symbol, {
            '__Description__': {
                value: descString,
                writable: false,
                enumerable: false,
                configurable: false
            }
        });

        // 实现特性第 6 点，因为调用该方法，返回的是一个新对象，两个对象之间，只要引用不同，就不会相同
        return symbol;
    }

    root.SymbolPolyfill = SymbolPolyfill;
})();



# 2. js实现let
特点：
- 在块级作用域有效
- 不能重复声明
- 不存在变量提升，即未声明之前不能调用

用匿名函数的作用域来模拟块级作用域，将用到let的代码放到匿名函数中，就不会造成变量污染了
(function() {
    var c = 3
    console.log(c)
})()
console.log(c)

# 3. js实现const
特点：
- 在块级作用域有效
- 不能重复声明
- 不存在变量提升

function _const(key,value) {
    window[key] = value
    Object.defineProperty(window,key, {
        enumerable: false,
        configurable: false;
        get: function() {
            return value
        }
        set: function(newValue) {
            if (newValue !== value) {
                throw TypeError("这是只读变量，不可修改");
            } else {
                return value;
            }
        }
    })
}