// pages/tickets/newCouponList.js
var headOfficeService = require("../../service/headOfficeService.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponList:[],
    chooseId:-1,
    price:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.price)
    this.getCoupon(options.id,options.type);
    this.setData({
       price: options.price*1
    })
    if (options.id != -1) {
      this.setData({
        chooseId: options.id,
       
      })
    }
  },
  // 获取优惠券
  getCoupon(id,type) {
    headOfficeService.getUsableCoupon(type).then((res) => {
      var arr = [];
      res.map((item) => {
        item.selected = false;
        if (item.amountLimit <= this.data.price) {
          arr.push(item)
        }
      })
      this.setData({
        couponList: arr
      })
    })
  },
  showBizType(e) {
    var arr = this.data.couponList; 
    arr.map((item) => {
      if (e.currentTarget.dataset.id == item.id) {
        item.selected = !item.selected;
      } else {
        item.selected = false
      }
    })
    this.setData({
      couponList: arr
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  chooseCoupon(e){
    var id = e.currentTarget.id
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    var arr = this.data.couponList;
    var coupon={};
    arr.forEach((item) => {
      if (id == item.id) {
          this.setData({
            chooseId: item.id
          })
          coupon = item;
      }
    })
    console.log(coupon.amountLimit)
    console.log(this.data.price)
    if (coupon.amountLimit > this.data.price) {
      wx.showToast({
        title: '不满足使用门槛',
        icon: 'none'
      })
      return;
    }else{
      this.setData({
        couponList: arr
      })
      prevPage.setData({
        coupon: coupon
      })
      wx.navigateBack({})
    }
   
  },
  nullCoupon(){
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      coupon: null
    })
    wx.navigateBack({})
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