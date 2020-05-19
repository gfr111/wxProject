// pages/groupCourse/trainercourse/trainercourse.js
var requestUtil = require('../../../utils/requestUtil.js')
var config = require('../../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trainer: {},
    course: [],
    clubType:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    console.log(options)
    this.setData({
      clubType: getApp().globalData.selectCenter.clubType
    })
    this.req(options.trainerId, options.centerId ? options.centerId:null);
  },

  req(data, centerId) {
    var url = config.getTrainerCourse(data,centerId);
    var that = this
    requestUtil.getRequest(url).then(res => {
      console.log(res)
      console.log(that.data.clubType)
      var course = [];
      if(that.data.clubType!=4){
        res.courses.map((item, index) => {
          if (item.availableCount > 0) {
            course.push(item)
          }
        })
        this.setData({
          trainer: res.trainer,
          course: course,
        })
      }else{
         this.setData({
          trainer: res.trainer,
          course: res.courses,
        })
      }
     

    })
  },
  back(){
    wx.navigateBack();
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