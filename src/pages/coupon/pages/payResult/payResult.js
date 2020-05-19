// pages/coupon/pages/payResult/payResult.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:'',
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(options.status==1){
      wx.setNavigationBarTitle({
        title: '支付成功'
      })
    }else{
      wx.setNavigationBarTitle({
        title: '支付失败'
      })
    }
    this.setData({
      status: options.status,
      id:options.id
    })
  },
  returnPage:function(){
    wx.navigateBack()
  },
  toIndex:function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  checkCoupon:function(){
    wx.redirectTo({
      url: '/pages/couponOrder/pages/orderDetail/orderDetail?onlineOrderId=' + this.data.id,
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