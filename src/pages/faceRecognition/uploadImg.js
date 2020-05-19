// pages/faceRecognition /faceRecognition .js
var config = require('../../config.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowPop:false,
    showTip:true,
    imgFile:null,
    base64Img:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  hideTip:function(){
    this.setData({
      showTip:false
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  showPop:function(){
    this.setData({
      isShowPop: true
    })
  },
  hidePop: function () {
    this.setData({
      isShowPop: false
    })
  },
  inbtn: function (e) {

  },
 
   takePhotoEvent:function(){
     var that = this;
     wx.chooseImage({
       count: 1, // 最多可以选择的图片张数，默认9
       sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
       sourceType: ['camera'], // album 从相册选图，camera 使用相机，默认二者都有
       success: function (res) {
         that.setData({
           imgFile:res.tempFilePaths[0],
           isShowPop:false,
           base64Img: encodeURI(wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], 'base64'))
         })
       },
       fail: function () {
         // fail
       },
       complete: function () {

       }
     })
   },
  chooseImgEvent:function(){
    var that = this;
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        that.setData({
          imgFile: res.tempFilePaths[0],
          isShowPop: false,
          base64Img: encodeURI(wx.getFileSystemManager().readFileSync(res.tempFilePaths[0], 'base64'))
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {

      }
    })
  },
  toComparePage:function(){
    wx.navigateTo({
      url: '/pages/faceRecognition/comparePage?filePath=' + this.data.base64Img,
    })
  },
  
})