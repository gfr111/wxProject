// pages/cardsPurchaseOnline/availableCardsList.js
var app = getApp();
var systemMessage = require("../../SystemMessage.js");
var buyCardService = require("../../service/buyCardService.js");
var P = require('../../lib/wxpage.js');
P(" cardsPurchaseOnline/availableCardsList",{

  /**
   * 页面的初始数据
   */
  data: {
    cards: [],
    centerName: ""
  },
  //页面间跳转开始时调用，此时本页面并未被加载
  onNavigate: function (res) {
    this.preDataRequest();
  },
  preDataRequest: function () {
    var that = this;
    that.dataRequest(function (res) {
     // console.log('--------'+JSON.stringify(res));
      that.$put('cardsList', res);
    })
  },
  dataRequest: function (callBack) {
    console.log('--------------')
    buyCardService.getSellCards().then((res) => {
      callBack(res.cards);
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('--------------')
    this.setData({
      centerName: app.globalData.selectCenter.name
    });
    this.refresh();
  },
  refresh: function () {
    var res = this.$take('cardsList');
    if (res) {
      this.setData({
        cards: res
      })
    }
    else {
      this.getData();
    }
  },

  getData: function () {
    if (app.globalData.token) {
      var that = this;
      that.dataRequest(function (res) {
        that.setData({
          cards: res
        })
      })
    }
  },
  

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.$take('cardsList')
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      path: "/pages/mine/mine"
    }
  }
})