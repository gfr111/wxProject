// pages/distribution//pages/distributionCenter/distributionCenter.js
var centerService = require("../../../../service/centerService.js"); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mess:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    centerService.getDistributorMess().then((res) => {
      console.log(res)
      this.setData({
        mess: res
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  toNextPage:function(e){
    var index = e.currentTarget.dataset.index;
    if(index==1){
      wx.navigateTo({
        url: '/pages/distribution/pages/saleRecord/saleRecord'
      })
    }else if(index==2){
      wx.navigateTo({
        url: '/pages/distribution/pages/inviteRecord/inviteRecord',
      })
    }else if(index==3||index==4){
      wx.navigateTo({
        url: '/pages/distribution/pages/posterList/posterList?form=' + (index - 1),
      })
    }
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