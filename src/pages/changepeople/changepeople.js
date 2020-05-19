// pages/changepeople/changepeople.js
var config = require('../../config.js')
var requestUtil = require('../../utils/requestUtil.js')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    thirdParty:''
  },
  req() {
    var url = config.linkers()
    var data={
      openId: wx.getStorageSync("openIdKey"),
      thirdParty: this.data.thirdParty
    }
    console.log(data)
    requestUtil.postRequest(url,data).then(res => {
      console.log(res)
      this.setData({
        owner: res.owner,
        ownerExists: res.ownerExists,
        relationTrainees: res.relationTrainees
      })
    })
  },
  change(e) {
    console.log(e)
    var id = e.currentTarget.id
    var url = config.getToken(id)
    requestUtil.getRequest(url).then(res => {
      var isother = id == this.data.owner.traineeId?false:true
      wx.setStorageSync("isother", isother)
      wx.setStorageSync("tokenKey", res['WXAPPCHATID'])
      wx.setStorageSync("account", res.account)
      app.globalData.account = res['account']
      app.globalData.token = res['WXAPPCHATID']

      if (id == this.data.owner.traineeId && !this.data.ownerExists) {
        wx.navigateTo({
          url: '/pages/centers/centerList',
        })
      } else {
        wx.navigateBack({})
      }

    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    let s = wx.getExtConfigSync()
    var thirdParty=false
    if (JSON.stringify(s)!='{}'){
      thirdParty=true
    }else{
      thirdParty=false
    }
    this.setData({
      thirdParty: thirdParty
    })
    this.req()
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