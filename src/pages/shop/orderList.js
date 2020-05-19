// pages/shop/orderList.js
var buyCardService = require('../../service/buyCardService.js');
var app = getApp();
const QRCode = require('../../utils/weapp-qrcode.js')
const rate = wx.getSystemInfoSync().windowWidth / 750
// 300rpx 在6s上为 150px
const qrcodeWidth = 300 * rate
var util = require('../../utils/util.js');
let qrcode;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    num: '',
    showMer: false,
    centerName: '',
    showgoods: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    buyCardService.getShopOrderList().then(res => {
      this.setData({
        list: res,
        centerName: app.globalData.selectCenter.name,
        centerphoto: app.globalData.selectCenter.photo || wx.getStorageSync('selectCenterKey').photo
      })
    })
  },
  openDetail: function(e) {
    var order = e.currentTarget.dataset.order
    order.createTime = (util.getdates(order.createTime)).split('.')
    var color = order.taken ? '#999999' : '#000000'
    qrcode = new QRCode('canvas', {
      text: order.id+'',
      image: '',
      width: qrcodeWidth,
      height: qrcodeWidth,
      colorDark: color,
      colorLight: "white",
      correctLevel: QRCode.CorrectLevel.H,
    });
    this.setData({
      num: order.id,
      order: order,
      showMer: true
    })



  },
  close: function() {
    this.setData({
      showMer: false,
      num: '',
      order: null,
      showgoods: true
    })
  },
  goBuy: function() {
    wx.switchTab({
      url: '/pages/shop/merchandiseList',
    })

  },
  show() {

    if (!this.data.order.imgsrc) {
        qrcode.exportImage( (path)=> {
          this.data.order.imgsrc = path
            this.setData({
              order: this.data.order
            })
        })
    }

    this.setData({
      showgoods: !this.data.showgoods
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})