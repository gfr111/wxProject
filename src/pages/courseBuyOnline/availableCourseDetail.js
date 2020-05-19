// pages/courseBuyOnline/avaiableCourseDetail.js
var buyCardService = require("../../service/buyCardService.js");
var systemMessage = require('../../SystemMessage.js');
var authenticationUtil = require('../../utils/authenticationUtil.js');
var app = getApp();
var isPay = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    course: {},
    availableCenterCount: '',
    trainerId: -1,
    trainerName: '请选择',
    count: 8,
    options: {},
    isLogin: false,
    amount: '',
    argee: false,
    isGroupBooking:false,
    groupBooking:[],
    showhide: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)
    var that = this;
    this.data.options = options;
    this.init();
  },

  init: function() {
    var that = this;
    if (that.options.trainerId != null && that.options.trainerName != null) {
      this.setData({
        trainerId: that.options.trainerId,
        trainerName: that.options.trainerName
      })
    }
    buyCardService.getSellCourseDetail(that.options.id).then((res) => {
      console.log(JSON.stringify(res));
      that.setData({
        course: res.course,
        availableCenterCount: res.availableCenterCount,
        amount: res.course.cardType == 1 ? res.course.onlineBuyPrice * this.data.count : res.course.onlineBuyPrice
      });
      if (res.groupBooking){
        this.setData({
          isGroupBooking:true,
          groupBooking: res.groupBooking
        })
      }
    })
    buyCardService.getTrainerList(app.globalData.headCenterId).then((res) => {
      console.log(res)
      that.setData({
        trainers: res.trainers
      });
    })
  },
  toDetail:function(){
   wx.navigateTo({
     url: '/pages/courseBuyOnline/buyDetail?id='+this.options.id+'&trainerName='+this.data.options.trainerName+'&trainerId='+this.data.options.trainerId,
   })
  },
  selectAgree: function() {
    this.setData({
      agree: this.data.agree ? false : true
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
    if (app.globalData.token != null && this.data.isLogin) {
      this.init();
      this.data.isLogin = false
    }
  },
  /**
* 用户点击右上角分享
*/
  onShareAppMessage: function () {

  }

})