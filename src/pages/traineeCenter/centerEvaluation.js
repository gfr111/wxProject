// pages/traineeCenter/centerEvaluation.js
var config = require('../../config.js');
var requestUtil = require('../../utils/requestUtil.js');
var authenticationUtil = require('../../utils/authenticationUtil.js');
var loginService = require('../../service/loginService.js');
var app= getApp()
var submiting = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photo: [],
    photoUrl: [],
    text: null,
    uploadImgs:[],
    submited: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.goLogin()
    var id = options.centerId || options.scene
    if (id) {
      app.globalData.selectCenter = {
        id:id
      }
      loginService.getCenterList().then((res) => {
        res.map(item => {
          if (item.id == id) {
            app.globalData.selectCenter = item
            wx.setStorageSync('selectCenterKey', item)
            this.setData({
              selectCenter: item
            })
          }
        })
      })
    }
  },

  goLogin: function(){
    if (app.globalData.token == null) {
      app.globalData.receive = true
      authenticationUtil.checkAuthToken();
    }
  },

  selectPhoto: function() {
    if (app.globalData.token == null) {
      this.goLogin()
    } else {
    var that = this;
    wx.chooseImage({
      count: 3 - that.data.photo.length, // 默认9
      success: function(res) {
        that.setData({
          photo: that.data.photo.concat(res.tempFiles),
          photoUrl: that.data.photoUrl.concat(res.tempFilePaths)
        })

      }
    })}
  },
  showPhoto: function(e) {
    wx.previewImage({
      current: e.target.dataset.url,
      urls: this.data.photoUrl
    })
  },

  getText: function(e) {
    this.setData({
      text: e.detail.value
    })
  },
  deleteImg: function(e){
    this.data.photoUrl.splice(e.target.dataset.index,1)
    this.data.photo.splice(e.target.dataset.index,1)

    this.setData({
      photo: this.data.photo,
      photoUrl: this.data.photoUrl
    })
  },
  uploadEvaluation: function() {
    if (app.globalData.token == null) {
      this.goLogin()
    } else {
    if (submiting){
      return;
    }
    if (this.data.text == null || this.data.text == '' || this.data.text.length > 250) {
      wx.showToast({
        title: '反馈内容为1-250个字符',
        icon:'none'
      })
      return;
    }
    submiting = true
    if (this.data.photoUrl.length>0){
      this.uploadImg(0)
    }else{
      this.submitEva()
    }
    }
  },
uploadImg:function(i){
  if (app.globalData.token == null) {
    this.goLogin()
  }else{
  var header = {
    'WXAPPCHATID': getApp().globalData.token
  };
  var that = this;
  wx.uploadFile({
    url: config.uploadImgUrl(),
    filePath: this.data.photoUrl[i],
    header: header,
    name: 'file',
    success: function (res) {
      console.log(JSON.stringify(res))
      console.log(JSON.stringify(res["data"]))
      var data = res["data"]
      var a = JSON.parse(data);
      if (a.status == 0) {
        
        that.data.uploadImgs.push(a.data)
      
      }
      else {
        wx.showToast({
          title: '第' + i + '张照片上传失败',
          icon:'none'
        })
        }   
    },
    fail:function(res){
      wx.showToast({
        title: '第' + i + '张照片上传失败',
        icon: 'none'
      })
      console.log(JSON.stringify(res))
    },
    complete: function(){

      if (i + 1 < that.data.photoUrl.length) {
        that.uploadImg(i + 1)
      }else{
        that.submitEva()
      }
    }
  })}
},
submitEva: function(){
  
  var that = this;
  requestUtil.postRequest(config.submitEvaUrl(), {
    feedback:this.data.text,
    pictures: this.data.uploadImgs}).then(res=>{
     that.setData({
       submited: true
     })
      submiting = false
    }).catch(err=>{
      submiting = false
    })
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})