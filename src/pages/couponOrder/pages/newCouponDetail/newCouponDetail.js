// pages/couponOrder/pages/newCouponDetail/newCouponDetail.js
var headOfficeService = require("../../../../service/headOfficeService.js");
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.scene) {
      var options = options.scene.split("_")
      console.log(options)
      this.getList(options[0], options[1])
    } else {
      this.getList(null, options.id)
    }
  },
  getList(centerId,id) {
    var that = this
    headOfficeService.getCouponDetail(centerId,id).then((res) => {
      that.setData({
        ticket: res
      })
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