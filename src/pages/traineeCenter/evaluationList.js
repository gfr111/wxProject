// pages/traineeCenter/evaluationList.js
var requestUtil = require('../../utils/requestUtil.js');
var config = require("../../config.js")
var imgUrl = require("../../utils/uiUtils/imgUrl.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  reqgetseller() {
    var url = config.judgeList()
    requestUtil.postRequest(url).then(res => {
      if (res.length > 0) {
        for (var i = 0; i < res.length; i++) {
          var photo = imgUrl.getDefaultSpace(res[i].photo)
          res[i].photo = photo
        }
      }
      this.setData({
        list: res
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  toJudge(){
    wx.navigateTo({
      url: '/pages/traineeCenter/centerEvaluation',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.reqgetseller();
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