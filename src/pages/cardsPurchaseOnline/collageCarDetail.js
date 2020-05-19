// pages/cardsPurchaseOnline/collageCarDetail.js
var buyCardService = require("../../service/buyCardService.js");
var centerService = require("../../service/centerService.js");
var util = require('../../utils/util.js');
var systemMessage = require('../../SystemMessage.js');
var authenticationUtil = require('../../utils/authenticationUtil.js');
var isPay = false;
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select: false,
    num: 1,
    goods: null,
    days: null,
    hours: null,
    minutes: null,
    isLogin: false,
    showCollage: true,
    options: null,
    instance: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      options: options
    })
    if (app.globalData.token == null) {
      this.data.isLogin = true
      app.globalData.receive = true
      authenticationUtil.checkAuthToken();
      this.init()
    } else {
      this.init()
    }
  },

  init: function () {
    var that = this;
    centerService.getCourseBookingDetail(that.data.options.id).then((res) => {
      res.instance.map((item, index) => {
        item.time = this.getTime(item.endTs)
      })
      that.setData({
        goods: res.detail,
        instance: res.instance
      })
      that.getTime(res.detail.endTs)
      if (that.data.hours == 0 && that.data.days == 0 && that.data.minutes == 0) {
        that.setData({
          showCollage: false
        })
      }
      var timer1 = setInterval(function () {
        that.getTime(res.detail.endTs)
        if (that.data.hours == 0 && that.data.days == 0 && that.data.minutes == 0) {
          clearInterval(timer1)
          that.setData({
            showCollage: false
          })
        }
      }, 60000)
    })
  },
  getTime: function (endTs) {
    // var time1 = util.formatTime(new Date());
    var stime = Date.parse(new Date())
    var etime = endTs;
    var usedTime = etime - stime; //两个时间戳相差的毫秒数

    var days = Math.floor(usedTime / (24 * 3600 * 1000));

    //计算出小时数

    var leave1 = usedTime % (24 * 3600 * 1000); //计算天数后剩余的毫秒数

    var hours = Math.floor(leave1 / (3600 * 1000));
    //计算相差分钟数
    var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000));
    var time = days + "天" + hours + "时" + minutes + "分";
    this.setData({
      days: days,
      hours: hours,
      minutes: minutes
    })
    return time

  },
  selectType: function () {
    if(this.options.pageTip != 'courses'){
      this.setData({
        select: true
      })
    }else{
      if (app.globalData.token == null) {
        return
      }
      var that = this;
      buyCardService.goBuyCourse(this.data.goods.objectId, this.data.goods.cardType == 2 ? 1 : this.data.goods.objectCount, '', this.data.goods.collagePrice, that.data.goods.id).then((res) => {
        buyCardService.goPay(res, function (tradeNo) {
          wx.redirectTo({
            url: '/pages/collage/collageList/collageList'
          })
        })
      }).catch((err) => {
        wx.hideLoading();
        systemMessage.showModal('', err);
      })
    }
   
  },
  hidden(e) {
    this.setData({
      select: false
    })
  },
  returnPage: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  toBuy: function () {
    if (app.globalData.token == null) {
      return
    }
    var that = this;
    buyCardService.goBuyCard(that.data.goods.objectId, -1, -1, null, that.data.goods.id).then((res) => {
      buyCardService.goPay(res, function () {
        wx.redirectTo({
          url: '/pages/collage/collageList/collageList'
        })
      })
      isPay = false;
    }).catch((err) => {
      wx.hideLoading();
      systemMessage.showModal('', err);
      isPay = false;
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.token != null) {
      this.init();
      this.data.isLogin = false
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
    }
  }
})