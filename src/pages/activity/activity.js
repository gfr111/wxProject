// pages/activity/activity.js
var config = require("../../config.js")
var requestUtil = require('../../utils/requestUtil.js')
var storageUtil = require('../../utils/storageUtil.js');
var promiseUtil = require('../../utils/promiseUtil.js');
var unlock = require('../../service/unlock.js')
var notifConstant = require('../../utils/notifConstant.js');
var notificationCenter = require('../../WxNotificationCenter.js');
var centerService = require('../../service/centerService.js');
var app = getApp();
var authenticationUtil = require('../../utils/authenticationUtil.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    acti: null,
    options: null,
    img: ["https://www.forzadata.cn/web/static/images/wx4/icon_activity_default.png"],
    count: 1,
    centerId: null, //门店id
    me: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.scene) {
      // 是否营销会员端活动,会员端活动扫码
      var index = options.scene.indexOf('a')
      if (index > -1) {
        options.scene = options.scene.slice(index+1)
        options = options.scene.split("_")
      }else{
        // 海报，会员与教练绑定
        options = options.scene.split("_")
        wx.setStorageSync("targetCenterId", options[0])
        wx.setStorageSync("actscan", options)
        if (options[2]) {
          console.log(options[2])
          wx.setStorageSync('salesID', options[2])
        }
      }
      this.data.options = {
        id: options[1],
        centerId: options[0],
        trainerId: options[2]
      }
   
    } else {
      this.data.options = options
    }
    this.setData({
      centerId: this.data.options.centerId || options[0]
    })
  },
  // 会员与教练绑定
  getbind(data) {
    var url = config.getbind(data[0], data[2])
    requestUtil.postRequest(url).then(res => {
      wx.removeStorageSync('actscan')
    })
  },

  refreshCount: function(evt) {
    if (evt.target.dataset.method) {

      if (this.data.count >= this.data.acti.restrictCanReserveCount) {
        wx.showToast({
          title: '已达到最大可报名人数',
          icon: 'none',
        })
      } else {
        this.setData({
          count: this.data.count + 1,
        })
      }
    } else {
      if (this.data.count > 1) {
        this.setData({
          count: this.data.count - 1,
        })
      }
    }
  },
  toSignUp: function() {
    let info = {
      id: this.data.centerId,
      name: this.data.options.centerName,
      address: this.data.options.centerAddress,
      phone: this.data.options.centerPhone
    }
    app.globalData.selectCenter = info;
    storageUtil.saveSelectCenter(info);
    var that = this;
    if (!app.globalData.token) {
      app.globalData.receive = true
      var p = new Promise(function(resolve, reject) {
        authenticationUtil.checkAuthToken(that.tryReceive);
      })
      app.globalData.promise = p;
      that.setData({
        rece: true
      })
    } else {
      that.signUp();
    }
  },
  signUp: function() {
    wx.navigateTo({
      url: '/pages/activity/signUp?id=' + this.data.acti.id + '&count=' + this.data.count + '&centerId=' + this.data.centerId,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    notificationCenter.addNotification(notifConstant.refreshMainPageNotif, this.updateData, this);
    var that = this
    if (app.globalData.isAppOnShow) {
      app.globalData.isAppOnShow = false;
      if (that.data.centerId != null) {
        let info = {
          id: that.data.centerId
        }
        app.globalData.selectCenter = info;
        storageUtil.saveSelectCenter(info);
      }
      if (!app.globalData.token && that.data.centerId != null) {
        var wxGetExtConfig = promiseUtil.wxPromisify(wx.getExtConfig);
        wxGetExtConfig().then((res) => {
          if (JSON.stringify(res.extConfig) != '{}') {
            wx.setNavigationBarTitle({
              title: res.extConfig.centerName
            });
          }
        })
      }
    } else {
      if (that.data.centerId != null) {
        let info = {
          id: that.data.centerId
        }
        app.globalData.selectCenter = info;
        storageUtil.saveSelectCenter(info);
        var wxGetExtConfig = promiseUtil.wxPromisify(wx.getExtConfig);
        wxGetExtConfig().then((res) => {
          if (JSON.stringify(res.extConfig) != '{}') {
            wx.setNavigationBarTitle({
              title: res.extConfig.centerName
            });
          }
        })
      }
    }
    if (app.globalData.token == null) {
      app.globalData.receive = true
    }
    // // 会员与教练绑定
    if (wx.getStorageSync("actscan") && wx.getStorageSync("actscan")[2]) {
      app.checkAuthToken(function() {
        var opti = wx.getStorageSync("actscan")
        if (app.globalData.token || wx.getStorageSync("tokenKey")) {
          that.getbind(opti)
        }
      });
    }
    // ---------
    // 扫码进去获取center团队的信息，有token拿token，没有拿testToken用游客身份获取信息获取信息以后，请求活动详情
    app.nologincenterInfo(that.data.centerId, res => {
      this.reqActivityDetail()
    })
  },
  // 活动详情
  reqActivityDetail(){
    var url = config.getActivity(this.data.centerId,  this.data.options.id)
    requestUtil.getRequest(url, true, false).then(res => {
      if (res.activity.pictures && res.activity.pictures.length > 0) {
        this.setData({
          img: res.activity.pictures
        })
      }
      this.setData({
        acti: res.activity
      })
    })
  },

  unLoad: function() {
    notificationCenter.removeNotification(notifConstant.refreshMainPageNotif, this);
  },

  updateData: function() {
    var that = this
    that.setData({
      current: 0
    })
    centerService.getCenterInfo().then((res) => {
      if (res.testToken != undefined && app.globalData.token == null && app.globalData.testToken == null) {
        app.globalData.testToken = res.testToken
      }
      that.setData({
        account: app.globalData.account,
        selectCenter: app.globalData.selectCenter,
        sliders: res.sliders,
        descrip: res.description,
        trainers: res.trainers.slice(0, 5),
        notifications: res.notifications,
        activities: res.activities,
        active: res.allowWxSportExchange,
        exprience: res.salesPromoyions
      })
    })
  },
  goCouponDetail: function() {
    wx.navigateTo({
      url: '/pages/tickets/tickets',
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var path = '/pages/activity/activity?id=' + this.data.options.id + '&centerId=' + this.data.centerId + '&centerName=' + this.data.options.centerName + '&centerAddress=' + this.data.options.centerAddress + '&centerPhone=' + this.data.options.centerPhone
    var imageUrl = this.data.img[0]
    return {
      title: '' + this.data.acti.title,
      path: path,
      imageUrl: imageUrl
    }
  }
})