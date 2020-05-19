// pages/cardsPurchaseOnline/usePlace.js
var centerService = require("../../service/centerService.js");
var requestUtil = require('../../utils/requestUtil.js');
var buyCardService = require("../../service/buyCardService.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
     place:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
     if(options.buy=='true'){
       buyCardService.getusefulClubV2(options.id).then((res) => {
         that.setData({
           place: res
         })
       })
     }else{
       buyCardService.getusefulClub(options.id,'true').then((res) => {
         that.setData({
           place: res
         })
       })
     }
    
  },
  callSome:function(e){
    console.log(e.target.dataset.phone)
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.phone,
    })

  }
})