
import sharediet from '../../palette/extensionPoster';
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
    id:'',
    imagePath:''
  },
  onLoad(options) {
    this.setData({
      id: options.id
    })
    this.reqdetail(options.id)
  }, 

  reqdetail(id) {
    var data={};
    centerService.getGoodsQrcode(id).then((res) => {
      data.qrcode = res;
      centerService.getPosterDetail(id).then((rep) => {
        data.background = rep.background;
        this.setData({
          template: new sharediet().palette(data),
          data: data,
          id: rep.distributionObjId
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
    wx.saveImageToPhotosAlbum({
      filePath: this.imagePath,
      success: res => {
        wx.showToast({
          title: '保存成功',
        })
        this.setData({
          isauthSetting: true
        })
      },
      fail: err => {
        if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
          this.setData({
            isauthSetting: false
          })
        }
      }
    });
  },
  getopensetting(e) {
    if (e.detail.authSetting['scope.writePhotosAlbum']) {
      this.saveImage()
      this.setData({
        isauthSetting: true
      })
    } else {
      util.warn('授权以后才能保存哦~~')
    }
  },
  onShow() {
    var isauthSetting = false
    wx.getSetting({
      success: res => {
        if (JSON.stringify(res.authSetting) == '{}' || res.authSetting && res.authSetting['scope.writePhotosAlbum'] == true) {
          isauthSetting = true;
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
    return {
      title: '会员卡',
      path: '/pages/cardsPurchaseOnline/availableCardDetail?id=' + this.data.id + '&centerId=' + getApp().globalData.selectCenter.id + '&distributorId=' + getApp().globalData.account.id+ '&pageTip=cars' 
    }
  },
  onHide() { }
});