// pages/setup/agreement/agreement.js
var config = require('../../../config.js')
var requestUtil = require('../../../utils/requestUtil.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    agreecontent: ''
  },
  getagree() {
    var url = config.loginwxAppProtocol()
    requestUtil.getRequest(url).then(res => {
      res.issueDate = res.issueDate.replace('-','年')
      res.issueDate = res.issueDate.replace('-','月')+'日'
      this.setData({
        agreecontent: res
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getagree()
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