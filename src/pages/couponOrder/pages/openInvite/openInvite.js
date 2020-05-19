// pages/couponOrder//pages/openInvite/openInvite.js
var buyCardService = require("../../../../service/buyCardService.js");
var headOfficeService = require("../../../../service/headOfficeService.js");
var timer = null;
var app = getApp();
var authenticationUtil = require('../../../../utils/authenticationUtil.js');
var imgUrl = require("../../../../utils/uiUtils/imgUrl.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPop: false,
    second: 3,
    data: null,
    isRecive: false,//是否领取
    options: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    app.nologincenterInfo(options.centerId, res => {
      headOfficeService.getInviteDetail(options.centerId, options.inviterId, options.activityId).then((res) => {
        // res.trainee.photo = imgUrl.getDefaultSpace(res.trainee.photo)
        console.log(res)
        this.setData({
          data: res,
          options: options
        }) 
      })
    })
  },
  // 倒计时
  countdown: function () {
    var that = this;
    var second = that.data.second
    if (second == 1) {
      //跳转页面
      console.log('跳转')
      wx.redirectTo({
        url: '/pages/index/Cards',
      })
      return;
    }
    timer = setTimeout(function () {
      that.setData({
        second: second - 1
      });
      that.countdown();
    }, 1000)
  },
  toList() {
    wx.redirectTo({
      url: '/pages/index/Cards',
    })
  },
  hide() {
   
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  receiveCard() {
    if (app.globalData.token == null) {
      authenticationUtil.checkAuthToken();
    } else {
      headOfficeService.getReceiveInvite(this.data.options.centerId, this.data.data.invitation.id, this.data.options.inviterId).then((res) => {
        this.setData({
          showPop: true,
          isRecive: true
        })
        this.countdown();
      })
      
      
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearTimeout(timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})