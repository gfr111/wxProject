// pages/locker/openLocker.js
var app = getApp();
var centerService = require('../../service/centerService.js')
var buyCardService = require("../../service/buyCardService.js");
var centerService = require('../../service/centerService.js');
var storageUtil = require('../../utils/storageUtil.js');
var promiseUtil = require('../../utils/promiseUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cabinetStatus:null,//1：分柜成功,2：分柜失败,3:未签到,4:已过期，
    cabinetCode:1111,
    message:'您正在使用A1001更衣柜',
    loadingStatus:false,
    centerImg:null,
    scene: null,
    centerName:null,
    cabinetType:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.data.scene = options.scene
    console.log(options)
    var that = this
    if (that.data.scene != null) {
      this.data.centerId = this.data.scene.split("_")[0]
      this.data.deviceId = this.data.scene.split("_")[1]
      this.data.type = this.data.scene.split("_")[2]
      this.data.endTimeOr = this.data.scene.split("_")[3]
    }
    if (app.globalData.isAppOnShow) {
      app.globalData.isAppOnShow = false;
      if (that.data.scene != null) {
        let info = {
          id: this.data.centerId
        }
        app.globalData.selectCenter = info;
        storageUtil.saveSelectCenter(info);
      }

      if (!app.globalData.token && that.data.scene != null) {
        var wxGetExtConfig = promiseUtil.wxPromisify(wx.getExtConfig);
        wxGetExtConfig().then((res) => {
          if (JSON.stringify(res.extConfig) != '{}') {
            wx.setNavigationBarTitle({
              title: res.extConfig.centerName
            });
          }
        })
      }
    }
    else {
      if (that.data.scene != null) {
        let info = {
          id: this.data.centerId
        }
        app.globalData.selectCenter = info;
        storageUtil.saveSelectCenter(info);

        var wxGetExtConfig = promiseUtil.wxPromisify(wx.getExtConfig);
        wxGetExtConfig().then((res) => {
          if (JSON.stringify(res.extConfig) != '{}') {
            wx.setNavigationBarTitle({
              title: res.extConfig.centerName
            });
          }
        })
      }
    }
    if (app.globalData.token == null) {
      app.globalData.receive = true
    }
    app.checkAuthToken(function () {
      that.getMess();
    });
   
  },
  toIndexEvent:function(){
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  getMess(){
    var that=this;

    this.setData(
      {
        account: app.globalData.account
      })
    centerService.getLocker(that.data.centerId, that.data.deviceId, that.data.type,that.data.endTimeOr).then((res) => {
      console.log(res)
      if(res){
        that.setData({
          centerImg: res.centerLogo,
          centerName: res.centerName,
          })
      }
       if(res.locker!=undefined){
         that.setData({
           cabinetStatus:1,
           cabinetCode: res.locker.number,
           cabinetType: res.locker.typeStr,      
           loadingStatus: true
         })
       }
        if(res.status==1){
          that.setData({
            loadingStatus: true
          })
         if (res.failCode==1){
           that.setData({
             cabinetStatus: 3,
             loadingStatus: true
           })
         } else if (res.failCode == 2){
           that.setData({
             cabinetStatus: 4,
             cabinetCode: res.locker.number,
             cabinetType: res.locker.typeStr, 
             loadingStatus: true
           })
         } else if (res.failCode == 3){
           wx.showToast({
             title: res.message,
             icon: 'none'
           })
           that.setData({
             cabinetStatus: 2,
             message: res.message,
             cabinetCode: res.locker? res.locker.number:'xxx',
             cabinetType: res.locker.typeStr, 
             loadingStatus: true
           })
         
         } else if (res.failCode == 4){
           wx.showToast({
             title: res.message,
             icon: 'none'
           })
         }
       }
      if (that.data.scene != null) {
        app.globalData.selectCenter = res.center;
      //  console.log('--000' + app.globalData.selectCenter.name)
        storageUtil.saveSelectCenter(res.center);
        that.data.scene == null
      }


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