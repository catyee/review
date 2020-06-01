function deepClone(obj) {
    let newObj = {};
    if(obj === null) return obj;
    if(typeof obj === 'function') return new Function(obj);
    if(typeof obj !== 'object') return obj;
    if(obj instanceof Date) return new Date(obj);
    if(obj instanceof RegExp) return new RegExp(obj);
    for(let key in obj) {
        if(obj.hasOwnProperty(key)) {
            newObj[key] = deepClone( obj[key]);
        }
    }
    return newObj;

}
let obj = {
    func: function a() {return 1},
    arr: [1, {name: 'ee'}, 3],
    age: {age: 18}
}
//let newObj = deepClone(obj);
let newObj = JSON.parse(JSON.stringify(obj));
// newObj.age.age = 3
console.log(newObj, 'newwwwww')
console.log(obj, 'olddddddddd')




function deepClone1(obj, hash = new WeakMap()) {
    if(obj == null) return obj;
    if(obj instanceof Date) return new Date(obj);
    if(obj instanceof RegExp) return new RegExp(obj);
    if(typeof obj !== 'object') return obj;
    
}