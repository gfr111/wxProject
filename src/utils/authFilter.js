var authenticationUtil = require('authenticationUtil.js')

  //hook page的onShow,
  function authFilter(pageObj) {

    if (pageObj.onShow)
     {
      let _onShow = pageObj.onShow;
      pageObj.onShow = function() {
   
        getApp().globalData.promise.then(() => {
          let currentInstance = getPageInstantce();
          _onShow.call(currentInstance);
        })
      }
     }
     return pageObj
  }

  function getPageInstantce() {
    var pages = getCurrentPages();
    return pages[pages.length - 1];
  }


 


exports.authFilter = authFilter;