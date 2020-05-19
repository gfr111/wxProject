// pages/cardsPurchaseOnline/usePlace.js
var centerService = require("../../service/centerService.js");
var requestUtil = require('../../utils/requestUtil.js');
var buyCardService = require("../../service/buyCardService.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    place: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    buyCardService.getusefulClub(options.id,'false').then((res) => {
      // console.log(JSON.stringify(res));
      console.log(res)
      that.setData({
        place: res
      })
    })
  },
  callSome: function (e) {
    console.log(e.currentTarget.dataset.phone)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
    })

  },
 
})