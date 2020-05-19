// pages/groupCourse/cardType/cardType.js
var appointment = require('../../../service/groupCourseAppoint.js')
var systemMessage = require('../../../SystemMessage.js');
var util = require('../../../utils/util.js');
var config = require('../../../config.js')
var requestUtil = require('../../../utils/requestUtil.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (getApp().globalData.selectCenter.clubType==4){
      this.getCourseDetailOffice(options.instanceId, options.courseId)
    }else{
      this.getCourseDetail(null,options.instanceId, options.courseId)
    }
    

  },
  // 获取课程详情
  getCourseDetailOffice(trainerId, courseId) {
    var url = config.officeReservePrivateCourseInfo(trainerId, courseId);
    requestUtil.getRequest(url).then(res => {
      let card = {
        line: [],
        noline: []
      }
      res.allowCards.map((item, index) => {
        if (item.onlineBuySupport) {
          card.line.push(item)
        } else {
          card.noline.push(item)
        }
      })
      this.setData({
        cardData: card,
      })
    })
  },
  // 获取课程详情
  getCourseDetail(centerId,instanceId, courseId) {
    appointment.getGroupCourseDetail(centerId,instanceId, courseId).then((res) => {
      let card={
        line:[],
        noline:[]
      }
      res.allowCards.map((item,index)=>{
        if (item.onlineBuySupport){
          card.line.push(item)
        }else{
          card.noline.push(item)
        }
      })
      this.setData({
        cardData:card,
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