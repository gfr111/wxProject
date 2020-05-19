// pages/myReservations/reservationDetail/reservationDetailInfo/reservationDetailInfo.js
var reservService = require('../../../../service/reservationService.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:"",
    info:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.data.id = options.id;
     this.getData();
  },


  getData:function() {
    var that = this;
    reservService.getReservationInfo(that.data.id).then((res) => {
      if (res)
      {
        that.setData(
          {
            info:res
          }
        )
      }
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
    return {
      path: "/pages/index/index"
    }
  }
})