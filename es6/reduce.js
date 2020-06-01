

//****************************************** */
let test1 = [[0,1],[2,3],[4,5]];
let test2 = [0,[1,[2,[3,[4,[5]]]]]]

// function flatten (arr) {
//    return arr.reduce((pre, val) => {
//        return  pre.concat(Array.isArray(val) ? flatten(val) : val)
       
//     },[])
// }
// const flatten = arr => arr.reduce((pre, val) => pre.concat(Array.isArray(val) ? flatten(val) : val), []);

function flatten(arr) {
    return arr.reduce((pre, val) => {
        if(Array.isArray(val)) {
            // [].concat()
            return pre.concat(flatten(val))
        }
        return pre.concat(val)
    }, [])
}

console.log(flatten(test2), 'test1')