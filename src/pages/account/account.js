// pages/account/account.js

var systemMessage = require('../../SystemMessage.js');
var login = require('../../service/loginService.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSumbuit: true,
    phone: '',
    code: '',
    second: 60,
    codeButtonTitle: "获取验证码",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  getPhone(e) {
    this.setData({
      phone: e.detail.value,
    })
    this.canSumbuit()
  },
  getCode(e) {
    this.setData({
      code: e.detail.value,
    })
    this.canSumbuit()
  },
  change: function() {
    login.changePhone(this.data.phone, this.data.code).then((result) => {
      if (result) {
        try {
          wx.clearStorageSync()
          getApp().globalData.token = null;
          getApp().globalData.openId = null;
          getApp().globalData.account = null;
          getApp().globalData.selectCenter = null;
          getApp().globalData.isAppOnShow = true;
          wx.reLaunch({
            url: '/pages/index/index'
          })
        } catch (e) {
          systemMessage.showModal('', '清除缓存失败，请删掉小程序重试')
        }
      }
    })
  },
  canSumbuit: function() {
    if (this.data.code != null && this.data.code != '' && this.data.phone != null && this.data.phone != "") {
      this.setData({
        isSumbuit: false
      })
    } else {
      this.setData({
        isSumbuit: true
      })
    }
  },
  // 发送验证码
  sendCode: function(e) {

    var that = this;
    if (that.data.codeButtonTitle == "获取验证码" || that.data.codeButtonTitle == "重新发送") {
      if (that.data.phone.length < 11) {
        systemMessage.showModal('', '手机号码不合法')
      } else {
        that.countdown();
        login.requestSmsCode(that.data.phone, true).then((result) => {
          console.log(result);
        })
      }
    }
  },
  //倒计时
  countdown: function() {
    var that = this;
    var second = that.data.second
    if (second == 0) {
      that.setData({
        second: 60,
        codeButtonTitle: "重新发送"
      });
      return;
    }
    var timer = setTimeout(function() {
      that.setData({
        second: second - 1,
        codeButtonTitle: "发送(" + second + ")"
      });
      that.countdown();
    }, 1000)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})