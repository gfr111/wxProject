// pages/cardsPurchaseOnline/seller/seller.js
var requestUtil = require('../../../utils/requestUtil.js');
var systemMessage = require('../../../SystemMessage.js');
var config = require("../../../config.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    defaultUser:'../../../images/default_user.png',
    options:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    console.log(options)
    this.setData({
      id: options.id,
      options:options
    })
    this.reqgetseller();
  },
  reqgetseller() {
    var url = config.getsellers(this.data.options.distributorId ? this.data.options.distributorId : null)
    requestUtil.getRequest(url).then(res => {
      this.setData({
        trainer: res
      })
    })
  },
  choosetrainer(e){
    console.log(e)
    var id = e.currentTarget.id
    var name = e.currentTarget.dataset.name

    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    var choosedtrainer={
      id:id,
      name:name
    }
    prevPage.setData({
      choosedTrainer: choosedtrainer
    })
    wx.navigateBack({})
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