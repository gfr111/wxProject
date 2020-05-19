// pages/servicepassword/servicepassword.js

var app = getApp();
var centerService = require('../../service/centerService.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: 0,//服务密码状态：0：未设置；1：已设置，可修改
    password: '',//输入的密码
    againPassword: '',//再次输入的密码 
    tp: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({ status: options.status })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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




  /*********页面点击事件*********/

  password: function(e){
    var idx = e.currentTarget.dataset.idx
    if (idx == "0"){
      this.setData({ password: e.detail.value+'', tp: '0' })
    }else{
      this.setData({ againPassword: e.detail.value+'', tp: '1' })
    }
    
  },

  cleanPassword: function(e) {
    var that = this
    if (that.data.tp == '0'){
      that.setData({ password: '' })
    }else{
      that.setData({ againPassword: '' })
    }
  },

  //确定
  sureClick: function(){
    var that = this
    var pw = that.data.password
    var apw = that.data.againPassword
    if (!isShowToast(pw)){
      return
    }
    if (!isShowToast(apw)){
      return
    }

    if (pw != apw){
      wx.showToast({
        title: '两次密码输入不一致',
        icon: 'none'
      })
      return
    }
    console.log(pw)
    var param = { 'password': pw }
    centerService.putServicePassword(param).then((res) => {
      if (res == true){
        wx.showToast({
          title: '设置成功',
          icon: 'none'
        })
        setTimeout(function(){
          // wx.setStorageSync("servicePwd", pw)
          wx.navigateBack({})
        },300)
      }
    })
  },



})


function isShowToast(str) {
  if (str.length == 0 || str == null) {
    wx.showToast({
      title: '请输入密码',
      icon: 'none'
    })
    return false
  }
  if (str.length != 6){
    wx.showToast({
      title: '密码长度至少六位',
      icon: 'none'
    })
    return false
  }
  return true
}