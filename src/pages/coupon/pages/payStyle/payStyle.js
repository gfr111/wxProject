// pages/coupon/pages/payStyle/payStyle.js
var centerService = require("../../../../service/centerService.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isWechat:'',
    cardList:[],
    contractId:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    centerService.getStoreValueCardList().then((res)=>{
      that.setData({
        isWechat: options.isWechat,
        cardList:res,
        contractId: options.contractId
      })
    })
    console.log(options)
  },
  chooseWechat: function () {
    this.setData({
      isWechat: true,
      contractId:0
    })
   var data=JSON.stringify({
     isWechat: this.data.isWechat,
     contractId:0
   })
    wx.setStorage({
      key: 'valueCard',
      data: data,
      success(res) {
        wx.navigateBack();
      },

    })
  },
  selectCard:function(e){
     this.setData({
       isWechat: false,
       contractId: e.currentTarget.dataset.contractid
     })
    var data = JSON.stringify({
      isWechat: this.data.isWechat,
      contractId: e.currentTarget.dataset.contractid
    })
    wx.setStorage({
      key: 'valueCard',
      data: data,
      success(res) {
        wx.navigateBack();
      },

    })
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