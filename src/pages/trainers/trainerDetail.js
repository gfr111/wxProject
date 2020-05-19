// pages/trainers/trainerDetail.js
var buyCardService = require("../../service/buyCardService.js");
var config = require('../../config.js')
var requestUtil = require('../../utils/requestUtil.js')
var authenticationUtil = require('../../utils/authenticationUtil.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
     trainerMessage:null,
       centerId:'',
      isFRomLeague:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var id=options.id;
    console.log(options)
    buyCardService.getTrainerDetail(id, options.centerId ? options.centerId:null).then((res) => {
    that.setData({
      trainerMessage:res,
      centerId: options.centerId ? options.centerId:null,
      isFRomLeague: options.fromPage ? options.fromPage:false
    })
    });
  },
  BigPic:function(e){
    var url = e.currentTarget.dataset.url
    var urls = e.currentTarget.dataset.urls
    wx.previewImage({
      current:url,
      urls: urls
    })
  },
  selectTrainer: function (evt) {

    if (app.globalData.token == null) {

      app.globalData.receive = true
      authenticationUtil.checkAuthToken();
    } else {
    getApp().globalData.showCourseId = evt.currentTarget.dataset.trainer
      wx.navigateTo({
        url: '/pages/groupCourse/trainercourse/trainercourse?trainerId=' + this.data.trainerMessage.trainer.trainerId+'&centerId='+this.data.centerId,
      })}
  },
  onShareAppMessage(){
    
  }
})