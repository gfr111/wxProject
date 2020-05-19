// pages/index/swiperinfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('-----', options)
    var title = options.title
    wx.setNavigationBarTitle({
      title: '' + title,
    })
    this.setData({ content: decodeURIComponent(options.content)})
  }

})