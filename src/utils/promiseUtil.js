var promiseUtil = (function () {
  function wxPromisify(fn) {
    return function (obj = {}) {
      return new Promise((resolve, reject) => {
        obj.success = function (res) {
          resolve(res)
        };
        obj.fail = function (err) {
          reject(err.errMsg)
        };
        fn(obj);
      });
    };
  }
  return {
    wxPromisify: wxPromisify
  }
})();





module.exports = promiseUtil;
