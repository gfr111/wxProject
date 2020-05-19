// pages/myOrders/orderDetail/orderDetail.js
var orderService = require('../../../service/orderService.js');
var util = require('../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

     id:"",
     order:null,
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
    orderService.orderDetail(that.data.id).then((res) => {
      console.log(res)
      if (res) {
        // console.log(res);
        // console.log(res.createTime);
        that.handleData(res);
      }
    }) ;
  },
  handleData:function(data) {
    var that = this;
    data.createTime = util.timestampToTimeStr(data.createTime);
    data.paidTs = util.timestampToTimeStr(data.paidTs);
    that.setData(
      {
        order:data
      }
    );

  },

  // basicCellTapped:function() {
  //    wx.navigateTo({
  //      url: '../../myReservations/reservationDetail/reservationDetailInfo/reservationDetailInfo?id=' + this.data.order.reservationId,
  //    })
  // },

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
  },
})