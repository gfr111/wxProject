var constant = require('constant.js');
var promiseUtil = require('promiseUtil.js');

var storageUtil = (function () {


  var getSavedValue = promiseUtil.wxPromisify(wx.getStorage);


  function saveToken(token) {
    wx.setStorage({
      key: constant.tokenKey,
      data: token,
    });
  }

  function saveOpenId(openId) {
    wx.setStorage({
      key: constant.openIdKey,
      data: openId,
    });
  }

  function saveSelectCenter(info) {
    wx.setStorage({
      key: constant.selectCenterKey,
      data: info,
    });
  }

  function getToken() {
    return getSavedValue({key:constant.tokenKey});
  }

  function getUtilOpenId() {
    var app = getApp();
    wx.getStorage({
      key: constant.openIdKey,
      success: function(res) {
        if (typeof (app.globalData) != 'undefined') 
        {
         app.globalData.openId = res.data;
        }
      },
    })
    // return getSavedValue({key:constant.openIdKey});
    // .then((res) => {
    //   getApp().globalData.openId = res.data;
    // });
  }

  function getSelectCenter() {
    return getSavedValue({key: constant.selectCenterKey});
  }

  function removeToken() {
    return wx.removeStorage({
      key: constant.tokenKey,
      success: function(res) {
        console.log('did remove token from storage');
      },
    })
  }

  return {
    saveToken: saveToken,
    saveOpenId: saveOpenId,
    saveSelectCenter: saveSelectCenter,
    getToken: getToken,
    getUtilOpenId: getUtilOpenId,
    getSelectCenter: getSelectCenter,
    removeToken:removeToken
  }



})();

module.exports = storageUtil;