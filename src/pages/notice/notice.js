// pages/notice/notice.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    options.clubId = options.clubId ? options.clubId : app.globalData.selectCenter.id

    var url = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc730104d0c5172a9&redirect_uri=https%3A%2F%2Fwww.forzadata.cn%2Fweb%2Fwx4%2Fcenter%2F' + encodeURIComponent(options.clubId) + '%2Fnotice%2F' + encodeURIComponent(options.id) + '&response_type=code&scope=snsapi_base&state=bocai#wechat_redirect'
    this.setData({
      url: url,
      id: options.id,
      clubId: options.clubId
    })
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
    return {
      title: '',
      path: '/pages/notice/notice?id=' + this.data.id + '&clubId=' + this.data.clubId
    }
  }
})