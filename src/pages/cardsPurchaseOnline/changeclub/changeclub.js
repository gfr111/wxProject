// pages/cardsPurchaseOnline/changeclub/changeclub.js
var centerService = require("../../../service/centerService.js");
var requestUtil = require('../../../utils/requestUtil.js');
var buyCardService = require("../../../service/buyCardService.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    buy:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      centerId: options.center,
      id: options.id,
      buy: options.buy
    })
    if (options.buy == 'true') {
      var func = buyCardService.getusefulCourseV2;
    } else {
      var func = buyCardService.getusefulCourse;
    }
    func(options.center, options.id).then((res) => {
      this.setData({
        place: res.centers
      })
    })
  },
  chooseclub(e) {
    var center = e.currentTarget.id
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    if (this.data.buy == 'true') {
      var func = buyCardService.getusefulCourseV2;
    } else {
      var func = buyCardService.getusefulCourse;
    }
    func(center, this.data.id).then((res) => {
      prevPage.setData({
        course: res.courses,
        selectData: res.centers,
        selectFirst: e.currentTarget.dataset.name,
        centerId:center
      })
      wx.navigateBack({
        
      })
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