// pages/coupon//pages/shareCard/shareCard.js
var buyCardService = require("../../../../service/buyCardService.js");
var imgUrl = require("../../../../utils/uiUtils/imgUrl.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count:'',
    num:'',
    time:'',
    contractId:'',
    remianCount:"",
    result:'',
    showPop:false,
    img:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.img && options.img!="null"){
      options.img = imgUrl.getDefaultSpace(options.img)
    }
    this.setData({
      contractId: options.contractId,
      remianCount:options.count,
      img:options.img
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getNum(e){
    if (e.currentTarget.id==0){
      this.setData({
        count:e.detail.value
      })
      if(this.data.num!=''){
        if (e.detail.value * this.data.num > this.data.remianCount){
          return wx.showToast({
            title: '超出可分享次数',
            icon:'none'
          })
        }
      }
    } else if (e.currentTarget.id == 1) {
      this.setData({
        num: e.detail.value
      })
      if (this.data.count != '') {
        if (e.detail.value * this.data.count > this.data.remianCount) {
          return wx.showToast({
            title: '超出可分享次数',
            icon: 'none'
          })
        }
      }
    } else if (e.currentTarget.id == 2) {
      this.setData({
        time: e.detail.value
      })
    }
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
  loadShareBox(){
    var that = this;
    var data = {
      receiveCount: this.data.count,
      peopleCount: this.data.num,
      duration: this.data.time
    }
    buyCardService.submitShareCard(this.data.contractId, data).then((res) => {
      that.setData({
        result: res,
        showPop: true
      })
    })
  },
  cancelShare(){
    buyCardService.cancelhareCard(this.data.result).then((res) => {
      this.setData({
        showPop: false
      })
      wx.showToast({
        title: '已取消分享',
        icon:'none'
      })
    })
    
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    this.setData({
      showPop:false
    })
    var url = '/pages/coupon/pages/openShareCard/openShareCard?shareId=' + this.data.result + '&centerId=' + getApp().globalData.selectCenter.id;
    var img =  '../../resources/shareCard.jpg' ;
    console.log(img)
    return {
      title: getApp().globalData.account.name + '的分享',
      path: url,
      imageUrl: img
    }
  }
})