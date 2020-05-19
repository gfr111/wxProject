// pages/trainingCourse//pages/trainingCourseList/trainingCourseList.js
var centerService = require('../../../../service/centerService.js');
var util = require('../../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
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
    centerService.getTrainerCourseList().then((res) => {
      res.map(item=>{
        item.introduction = util.html2Text(item.introduction)
        item.introduction = item.introduction .replace(/[ ]|[&nbsp;]/g, '')
      })
      
      this.setData({
        list: res
      })
    })
  },
  toDetail(e){
    wx.navigateTo({
      url: '../trainingCourseDetail/trainingCourseDetail?courseId=' + e.currentTarget.dataset.id,
    })
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

  }
})