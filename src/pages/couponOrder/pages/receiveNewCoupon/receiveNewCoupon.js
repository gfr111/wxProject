// pages/couponOrder/pages/receiveNewCoupon/receiveNewCoupon.js
var headOfficeService = require("../../../../service/headOfficeService.js");
var authenticationUtil = require('../../../../utils/authenticationUtil.js');
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ticket:null,
    options:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      options: options
    })
    if (options.scene) {
      var options = options.scene.split("_")
      console.log(options)
      this.getDetail(options[0], options[1])
    } else {
      this.getDetail(null, options.id)
    }
  },
  getDetail(centerId,id){
    headOfficeService.getReceivableCouponDetail(centerId,id).then((res) => {
        console.log(res)
        this.setData({
          ticket: res
        })
      }) 
  },
  recieveCoupon(){
    if (app.globalData.token == null) {
      wx.showToast({
        title: '您暂未授权',
        icon: 'none'
      })
      setTimeout(function(){
        authenticationUtil.checkAuthToken();
      },500)
    } else {
      if (this.data.options.scene) {
        var options = this.data.options.scene.split("_");
        headOfficeService.getCoupon(this.data.ticket.id).then((res) => {
          this.getDetail(options[0], this.data.ticket.id);
          wx.showToast({
            title: '领取成功',
            icon: 'none'
          })
        })
      } else {
        headOfficeService.getCoupon(this.data.ticket.id).then((res) => {
          this.getDetail(null, this.data.ticket.id);
          wx.showToast({
            title: '领取成功',
            icon: 'none'
          })
          setTimeout(function () {
            wx.navigateBack({})
          }, 500)
        })
      }
    }
 
 
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  toTicket(){
   wx.navigateTo({
     url: '/pages/tickets/tickets',
   })
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