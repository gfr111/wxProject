// pages/myReservations/reservationDetail/reservationCancellation/cancelReservation.js
var reservService = require('../../../../service/reservationService.js');
var notificationCenter = require('../../../../WxNotificationCenter.js');
var notifConstant = require('../../../../utils/notifConstant.js');
var orderService = require('../../../../service/orderService.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
  
    isPayedOder:false,
    id:"",
    orderId:"",
    reserveId: null,
    reason:"",
    order:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  // reserveId=item.courseInstanceType == 2 ? item.id : null
    // data={ "id==instanceId": 2361768, "index": 0, "reserveId": null }
  onLoad: function (options) {
    console.log(options)
    let data = JSON.parse(options.data);
    this.data.id = data.id;
    this.data.reserveId = data.reserveId;
    this.setData({
      orderId:data.index,
    });
    this.getOrderDetail();
  },

  getOrderDetail:function() {
    var that = this;
    let orderId = that.data.orderId;
    if (orderId > 0)
    {
      orderService.orderDetail(orderId).then((res) => {
        if (res) {
          console.log(res);
          if (res.statusId != 0) //未支付不显示
          {
            that.setData({
              order: res,
              isPayedOder:true
            })
          }
        }
      });   
    }
  },

  bindReasonInput:function(e) {
    this.data.reason = e.detail.value;
  },

  didTapGreenBtn :function() {
    var that = this;
    reservService.cancelReservation(that.data.id, that.data.reason, this.data.reserveId == null ? null : this.data.reserveId).then((res) => {
      console.log(res);
      if (res) {
        notificationCenter.postNotificationName(notifConstant.refreshReservationListNotif, {name: "cancel" });
        wx.navigateBack();
      }
    });
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
  // onShareAppMessage: function () {
  
  // }
})