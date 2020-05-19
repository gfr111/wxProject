// pages/couponOrder/pages/disparityOrder/disparityOrder.js
var centerService = require("../../../../service/centerService.js");
var buyCardService = require("../../../../service/buyCardService.js");
var requestUtil = require("../../../../utils/requestUtil.js");
var config = require("../../../../config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isWechat:true,
    contractId:null,
    ticketFareAdjustment:null,
    ticket:null,
    ins:null,
    timeDate:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    centerService.getCenterMess(options.id).then((res) => {
      this.setData({
        timeDate: res.ins.timeDate.substring(0, 4) + '.' + res.ins.timeDate.substring(4, 6) + '.' + res.ins.timeDate.substring(6, 8),
        ticket: res.ticket,
        ticketFareAdjustment: res.ticketFareAdjustment,
        ins: res.ins
      })
    })
    centerService.getStoreValueCardList().then((res) => {
      if (res.length > 0) {
        this.setData({
          isWechat: false,
          contractId: res[0].contractId
        })
      }
    })
  },
  toPay: function () {
    var that = this;
    wx.removeStorage({
      key: 'valueCard'
    })
    var list = [{
      ticketId: that.data.ticketFareAdjustment.ticketId,
      ticketName: that.data.ticketFareAdjustment.ticketName,
      count: 1,
      date: that.data.ins.timeDate,
      timesId: that.data.ticketFareAdjustment.timesId,
      overtimeTicketInstanceId: that.data.ticketFareAdjustment.overtimeTicketInstanceId,
      overtimeMinutes: that.data.ticketFareAdjustment.overtimeMinutes
    }];
    var data = {
      payAmount: that.data.ticketFareAdjustment.payAmount,
      instances: list,
      payMethod: that.data.isWechat ? 5 : 99,
      contractId: that.data.contractId == 0 ? '' : that.data.contractId,
      type: that.data.ticketFareAdjustment.ticketType
    }
    console.log(data)
    centerService.buyCoupon(data).then((datas) => {
      //跳过支付时orderId为负数
      // console.log(datas<0)
      if (datas < 0) {
        wx.showLoading({
          title: '支付中',
          mask: true
        })
        that.getInstanceId(datas*(-1))
      } else {
        buyCardService.goPay(datas, function () {
          that.getInstanceId(datas.objectId)
        })
      }
    }).catch((err) => {
      wx.hideLoading();
    })
  },
  getInstanceId(id){
    var url = config.getInstanceId(id)
    requestUtil.getRequest(url).then(res => {
      // var pages = getCurrentPages();
      // var prevPage = pages[pages.length - 2];
      // prevPage.setData({
      //   id: res
      // })
      wx.navigateBack({})
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  changeStyle: function () {
    wx.navigateTo({
      url: '/pages/coupon/pages/payStyle/payStyle?isWechat=' + this.data.isWechat + '&contractId=' + this.data.contractId,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'valueCard',
      success: function (res) {
        that.setData({
          isWechat: JSON.parse(res.data).isWechat,
          contractId: JSON.parse(res.data).contractId
        })
        console.log(JSON.parse(res.data))
      },
      fail(res) {
        centerService.getStoreValueCardList().then((res) => {
          if (res.length > 0) {
            that.setData({
              isWechat: false,
              contractId: res[0].contractId
            })
          }
        })
      }
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