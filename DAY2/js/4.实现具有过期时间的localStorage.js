/*
 对比 cookie、localStorage、sessionStorage 三者的区别
   @1 存储量、存储周期、稳定性、和服务器通信 等维度
   @2 基于localStorage实现数据缓存
   @3 实现具有过期时间的localStorage「promise版」
 */
const cacheData = function cacheData(query, limit, cacheName) {
  if (typeof limit !== 'number') limit = 60 * 60;
  if (typeof cacheName !== "string") cacheName = 'cache';
  return new Promise(resolve => {
    let cache = localStorage.getItem(cacheName);
    if (cache) {
      cache = JSON.parse(cache);
      if ((+new Date()) - cache.time < limit * 1000) {
        resolve(cache.data);
        return;
      }
    }
    // 没有缓存或者有缓存但是过期了,都需要重新获取数据
    try {
      query().then(value => {
        // 获取结果后:把数据存储起来
        localStorage.setItem(cacheName, JSON.stringify({
          time: +new Date(),
          data: value
        }));
        resolve(value);
      });
    } catch (err) {
      throw new TypeError('query must be an function and return promise');
    }
  });
};

cacheData(() => {
  // 获取数据的方法:query
  return fetch(`./data.json?_=${+new Date()}`).then(response => {
    let {
      status,
      statusText
    } = response;
    if (status >= 200 && status < 400) {
      return response.json();
    }
    return Promise.reject(statusText);
  });
}, 60, 'tempcache').then(value => {
  // 获取结果了
  console.log(value);
});