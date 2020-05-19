// pages/groupclassDetail/groupclassDetail.js

var requestUtil = require('../../utils/requestUtil.js')
var config = require("../../config.js")
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

    CourseDetail: [],
    clubType:'',
    descrip:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      instance: options.instance,
      clubType: app.globalData.selectCenter.clubType
    })


  },
  getcorseleves(data) {
    var url = config.courseLevel(data.instance.id)
    requestUtil.getRequest(url).then(res => {
      res.map((item, index) => {
        if (data.instance.level == item.level) {
          data.instance.leves = item
        }
      })
      this.setData({
        CourseDetail: data,
        descrip: data.course.introduction
      })
    })
  },
  cancel() {
    var CourseDetail = this.data.CourseDetail
    var data = {
      id: CourseDetail.instance.id,
      index: CourseDetail.courseOnlineorderId ? CourseDetail.courseOnlineorderId : 0,
      reserveId: CourseDetail.courseOnlineorderId ? CourseDetail.courseOnlineorderId : null,
    }
    let json = JSON.stringify(data);
    wx.navigateTo({
      url: '/pages/myReservations/reservationDetail/reservationCancellation/cancelReservation?data=' + json,
    })
  },
  goby() {
    var orderId = this.data.CourseDetail.courseOnlineorderId
    wx.navigateTo({
      url: '/pages/myReservations/reservationDetail/reservationPayment/createPayment/createPayment?orderId=' + orderId,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var url = config.getGroupCourseDetail(this.data.instance)
    requestUtil.getRequest(url).then(res => {
      var date = res.instance.date
      console.log(date)
      let system = '',
        s = date
      wx.getSystemInfo({
        success: function(res) {
          system = res.system
        },
      })
      if (system.indexOf("iOS") == 0) {
        s = date.replace(/\-/g, '/')
      }
      var weks = new Date(s);
      let wek = "星期" + "日一二三四五六".charAt(weks.getDay());
      res.instance.wek = wek
      this.getcorseleves(res)

    })
  }

})