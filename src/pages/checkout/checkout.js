// pages/checkout/checkout.js

var util = require('../../utils/util.js')
var unlock = require('../../service/unlock.js')
var centerService = require('../../service/centerService.js');
var promiseUtil = require('../../utils/promiseUtil.js');
var storageUtil = require('../../utils/storageUtil.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 31, //返回类型状态：0:成功；1:未签到；2:其他错误；31:等待中...
    locker: null,
    scene: null,
    info: null,
    centerId: null,
    deviceId: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('---' + JSON.stringify(options))
    this.setData({ scene: options.scene })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    if (that.data.scene != null) {
      that.setData({
        centerId: that.data.scene.split("_")[0],
        deviceId: that.data.scene.split("_")[1],
      })
    }

    if (app.globalData.isAppOnShow) {
      app.globalData.isAppOnShow = false;
      if (!app.globalData.token && that.data.scene != null) {
        let info = {
          id: decodeURIComponent(that.data.centerId)
        }
        console.log('--ll--' + JSON.stringify(info))
        app.globalData.selectCenter = info;
        storageUtil.saveSelectCenter(info);
      }

    } else {
      if (that.data.scene != null) {
        let info = {
          id: decodeURIComponent(that.data.centerId)
        }
        app.globalData.selectCenter = info;
        storageUtil.saveSelectCenter(info);
      }
    }

    if (app.globalData.token == null) {
      app.globalData.receive = true
    }

    app.checkAuthToken(that.data.scene != null ? function () {
      that.getData();
      that.data.scene = null;
      that.setData({
        info: app.globalData.account
      })
    }: null);

   

    
    var wxGetExtConfig = promiseUtil.wxPromisify(wx.getExtConfig);
    wxGetExtConfig().then((res) => {
      if (JSON.stringify(res.extConfig) != '{}') {
        wx.setNavigationBarTitle({
          title: res.extConfig.centerName
        });
      }
    })
  },



  /********request********/

  getData: function() {
    var that = this;
    // app.checkAuthToken(that.data.scene != null ? function () {
    // } : null);
    centerService.tryCheckOut(that.data.centerId, that.data.deviceId).then((res) => {
      if (res.locker){
        that.setData({ locker: res.locker})
      }
      that.setData({ type: res.code})
    })
  },

  sureCheckOut: function() {
    var that = this;
    centerService.checkOut(that.data.centerId, that.data.deviceId).then((res) => {
      if (res == true){
        that.setData({ type: 0, locker: null })
      }
    })
  }

})