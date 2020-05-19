// pages/tickets/tickets.js
var headOfficeService = require("../../service/headOfficeService.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ticketList:[],
    currentData:0,
    listHeight:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          listHeight: res.windowHeight - 85
        })
      }
    })
  },
  toDetail(e){
    var id=1;
   wx.navigateTo({
     url: '/pages/couponOrder/pages/newCouponDetail/newCouponDetail?id=' + e.currentTarget.dataset.id,
   })
  },
  toCenter(){
    wx.navigateTo({
      url: '/pages/couponOrder/pages/newCouponCenter/newCouponCenter',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  bindchange: function (e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
    that.getList();
  },
  //点击切换，滑块index赋值 
  checkCurrent: function (e) {
    const that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current
      })
      that.getList();
    }

  }, 
  getList(){
    var that = this
    headOfficeService.getCouponList(this.data.currentData == 0 ? 3 : this.data.currentData == 1?2:1).then((res) => {
      res.forEach((item)=>{
        item.selected=false;
      })
      that.setData({
        ticketList: res
      })
    })
  },
  showBizType(e){
    var arr = this.data.ticketList;
    arr.forEach((item) => {
      if (e.currentTarget.dataset.id == item.id){
        item.selected = !item.selected;
      }else{
        item.selected = false
      }
    })
    this.setData({
      ticketList:arr
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getList();
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