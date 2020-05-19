var config = require('../../config.js');
var loginService = require('../../service/loginService.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src:null,
    showPop:false,
    showTip:true,
    status:0,
    uploadImg:'',
    second:3,
    positions:'front'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      uploadImg: options.filePath
    })
  },
  takePhoto() { 
    var that=this;
    // 用户已经同意小程序使用功能，后续调用接口不会弹窗询问
    const ctx = wx.createCameraContext();
    setTimeout(function () {
      that.setData({
        positions: 'front'
      })
      ctx.takePhoto({
        quality: 'normal',
        success: (res) => {
          wx.showLoading({
            title: '认证中',
          })
          wx.uploadFile({
            url: config.host + '/wxApp/' + getApp().globalData.selectCenter.id + '/updatePhoto',
            filePath: res.tempImagePath,
            name: 'file',
            header: {
              'WXAPPCHATID': getApp().globalData.token
            }, // 设置请求的 header
            formData: {
              base: that.data.uploadImg
            }, // HTTP 请求中其他额外的 form data
            success: function (info) {
              if (JSON.parse(info.data).status == 0) {
                wx.hideLoading();
                that.countdown();
                that.setData({
                  status: 1,
                  showPop: true
                })
              } else {
                wx.hideLoading();
                that.setData({
                  status: 2,
                  showPop: true
                })
              }
            }
          })
        },
        fail: (e) => {
         }
      }, 1000)
    })

  
  }, 
  error(e) {
    console.log(e.detail)
  },
  // 倒计时
  countdown: function () {
    var that = this;
    var second = that.data.second
    if (second == 1) {
     that.toMineEvent();
    }
    var timer = setTimeout(function () {
      that.setData({
        second: second - 1,
      });
      that.countdown();
    }
      , 1000)
  },
  toMineEvent:function(){
    loginService.getUserAccount().then((res) => {
      wx.setStorageSync('account', res.account);
    })
    wx.reLaunch({
      url: '/pages/mine/mine',
    })
  },
  hideTip: function () {
    this.setData({
      showTip: false
    })
  },
  againProbate:function(){
     this.setData({
       showPop:false,
       src: null
     })
  },
  modifyPhoto:function(){
    wx.navigateBack();
  },
  
})