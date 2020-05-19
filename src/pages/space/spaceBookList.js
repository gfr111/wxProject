// pages/space/spaceBook.js
var unlock = require('../../service/unlock.js');
var centerService = require("../../service/centerService.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectCenter: null,
    spaceList: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height: res.windowHeight,
        })
      }
    })





  },
  // goCenterList: function() {
  //   wx.navigateTo({
  //     url: '/pages/centers/centerList',
  //   });
  // },
  toBook: function(e) {
    var id = e.currentTarget.dataset.id;
    for (var i = 0, len = this.data.spaceList.length; i < len; i++) {
      if (id == this.data.spaceList[i].id) {
        wx.navigateTo({
          url: '/pages/space/book?spaceMess=' + JSON.stringify(this.data.spaceList[i]),
        })
      }
    }
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

    centerService.getOrderSpaceList().then((res) => {
        this.setData({
          spaceList: res
        })
    })
  },

})