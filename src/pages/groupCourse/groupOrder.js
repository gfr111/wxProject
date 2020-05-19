// pages/groupCourse/groupOrder.js
var config = require('../../config.js')
var requestUtil = require('../../utils/requestUtil.js')
var util = require('../../utils/util.js')
var loadingCalender = false;
var reserveInProcessing = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    course: null,
    trainer: null,
    time: null,
    dateStr: null,
    grids: null,
    grid: null,
    years: null,
    year: null,
    months: null,
    month: null,
    days: null,
    day: null,
    value: [0, 0, 0],
    showCalender: false,
    gridDate: null,
    isChecked: false,
    oneMonths: null,
    oneDay: null,
    timeEnd: "",
    enableAutoSignPrivateCourse:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      dateStr: util.timestampToTimeStr(new Date()).substring(0, 10)
    })
    let date = new Date()
    console.log(date.getFullYear(), date.getMonth() + 1, date.getDate())
    this.setData({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    })
    var that = this
    console.log('--' + options.trainerId)
    var url = config.reservePrivateCourseInfo(options.trainerId, options.courseId)
    requestUtil.getRequest(url).then(res => {
      that.setData({
        time: res.minutesForCancelPrivateCourseBeforeStart < 60 ? (res.minutesForCancelPrivateCourseBeforeStart + '分钟') : (res.minutesForCancelPrivateCourseBeforeStart / 60).toFixed(1) + '小时',
        course: res.course,
        trainer: res.trainer,
        enableAutoSignPrivateCourse: res.enableAutoSignPrivateCourse
      })
      that.loadCalendar()
    })
  },
  // showCalender: function() {
  //   if (this.data.showCalender == false) {

  //     this.setData({
  //       showCalender: true
  //     })
  //   } else {
  //     this.loadCalendar()
  //     this.setData({
  //       showCalender: false
  //     })
  //   }
  // },
  loadCalendar: function() {
    this.setData({
      grids: null
    })
    var ts = new Date(this.data.dateStr.replace(/-/g, '/') + ' 00:00:00').getTime();
    loadingCalender = true;
    var url = config.getCalendar(this.data.trainer.trainerId, ts)
    var that = this
    requestUtil.postRequest(url, null).then(res => {
      console.log(url)
      that.setData({
        grids: res
      })
      loadingCalender = false
    }).catch(res => {
      loadingCalender = false
    })
  },
  bindDateChange(e) {
    var date = e.detail.value
    var time = this.gettime(date)
    this.setData({
      year: time[0],
      month: time[1],
      day: time[2],
      dateStr: time[0] + '-' + time[1] + '-' + time[2]
    })
    this.loadCalendar()
  },



  reserve: function() {
    if (reserveInProcessing) {
      return;
    }

    if (this.data.dateStr < util.timestampToTimeStr(new Date()).substring(0, 10)) {
      wx.showToast({
        title: '预约日期不能小于现在！',
        icon: 'none'
      })
      return
    }

    if (this.data.grid == null) {
      wx.showToast({
        title: '请选择预约时间！',
        icon: 'none'
      })
      return
    }
    reserveInProcessing = true;
    var endTime = util.formatTimec(this.data.grid.startTs + this.data.course.duration * 60000, "h:m");
    var url = config.privateReserve();
    wx.showToast({
      title: '预约中',
      icon: "loading",
      duration:5000,
    })
    requestUtil.postRequest(url, {
      courseId: this.data.course.id,
      trainerId: this.data.trainer.trainerId,
      date: this.data.grid.day,
      startTime: this.data.grid.display,
      endTime: endTime
    }).then(res => {
      wx.hideLoading()
      reserveInProcessing = false;
      wx.showToast({
        title: '预约成功',
      })
      setTimeout(()=>{
        wx.navigateTo({
          url: '/pages/myReservations/reservationList/reservationList',
        })
      },1500)
   

    }).catch(res => {
      reserveInProcessing = false;
      wx.showToast({
        title: '预约失败',
        icon: 'none'
      })
    })

  },
  chooseTime: function(e) {
    var ids = e.currentTarget.dataset.id;
    this.setData({
      grid: e.currentTarget.dataset.item,
      id: ids
    })
  },


  gettime(date) {
    date += ""
    date = new Date(date)
    console.log(date)
    var year = date.getFullYear()
    var month = this.getzreo(date.getMonth() + 1)
    var day = this.getzreo(date.getDate())

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    console.log(year, month, day)

    return [year, month, day]
  },
  getzreo(time) {
    time += ""
    return time[0] != 0 ? time : time.slice(1)
  }



})