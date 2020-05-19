// pages/couponOrder/pages/newCouponCenter/newCouponCenter.js
var headOfficeService = require("../../../../service/headOfficeService.js");
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

  },
  toRecive(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/couponOrder/pages/receiveNewCoupon/receiveNewCoupon?id=' + id,
    })
  },
  getList() {
    var that = this
    headOfficeService.getReceivableCouponList().then((res) => {
      res.forEach((item) => {
        item.selected = false;
      })
      that.setData({
        ticketList: res
      })
    })
  },
  showBizType(e) {
    var arr = this.data.ticketList;
    arr.forEach((item) => {
      if (e.currentTarget.dataset.id == item.id) {
        item.selected = !item.selected;
      } else {
        item.selected = false
      }
    })
    this.setData({
      ticketList: arr
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
    this.getList();
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