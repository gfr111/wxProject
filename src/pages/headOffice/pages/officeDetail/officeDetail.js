// pages/headOffice/pages/officeDetail/officeDetail.js
var headOfficeService = require('../../../../service/headOfficeService.js');
var storageUtil = require('../../../../utils/storageUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clubId:'',
    clubDetail:'',
    markers:[],
    notice:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      clubId: options.clubId
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
    var that=this;
    headOfficeService.getBranchCenterDetail(this.data.clubId).then((res)=>{
      that.setData({
        clubDetail:res,
        markers:[{
          id: res.id,
          latitude: res.latitude,
          longitude: res.longitude,
          iconPath: '../../images/marker.png',
          width:15,
          height:20,
        }]
      })
    })
  },
  callPhone(){
    wx.makePhoneCall({
      phoneNumber: this.data.clubDetail.phone //仅为示例，并非真实的电话号码
    })
  },
  navigation () {
    wx.openLocation({
      latitude: this.data.clubDetail.latitude,
      longitude: this.data.clubDetail.longitude,
      scale: 18,
      name: this.data.clubDetail.name,
      address: this.data.clubDetail.address
    })
  },


  toIndex: function () {
    let info = {
      id: this.data.clubDetail.id,
      name: this.data.clubDetail.name,
      address: this.data.clubDetail.address,
      phone: this.data.clubDetail.phone,
      clubType: this.data.clubDetail.clubType,
      photo: this.data.clubDetail.photo,
      fullNumber: this.data.clubDetail.fullNumber ? this.data.clubDetail.fullNumber : '',
      mainCenter: this.data.clubDetail.mainCenter
    }
    getApp().globalData.selectCenter = info;
    storageUtil.saveSelectCenter(info);
    wx.switchTab({
      url: '/pages/index/index',
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