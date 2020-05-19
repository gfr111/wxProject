// pages/couponOrder/pages/admissionCode/admissionCode.js
var centerService = require("../../../../service/centerService.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    codeMess:'',
    weekDay:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
  
  },
  getDate(id){
    centerService.getCenterMess(id).then((res) => {
      var arrList = [];
      if (res.ticket.weekDay) {
        if (res.ticket.weekDay.indexOf(1) != -1) {
          arrList.push('周一 ')
        }
        if (res.ticket.weekDay.indexOf(2) != -1) {
          arrList.push('周二 ')
        }
        if (res.ticket.weekDay.indexOf(3) != -1) {
          arrList.push('周三 ')
        }
        if (res.ticket.weekDay.indexOf(4) != -1) {
          arrList.push('周四 ')
        }
        if (res.ticket.weekDay.indexOf(5) != -1) {
          arrList.push('周五 ')
        }
        if (res.ticket.weekDay.indexOf(6) != -1) {
          arrList.push('周六 ')
        }
        if (res.ticket.weekDay.indexOf(7) != -1) {
          arrList.push('周日')
        }
      }
      res.ins.timeDate = res.ins.timeDate.substring(0, 4) + "." + res.ins.timeDate.substring(4, 6) + "." + res.ins.timeDate.substring(6, 8);
      this.setData({
        codeMess: res,
        weekDay: arrList
      })
    })
  },
  checkDetilEvent:function(){
    wx.navigateTo({
      url: '/pages/couponOrder/pages/orderDetail/orderDetail?onlineOrderId=' + this.data.codeMess.onlineOrderId,
    })
  },
  toDisparity(){
    wx.navigateTo({
      url: '/pages/couponOrder/pages/disparityOrder/disparityOrder?id=' + this.data.id,
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
    console.log(this.data.id)
    this.getDate(this.data.id)
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