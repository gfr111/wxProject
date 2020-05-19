// pages/space/paysuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 2,//是否支付成功,2:等待付款；3:待核销；
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({ id: options.id })
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

  },



  /***************/

  payInfo: function () {
    wx.redirectTo({
      url: '/pages/space/orderinfo?dataID=' + this.data.id+'&status=1',
    })
  },


  backClick: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

})