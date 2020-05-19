// pages/activity/signUp.js
var config = require("../../config.js")
var requestUtil = require('../../utils/requestUtil.js')
var buyCardService = require("../../service/buyCardService.js");
var systemMessage = require('../../SystemMessage.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    acti: null,
    count: null,
    totalPrice: null,
    isPay: false,
    centerId: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('---页面传值---', options)
    var that = this
    that.setData({ centerId: options.centerId })
    var url = config.goReserve(options.centerId, options.id, options.count)
    requestUtil.getRequest(url).then(res => {
      console.log('---goReserve---', url)
      console.log('---结果---', res)
      that.setData({
        acti: res.activity,
        count: res.reserveCount,
        totalPrice: res.totalPrice
      })
    })
  },
  signUp: function() {
    console.log(789)
    var that = this
    if (this.data.isPay) {
      return
    }
    console.log(wx.getStorageSync('salesID'))
    var originalId = wx.getStorageSync('salesID')
    var url = config.signUp(that.data.centerId, this.data.acti.id, this.data.count, originalId?originalId:null)
    this.data.isPay = true
    // return
    requestUtil.getRequest(url).then(res => {
      wx.removeStorageSync('salesID')
      if (res == -1) {
        that.data.isPay = false
        wx.showToast({
          title: '报名成功',
          success: function() {
            setTimeout(function() {
              wx.switchTab({
                url: '/pages/index/index',
              })
            }, 1500)
          }
        })
      } else {
        buyCardService.goBuyActPay(that.data.centerId, res).then((res) => {
          buyCardService.goPay(res, function () {
            that.data.isPay = false
            wx.showToast({
              title: '报名成功',
              success: function () {
                setTimeout(function () {
                  wx.switchTab({
                    url: '/pages/index/index',
                  })
                }, 1500)
              }
            })
          })
        }).catch((err) => {
          wx.hideLoading();
          systemMessage.showModal('', err);
          that.data.isPay =false
        })

      }
    })
  },
})