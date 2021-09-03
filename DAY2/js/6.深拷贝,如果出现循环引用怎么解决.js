let obj = {
    name: 'zhufeng',
    age: 12,
    boo: true,
    n: null,
    m: undefined,
    sy: Symbol('xx'),
    big: 10n,
    child: {
        ele: 'body',
        x: 100
    },
    arr: [10, 20, 30],
    reg: /^\d+$/,
    fn: function () {
        console.log(this.name);
    },
    time: new Date(),
    err: new Error()
};
// obj.obj = obj;