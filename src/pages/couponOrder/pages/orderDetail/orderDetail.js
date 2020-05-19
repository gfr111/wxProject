// pages/couponOrder/pages/orderDetail/orderDetail.js
var centerService = require("../../../../service/centerService.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showCourse:false,
    orderMess:'',
    qr:'',
    img:'',
    orderId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    centerService.getTicketOrderDetail(options.onlineOrderId).then((res)=>{
      centerService.getTicketOrderQr(res.order.takeCode).then((res)=>{
        that.setData({
          qr: res
        })
      })
      that.setData({
        orderMess: res.order,
        img:res.img
      })
    })
  },
  preventTouchMove:function(){

  },
  showCourseBox:function(){
    wx.pageScrollTo({
      scrollTop: 0
    })
    this.setData({
      showCourse:true
    })
  },
  hideCourse: function () {
    this.setData({
      showCourse: false
    })
  },
  checkScenceEvent:function(){
   wx.navigateTo({
     url: '/pages/couponOrder/pages/scenceList/scenceList?orderId='+this.data.orderMess.id,
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
    //  wx.switchTab({
    //    url: '/pages/mine/mine',
    //  })
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