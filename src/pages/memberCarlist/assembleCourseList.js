// pages/memberCarlist/assembleCourseList.js
var centerService = require('../../service/centerService.js');
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupBookings:'',
    timeUtils:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    centerService.getBookingList().then((res) => {
      var arr = res;
      arr.forEach(item => {
        if (item.startTs > Date.parse(new Date())) {
          item.startTime = util.get_time_diff(item.startTs)
        }
      })
      this.setData({
        groupBookings: arr,
        timeUtils: Date.parse(new Date())
      })
    })
  },
  toAssembleDetail(e) {
    var id = e.currentTarget.dataset.id;
    this.data.groupBookings.forEach(item => {
      if (id == item.objectId) {
        console.log(item.objectType)
        if (item.objectType != 1) {
          wx.navigateTo({
            url: '/pages/courseBuyOnline/availableCourseDetail?id=' + item.objectId + '&pageTip=courses',
          })
        } else {
          wx.navigateTo({
            url: '/pages/cardsPurchaseOnline/availableCardDetail?id=' + item.objectId + '&pageTip=cars',
          })
        }

      }
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