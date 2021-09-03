/*
  方案一：常规实现 getBoundingClientRect + onscroll + throttle
  方案二：终极方案 IntersectionObserver
  方案三：未来设想 img.loading=lazy
 */

/* // 函数节流
const clearTimer = function clearTimer(timer) {
    if (timer) clearTimeout(timer);
    return null;
};
const throttle = function throttle(func, wait) {
    if (typeof func !== 'function') throw new TypeError('func is not a function~');
    if (typeof wait !== 'number') wait = 300;
    let timer = null,
        previous = 0;
    return function operate(...params) {
        let now = +new Date(),
            remaining = wait - (now - previous),
            result;
        if (remaining <= 0) {
            result = func.call(this, ...params);
            previous = +new Date();
            timer = clearTimer(timer);
        } else if (!timer) {
            timer = setTimeout(() => {
                func.call(this, ...params);
                previous = +new Date();
                timer = clearTimer(timer);
            }, remaining);
        }
        return result;
    };
};

(function () {
    let box = document.querySelector('.box'),
        boxImg = box.querySelector('img'),
        HTML = document.documentElement;

    // 实现图片延迟加载
    const lazyImage = function lazyImage() {
        console.log('OK');
        if (boxImg.isLoad) return;
        let {
            bottom,
            top
        } = box.getBoundingClientRect();
        if (bottom <= HTML.clientHeight && top >= 0) {
            // 盒子完全出现在视口中：加载真实的图片
            boxImg.isLoad = true;
            boxImg.src = boxImg.getAttribute('data-img');
            boxImg.onload = () => {
                // 加载成功
                boxImg.style.opacity = 1;
            };
        }
    };

    lazyImage();
    // window.addEventListener('scroll', lazyImage); //默认情况下，页面滚动过程中，scroll事件每间隔5ms左右就会触发一次，这样频率太高了!!
    window.addEventListener('scroll', throttle(lazyImage));
})(); */


(function () {
    let box = document.querySelector('.box'),
        boxImg = box.querySelector('img');
    let ob = new IntersectionObserver(changes => {
        // changes[0]:监听的第一个元素和可视窗口的交叉信息
        let {
            isIntersecting,
            target
        } = changes[0];
        if (isIntersecting) {
            // 完全出现
            boxImg.src = boxImg.getAttribute('data-img');
            boxImg.onload = () => boxImg.style.opacity = 1;
            ob.unobserve(target);
        }
    }, {
        // 控制完全出现在视口中才触发
        threshold: [1]
    });
    ob.observe(box);
})();