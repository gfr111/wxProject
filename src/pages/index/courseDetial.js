// pages/index/courseDetial.js

var util = require('../../utils/util.js')
var centerService = require("../../service/centerService.js");


Page({

  /**
   * 页面的初始数据
   */
  data: {
    seleInfo: null,
    deposits: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // var deposits = options.deposits
    this.setData({
      deposits: JSON.parse(options.deposits)
    })
    console.log(options.deposits)
  },

  /*********页面点击事件*********/

  //查看条款协议
  lookForAgreement: function() {
    wx.navigateTo({
      url: '/pages/agreement/agreement?tp=1&protocolId=' + this.data.deposits.protocolId ,
    })
  },

  //查看电子合同
  lookForProtocal: function() {
    wx.downloadFile({
      url: this.data.deposits.electronicContractUrl,
      success: function(res) {
        var filePath = res.tempFilePath    
        wx.openDocument({
          filePath: filePath,
          success: function(res) {
          }
        })
      }
    })
  },

  //适用场馆
  address: function() {
    if (this.data.deposits.usableCenterCount == 0 || this.data.deposits.usableCenterCount == null) {
      return
    }
    wx.navigateTo({
      url: '/pages/index/courseInfoList?type=11&depositId=' + this.data.deposits.depositId,
    })
  },

  //授课教练
  teaching: function() {
    if (this.data.deposits.courseTrainerCount == 0 || this.data.deposits.courseTrainerCount == null){
      return
    }
    wx.navigateTo({
      url: '/pages/index/courseInfoList?type=12&depositId=' + this.data.deposits.depositId,
    })
  },

  //消课记录
  courseConsume: function(){
    wx.navigateTo({
      url: '/pages/index/courseConsume?seleinfo=' + JSON.stringify(this.data.deposits),
    })
  }


})