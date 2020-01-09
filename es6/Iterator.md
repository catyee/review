js原有的表示集合的数据结构主要有数组和对象，es6又添加了Map和Set，这样就有了四种数据集合，用户还可以组合使用它们，定义自己的数据结构，比如数组的成员是Map，Map的成员是对象，这样就需要一种统一的接口机制，来处理不同的数据结构。
遍历器就是这样一种机制，它是一种接口，为各种不同的数据结构提供统一的访问机制，任何数据结构只要部署Iterator接口，就可以完成遍历操作

Iterator作用有三个: 一是为各种数据结构提供一个统一简便的访问接口；二是使得数据结构的成员能够按照某种次序排列；三是ES6提供了一种新的遍历命令for...of循环，Iterator接口主要供for...of消费

Iterator的遍历过程是这样的:
1. 创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上就是一个指针对象
2. 第一次调用指针对象的next方法，可以将指针指向数据结构的第一个成员。
3. 第二次调用指针对象的next方法，指针就指向数据结构的第二个成员。
4. 不断调用指针对象的next方法，直到它指向数据结构的结束位置。
每一次调用next方法，都会返回数据结构的当前成员的信息，具体来说就是返回一个包含value和done两个属性的对象。其中，value属性是当前成员的值，done属性是一个布尔值，表示遍历是否结束
```
    var it = makeIterator(['a','b']);
    it.next() // { value: "a", done: false }
    it.next() // { value: "b", done: false }
    it.next() // { value: undefined, done: true }

  
```

Iterator标准规定，所有部署了key值为[Symbol.iterator]且[Symbol.iterator]的value是标准的Iterator接口函数，该函数必须返回一个对象，且对象中包含next方法，且执行next能返回包含value/done属性的Iterator的对象都称之为可遍历对象
