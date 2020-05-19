
import sharediet from '../../palette/sharePoster';
var centerService = require("../../../../service/centerService.js"); 
var app = getApp()
Page({
  imagePath: '',
  /**
   * 页面的初始数据
   */
  data: {
    template: {},
    list: {},
    pic: '',
    isauthSetting: false,
    imagePath:''
  },
  onLoad(options) {
    this.setData({
      id: options.id
    })
    this.reqdetail(options.id)
  },

  reqdetail(id) {
    var data={
      background:'',
      qrcode:''
    };
    centerService.getInviteQrcode(id).then((res) => {
      data.qrcode = res;
      centerService.getPosterDetail(id).then((rep) => {
        var photo = app.globalData.account.photo;
        if(photo.indexOf('static')!=-1){
          photo='';
        }
        if (app.globalData.account.photo)
        data.background = rep.background;
        data.photo = photo ? photo :'../../../../images/default_user.png';
        data.name = app.globalData.account.name;
        this.setData({
          template: new sharediet().palette(data),
          data: data
        })
      })
    })
  },

  onImgOK(e) {
    this.imagePath = e.detail.path;
    this.setData({
      imagePath: e.detail.path
    });
  },

  saveImage() {
    console.log(this.imagePath)
    wx.saveImageToPhotosAlbum({
      filePath: this.imagePath,
      success: res => {
        wx.showToast({
          title: '保存成功'
        })
        this.setData({
          isauthSetting: true
        })
      },
      fail: err => {
        console.log(err)
        if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail:auth denied") {
          this.setData({
            isauthSetting: false
          })
          wx.showToast({
            title: '保存失败',
            icon:'none'
          })
        }
      }
    });
  },
  getopensetting(e) {
    if (e.detail.authSetting['scope.writePhotosAlbum']) {
      this.saveImage();
      this.setData({
        isauthSetting: true
      })
      console.log('success')
    } else {
      console.log('error')
      wx.showToast({
        title: '授权以后才能保存哦~~',
        icon:'none'
      })
    }
  },
  onShow() {
    var isauthSetting = false
    wx.getSetting({
      success: res => {
        console.log(res)
        console.log(JSON.stringify(res.authSetting) == '{}')
        console.log(res.authSetting)
        console.log(res.authSetting['scope.writePhotosAlbum'] == true)
        console.log(res.authSetting && res.authSetting['scope.writePhotosAlbum'] == true)
        if (JSON.stringify(res.authSetting) == '{}' || res.authSetting && res.authSetting['scope.writePhotosAlbum'] == true) {
          isauthSetting = true
        }
        this.setData({
          isauthSetting: isauthSetting
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var url = '/pages/distribution/pages/openShare/openShare?posterId=' + this.data.id + '&inviteId=' + getApp().globalData.account.id + '&centerId=' + getApp().globalData.selectCenter.id;
    console.log(url)
    return {
      title: getApp().globalData.account.name+'的邀请',
      path: url
    }
  },
  onHide() { 
    
  }
});