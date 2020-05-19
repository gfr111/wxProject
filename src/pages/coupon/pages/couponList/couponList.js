// pages/coupon/pages/couponList/couponList.js
var centerService = require("../../../../service/centerService.js");
var loginService = require('../../../../service/loginService.js');
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navList:[
      { 'name': '游泳', type: 1 },
      { 'name': '潜水',  type: 2 },
      { 'name': '攀岩',  type: 3 },
      { 'name': '篮球',  type: 4 },
      { 'name': '羽毛球',  type: 5 },
      { 'name': '其他', type: 99 }
    ],
    // navList: [
    //   { 'name': '游泳', type: 1 }
    // ],
    type:1,
    couponList:[],
    couponList: [],
    defaultHeight:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          defaultHeight: res.screenHeight-100
        })
      }
    })

    if (options.centerId) {
      app.globalData.selectCenter = {
        id: options.centerId
      }
      loginService.getCenterList().then((res) => {
        res.map(item => {
          if (item.id == options.centerId) {
            app.globalData.selectCenter = item
            wx.setStorageSync('selectCenterKey', item)
            this.setData({
              selectCenter: item
            })
          }
        })
        that.getList()
      })
    } else {
      that.getList()
    }

   
  },
  getList:function(){
    var that=this;
    centerService.getCouponList(that.data.type).then((res) => {
      that.setData({
        couponList: res
      })
    })
  },
  chooseNav:function(e){
    this.setData({
      type: e.currentTarget.dataset.type
    })
    this.getList()
  },
  toCouponDetail:function(e){
    if (e.currentTarget.dataset.item.usageType==1){   
      wx.navigateTo({
        url: '/pages/coupon/pages/couponDetail/couponDetail?id=' + e.currentTarget.dataset.id + '&saleDayLimit=' + e.currentTarget.dataset.item.saleDayLimit + '&closingDay=' + e.currentTarget.dataset.item.closingDay
      })
    }else{
      wx.navigateTo({
        url: '/pages/coupon/pages/couponDetail/couponDetail?id=' + e.currentTarget.dataset.id + '&saleDayLimit=' + e.currentTarget.dataset.item.effectiveDays
      })
    }

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
    wx.switchTab({
      url: '/pages/index/index',
    })
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