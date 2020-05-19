var promiseUtil = require('promiseUtil.js');
var storageUtil = require('storageUtil.js');
var loginService = require('../service/loginService.js');
var notificationCenter = require('../WxNotificationCenter.js');
var notifConstant = require('notifConstant.js');
var authenticationUtil = (function() {

  // 检查是否有选择场馆，没有跳转到场馆去,
  function checkSelectclub(callback) {
    let selectCenter = wx.getStorageSync('selectCenterKey');
    if (selectCenter) {
      getApp().globalData.selectCenter = selectCenter;
    } else {
      wx.getExtConfig({
        success: res => {
          console.log(res)
          if (res.extConfig.enableParent) {
            loginService.getCenterList().then((res) => {
              var a=0;
              for (var i = 0, len = res.length; i < len; i++) {
                if (res[i].mainCenter) {
                  a=1;
                  getApp().globalData.selectCenter = res[i];
                  wx.setStorageSync('selectCenterKey', res[i]);
                  callback(res[i])
                  return;            
                }
              }
              if(a!=0){
                wx.navigateTo({
                  url: '/pages/centers/centerList',
                });
              }
                })
          }else{
            wx.navigateTo({
              url: '/pages/centers/centerList',
            });
          }
        }
      })
      
     
    }
  }

  // 检查有咩有token,callback回调，没有token不做处理，
  function checkAuth(callback) {
    let token = wx.getStorageSync('tokenKey')
    let account = wx.getStorageSync('account')
    if (token && account) {
      getApp().globalData.token = token
      getApp().globalData.account = wx.getStorageSync('account');
      if (callback) {
        callback(token)
      }
    } else {
      wx.login({
        success:res=>{
          loginService.userLogin(res.code).then(res => {
            if (res.WXAPPCHATID){
              getApp().globalData.token = res.WXAPPCHATID;
              getApp().globalData.openId = res.openId;
              getApp().globalData.account = res.account;
              wx.setStorageSync('tokenKey',res.WXAPPCHATID)
              wx.setStorageSync('openIdKey', res.openId)
              wx.setStorageSync('account', res.account)
            }
            if (callback) {
              callback(res)
            }
          })
        }
      })
  
    }
  }


  //检查本地token, doOther：页面的操作
  // authenticationUtil.checkAuthToken(success == null ? resolve : success, unLogin);
  function checkAuthToken(doOther, unLogin = false) {
    checkExtConfig();
    var selectItem = getApp().globalData.selectCenter
    storageUtil.getToken().then((res) => {
      if (!getApp().globalData.selectCenter) {
        getApp().globalData.selectCenter = selectItem;
      }
      getApp().globalData.token = res.data;
      getApp().globalData.account = wx.getStorageSync("account");
      storageUtil.getUtilOpenId();
      getUserAccount(doOther);
    }, () => {
      tryLogin(doOther, false, unLogin);
    });
  }

  function checkExtConfig() {
    var wxGetExtConfig = promiseUtil.wxPromisify(wx.getExtConfig);
    wxGetExtConfig().then((res) => {
      if (JSON.stringify(res.extConfig) != '{}') {
        getApp().globalData.headCenterId = res.extConfig.parentCenterId;
        getApp().globalData.headCenterName = res.extConfig.centerName;
      }
    });
  }
  //登录
  function tryLogin(doOther, needRedirect = false, unLogin = false) {
    var wxLogin = promiseUtil.wxPromisify(wx.login);
    wxLogin().then((res) => {
      return loginService.userLogin(res.code);
    }).then((res) => {
      console.log(res)
      //正常登录
      if (typeof(res.WXAPPCHATID) != 'undefined') {
        let token = res.WXAPPCHATID;
        let openId = res.openId;
        getApp().globalData.token = token;
        getApp().globalData.openId = openId;
        getApp().globalData.account = res.account;
        storageUtil.saveToken(token);
        wx.setStorageSync('account', res.account)
        storageUtil.saveOpenId(openId);
        checkSelectCenter(doOther, false, needRedirect, false);
      } else //未绑定手机号
      {
        if (!unLogin || getApp().globalData.headCenterId == 1) {
          getApp().globalData.openId = res;
          wx.navigateTo({
            url: '/pages/index/BindPhone',
          });
        } else {
          checkSelectCenter(doOther, false, needRedirect, unLogin);
        }

      }
    });
  }

  //检查本地存的centerInfo
  function checkSelectCenter(doOther, needAccount = false, needRedirect, unLogin = false) {

    storageUtil.getSelectCenter().then((res) => {
      getApp().globalData.selectCenter = res.data;
      if (needAccount && !unLogin) {
        getUserAccount(doOther);
      } else {
        checkAvailable(doOther);
      }
    }, () => {
      //没有就跳转到去选择门店
      if (needRedirect) {
        wx.redirectTo({
          url: '/pages/centers/centerList',
        });
      } else {
        wx.navigateTo({
          url: '/pages/centers/centerList',
        });
      }
    })
  }

  // 获取人的信息
  function getUserAccount(doOther) {
    loginService.getUserAccount().then((res) => {
      getApp().globalData.account = res.account;
      checkAvailable(doOther);
    })
  }

  function checkAvailable(doOther) {
    if (typeof(doOther) == 'function') {
      doOther();
    }
    notificationCenter.postNotificationName(notifConstant.refreshMainPageNotif, {
      name: 'updateCurrent'
    });
  }

  return {
    checkAuthToken: checkAuthToken,
    checkExtConfig: checkExtConfig,
    tryLogin: tryLogin,
    checkSelectclub: checkSelectclub,
    checkAuth: checkAuth
  }

})();

module.exports = authenticationUtil;