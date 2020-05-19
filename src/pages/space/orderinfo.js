// pages/space/orderinfo.js
var util = require('../../utils/util.js')
var centerService = require("../../service/centerService.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderDetail: null,
    orderStatus: 0,//0:已取消；1:已过期；2:等待付款；3:待核销；4:已完成
    startTime: 0, // 是否在可取消时间内：0：在；1：不在
    reducePrice:null,
    showModal:false,
    qrCode:null,
    status:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var that = this
     that.getSiteMyreservationDetail(options.dataID);
     if(options.status!=undefined){
       that.setData({
         status: options.status
       })
     }
  },
  onCancle: function () {
    var that = this;
    that.setData({ showModal: false })
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
    if(this.data.status!=null){
      wx.reLaunch({
        url: '/pages/mine/mine'
      })
    }
    
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

  },




  /*******页面事件or请求******/
  //导航
  addressNav: function () {
    var that = this;
    wx.openLocation({
      // latitude: Number(that.data.store.latitude),
      // longitude: Number(that.data.store.longitude),
      // name: that.data.store.storeName,
      // address: that.data.store.province + that.data.store.city + that.data.store.region + that.data.store.address
    })
  },

  //取消预订
  cancle: function () {
    var that = this;
      wx.showModal({
        title: '提示',
        content: '取消预订后，将无法恢复',
        cancelText: '取消',
        cancelColor: '#A3A3A3',
        confirmText: '确认',
        confirmColor: '#FF6363',
        success(res) {
          if (res.confirm) {
            that.getCancleOrder();
          } else if (res.cancel) {
          }
        }
      })
  },

  //立即付款
  payFor: function () {
    wx.showToast({
      title: '立即付款',
      icon: 'none'
    })
  },
  //去核销
  verification: function () {
    // wx.showToast({
    //   title: '去核销',
    //   icon: 'none'
    // })
    var that = this;
    that.setData({ showModal: true })
    centerService.getSignQr(that.data.orderDetail.reserve.orderNo).then((res)=>{
      console.log(res)
      that.setData({
        qrCode:res
      })
    })
  },

  //重新预订
  again: function () {
    wx.switchTab({
      url: '/pages/space/spaceBookList',
    })
  },


  //发起取消预订的请求
  getCancleOrder: function () {
    var that=this;
    centerService.submitRemoveSpace(that.data.orderDetail.reserve.id).then((res)=>{
        console.log(res)
        if(res){
          wx.showToast({
            title: '已成功取消预订！',
            icon: 'none'
          })
          setTimeout(function(){
            if (that.data.status != null) {
              wx.reLaunch({
                url: '/pages/mine/mine'
              })
            } else {
              wx.navigateBack()
            }
          },500)
        }
    })
  },


  /******request******/

  getSiteMyreservationDetail: function(id){
    var that = this;
    centerService.getSiteMyreservationDetail(id).then((res) => {
      if (res.reserve.price&&res.reserve.realAmount){
        that.setData({
          orderDetail: res,
          reducePrice: util.floatSub(res.reserve.price, res.reserve.realAmount)
        })
      }else{
        that.setData({
          orderDetail: res,
          reducePrice: util.floatSub(res.reserve.price,0)
        })
      }
    })
  },

})