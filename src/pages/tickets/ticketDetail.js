// pages/tickets/ticketDetail.js
var app = getApp()
var buyCardService = require("../../service/buyCardService.js");
var config = require("../../config.js")
var requestUtil = require("../../utils/requestUtil.js")
var userQRCode = require('../../service/UserQRCode.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTicket:true,
    slider: 1,
     max:10,
    qrCode: "",
    datas:null
    
  },
  changeSlider(e) {
    console.log(e.detail.value)
    this.setData({ 
      slider: e.detail.value
     })
  },
  dispire:function(){
    this.setData({
      showTicket:true
    })
  },
  showModel:function(){
    this.setData({
      showTicket: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    console.log(options)
    buyCardService.getTicketDetail(options.id).then((res) => {
      console.log(res)
        that.setData({
          qrCode:res.qr,
          datas:res
        })
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

    var sharCode = parseInt(new Date().getTime() / 1000) + '' + this.data.datas.couponInstance.id;


    var code = null,shareId = null;
    var url = config.shareLinkUrl(this.data.datas.couponInstance.id, this.data.slider, sharCode);
    requestUtil.getRequest(url,null).then(res=>{
      console.log('/pages/tickets/share?code=' + sharCode + '&centerId=' + '-')
      
    })
    return {
      title: getApp().globalData.account.name + '送您' + this.data.slider + '张' + this.data.datas.couponName+'券',
      path: '/pages/tickets/share?code=' + sharCode + '&centerId=' + this.data.datas.couponInstance.centerId,
      imageUrl: '/images/share.png'
    }

  },

  actInfo: function(){
    var datas = this.data.datas
    var center = app.globalData.selectCenter
    console.log('---datas---', datas)
    console.log('---datas---', app.globalData)
    wx.navigateTo({
      url: '/pages/activity/activity?id=' + datas.activity.id + '&centerId=' + center.id + '&centerName=' + center.name + '&centerAddress=' + center.address + '&centerPhone=' + center.phone,
    })
  },
})