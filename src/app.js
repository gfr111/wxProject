var authenticationUtil = require('utils/authenticationUtil.js');
var storageUtil = require('utils/storageUtil.js');
var notificationCenter = require('WxNotificationCenter.js');
var notifConstant = require('utils/notifConstant.js');
var constant = require('utils/constant.js');
var requestUtil = require('utils/requestUtil.js');
var configs = require('./config.js')
// require('./page-extend')
// wx2fe2b278af60777f  菠菜+本菜

// wx094d832789ba2494   第三方模板

require('lib/wxpage.js').A({
  config: {
    route: '/pages/$page'
  },

  onLaunch: function() {
    authenticationUtil.checkExtConfig();
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(res => {
      // 请求完新版本信息的回调
      // console.log(res.hasUpdate)
    })
    // 下载新版本
    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 重启应用
            updateManager.applyUpdate()
          }
        }
      })
    })
    // 新版本下载失败
    updateManager.onUpdateFailed(res => {})



  },


  onShow: function(options) {
    this.globalData.isAppOnShow = true;
    //从小程序列表里打开上次浏览的页面，通知必要页面刷新数据
    this.getAuthTokenAndInfo();
    let s = wx.getExtConfigSync()
    // console.log(s)
  },

  //登录相关
  checkAuthToken: function(success = null, unLogin = false) {
    var p = new Promise(function(resolve, reject) {
      authenticationUtil.checkAuthToken(success == null ? resolve : success, unLogin);
    })
    this.globalData.promise = p;
  },


  getAuthTokenAndInfo: function() {
    var that = this;
    if (typeof(that.globalData) != 'undefined') {
      if (!that.globalData.token) {
        //去缓存中取token
        storageUtil.getToken().then((res) => {
          that.globalData.token = res.data;
          notificationCenter.postNotificationName(notifConstant.refreshReservationListNotif, {
            name: "refreshListUpdateStatus"
          });
        }, () => {})
      } else {
        notificationCenter.postNotificationName(notifConstant.refreshReservationListNotif, {
          name: "refreshListUpdateStatus"
        });
      }

      if (!that.globalData.openId) {
        //缓存中取openId
        that.getAppOpenId();
      }

      if (!that.globalData.selectCenter) {
        storageUtil.getSelectCenter().then((res) => {
          that.globalData.selectCenter = res.data;
        }, () => {});
      }
    }
  },

  getAppOpenId: function() {
    var that = this;
    wx.getStorage({
      key: constant.openIdKey,
      success: function(res) {
        if (typeof(that.globalData) != 'undefined') {
          that.globalData.openId = res.data;
        }
      }
    })
  },
  nologincenterInfo(centerId = null, callback) {
    // 先检查用户是否登录，没有登录给test token，有就直接给selectCenter
    authenticationUtil.checkAuth(res => {
      var url = configs.nologincenterInfo(centerId)
      requestUtil.getRequest(url).then(res => {
        if (!this.globalData.token && !this.globalData.testToken && res.testToken) {
          this.globalData.testToken = res.testToken
        }
        this.globalData.selectCenter = res.center
        storageUtil.saveSelectCenter(res.center);
        if (callback) {
          callback(res)
        }
      })
    })
  },
  // 会员与教练绑定
  getbind(data) {
    var url = config.getbind(data[0], data[2])
    requestUtil.postRequest(url).then(res => {
      wx.removeStorageSync('actscan')
    })
  },

  globalData: {
    account: null,
    token: null,
    testToken: null, //游客(即未登录)的虚拟令牌
    selectCenter: null,
    openId: null,
    headCenterId: 1,
    promise: null,
    receive: false, //从好友分享的证券页面进入小程序，绑定手机号后是否需要返回领取页面
    isAppOnShow: false, //判断从微信小程序列表进来
    tarbar: [{
        selectedIconPath: "/images/home_selected.png",
        iconPath: "/images/home_normal.png",
        pagePath: "/pages/index/index",
        text: "首页"
      },
      {
        selectedIconPath: "/images/course_selected.png",
        iconPath: "/images/course_normal.png",
        pagePath: "/pages/groupCourse/groupCourseList",
        text: "预约"
      },
      {
        selectedIconPath: "/images/user_selected.png",
        iconPath: "/images/user_normal.png",
        pagePath: "/pages/mine/mine",
        text: "我的"
      },
      {
        selectedIconPath: "/images/shopping_selected.png",
        iconPath: "/images/shopping.png",
        pagePath: "/pages/shop/merchandiseList",
        text: "商城"
      }
    ]
  }

})