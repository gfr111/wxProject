// pages/space/myreservation.js
var util = require('../../utils/util.js')
var centerService = require("../../service/centerService.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],//数据
    showModal: false,//是否展示预订码
    spaceList:null,
    qrCode:null,
    orderNo:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    this.getListData();
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




  /*******页面事件*******/

  showQr: function (e) {
    var that = this;
    that.setData({ showModal: true });
    centerService.getSignQr(e.currentTarget.dataset.orderno).then((res) => {
      that.setData({
        qrCode: res,
        orderNo: e.currentTarget.dataset.orderno
      })
    })
  },

  onCancle: function () {
    var that = this;
    that.setData({ showModal: false })
  },

  buyVIP: function () {
    this.setData({ showModal: false })
    // wx.navigateTo({
    //   url: '/pages/space/paysuccess',
    // })
  },

  orderInfo: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/space/orderinfo?dataID=' + id,
    })
  },

  /******request******/

  getListData: function(){
    var that = this;
    centerService.getSiteMyreservation().then((res) => {
      that.setData({ listData: res.data})
    })
  },
})