// pages/shop/payway/payway.js
var requestUtil = require('../../../utils/requestUtil.js');
var configs = require('../../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ids: {},
    choosecard: {},
    chooseId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    this.setData({
      ids: prevPage.data.ids,
      choosecard: prevPage.data.card,
      price: prevPage.data.price
    })
    this.req()
  },
  req() {
    var url = configs.getordergoods()
    requestUtil.postRequest(url, this.data.ids).then(res => {
      this.setData({
        card: res.cards
      })
    })
  },
  choose(e) {
    var id = e.currentTarget.id
    if (id == -1) {
      var cards = {
        id: '',
        name: '微信支付'
      }
    } else {
      var cards = {
        id: id,
        name: e.currentTarget.dataset.name
      }
    }
    this.setData({
      choosecard: cards
    })
  },
  sure() {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      card: this.data.choosecard
    })
    wx.navigateBack({
      
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