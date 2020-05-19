// pages/space/buyCarList.js

var centerService = require("../../service/centerService.js");


Page({

  /**
   * 页面的初始数据
   */
  data: {
    groundId: '',//场地id
    deduction: [],//扣卡
    discount: [],//折扣，优惠
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('---页面参数---', options)
    var that = this
    that.setData({ groundId: options.groundId })
    that.buyCarList(that.data.groundId)
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


  /******页面请求数据******/

  buyCarList: function (groundId){
    var that = this
    centerService.buyCarList(groundId).then((res) => {
      console.log('---结果---', res)
      that.setData({
        deduction: res.deductionSettings,
        discount: res.discountSettings
      })
    })
  },

  //进入会员卡详情

  chooseCar: function(e){
    var that = this
    var online = e.currentTarget.dataset.online
    if (online == false){
      wx.showModal({
        content: '该会员卡不可在线购买',
        showCancel: false
      })
      return
    }
    wx.navigateTo({
      url: '/pages/space/buyCarInfo?id=' + e.currentTarget.dataset.id,
    })
  },
})