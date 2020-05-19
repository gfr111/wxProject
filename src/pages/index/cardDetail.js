// pages/index/cardDetail.js
var buyCardService = require("../../service/buyCardService.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showhide: false,
    id: 1402851,
    cardId: null,
    cardMess: null,
    ismodel: false
  },
  showModel() {
    this.setData({
      ismodel: true
    })
  },
  closemodel() {
      this.setData({
        ismodel: false
      })
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // console.log(options)
    this.setData({
      id: options.id,
      cardId: options.cardid
    })
    this.getDetail()
  },
  getDetail() {
    buyCardService.getMyCarDetail(getApp().globalData.selectCenter.id, this.data.id, false).then((res) => {
      console.log(res)
      this.setData({
        cardMess: res
      })
    })
  },
  toPro: function() {
    wx.navigateTo({
      url: '/pages/agreement/agreement?tp=1&protocolId=' + this.data.cardMess.protocol.id
    })
  },
  toElec: function() {
    wx.downloadFile({
      url: this.data.cardMess.electronicContractUrl,
      success: function(res) {
        var filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function(res) {
            console.log('打开文档成功')
          }
        })
      }
    })

  },
  toRecharge(){
    wx.navigateTo({
      url: '/pages/cardsPurchaseOnline/availableCardDetail2?id=' + this.data.cardId+'&alreadyBuy=true',
    })
  },
  toGym: function() {
    wx.navigateTo({
      url: '/pages/cardsPurchaseOnline/usePlace?id=' + this.data.cardMess.contract.id+'&buy='+true,
    })
  },
  toCourse: function() {
    wx.navigateTo({
      url: '/pages/cardsPurchaseOnline/useClass?id=' + this.data.cardMess.contract.id + '&buy=' + true,
    })
  },
  showEvent: function() {
    this.setData({
      showhide: true
    })
  },
  hideEvent: function() {
    this.setData({
      showhide: false
    })
  },
  todetail() {
    wx.navigateTo({
      url: '../expenseDetail/expenseDetail?id=' + this.data.cardMess.contract.id,
    })

  },
 
})