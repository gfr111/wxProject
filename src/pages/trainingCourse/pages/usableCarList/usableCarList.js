// pages/trainingCourse//pages/usableCarList/usableCarList.js
var centerService = require('../../../../service/centerService.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.setData({
       id:options.id
     })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  toDetail(e) {
    wx.navigateTo({
      url: '../../../cardsPurchaseOnline/availableCardDetail?id=' + e.currentTarget.dataset.id +'&pageTip=cars',
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    centerService.getCheckTraineeUsefulCards(this.data.id).then((res) => {
      this.setData({
        list: res
      })
    })
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