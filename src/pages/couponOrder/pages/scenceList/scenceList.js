// pages/couponOrder/pages/orderList/orderList.js
var centerService = require("../../../../service/centerService.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    orderId:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      orderId: options.orderId
    })
  },
  buyTicket: function () {
    wx.redirectTo({
      url: '/pages/coupon/pages/couponList/couponList',
    })
  },
  toOrderDetail: function (e) {
    wx.navigateTo({
      url: '/pages/couponOrder/pages/scenceAdmission/scenceAdmission?orderMess=' + JSON.stringify(e.currentTarget.dataset.item)
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
    var that=this;
    centerService.getSceneList(that.data.orderId).then((res) => {
      for (var i = 0, len = res.length; i < len; i++) {
        res[i].timeDate = res[i].timeDate.substring(0, 4) + '.' + res[i].timeDate.substring(4, 6) + '.' + res[i].timeDate.substring(6, 8);
      }
      that.setData({
        orderList: res
      })
    })
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