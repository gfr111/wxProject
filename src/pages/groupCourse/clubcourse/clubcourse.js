// pages/groupCourse/clubcourse/clubcourse.js

var requestUtil = require('../../../utils/requestUtil.js')
var config = require('../../../config.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {

    trainer:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      trainer:options
    })
    this.req(options.trainerId)

  },

  req(data) {
    var url = config.getTrainerCourse(data)
    var that = this
    requestUtil.getRequest(url).then(res => {
      var course = []
      var coursecantby = []
      res.courses.map((item, index) => {
        if (item.onlineBuySupport) {
          course.push(item)
        }else{
          coursecantby.push(item)
        }
      })
      this.setData({
        coursecantby: coursecantby,
        course: course,

      })

    })
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