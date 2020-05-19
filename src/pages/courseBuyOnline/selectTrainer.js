// pages/courseBuyOnline/selectTrainer.js
var buyCardService = require("../../service/buyCardService.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    trainers:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    buyCardService.getTrainerList(options.id).then((res) => {
      console.log(res)
      that.setData({
        trainers: res.trainers
      });
    })
  },

  toBack: function(event){
    var pages = getCurrentPages();
    var prevPage = pages[pages.length-2];
    console.log(event.currentTarget.dataset)
    prevPage.setData({
      trainerId: event.currentTarget.dataset.trainerId,
      trainerName: event.currentTarget.dataset.trainerName
    })
    wx.navigateBack({
      delta:1
    })
  },
  
})