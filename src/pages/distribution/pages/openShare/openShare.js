// pages/distribution//pages/openShare/openShare.js
var centerService = require("../../../../service/centerService.js"); 
var app = getApp();
var authenticationUtil = require('../../../../utils/authenticationUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mess:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.scene)
    if (options.scene) {
      var option = options.scene.split("_");
      app.nologincenterInfo(option[0], res => {
        centerService.getScanPosterDetail({scene:options.scene}).then((res)=>{
          console.log(res)
          this.setData({
            mess:res
          })
        })
      })
    }else{
      app.nologincenterInfo(options.centerId, res => {
        centerService.getInvitePosterDetail(options.centerId, options.posterId, options.inviteId).then((res) => {
          console.log(res)
          this.setData({
            mess: res
          })
        })
      })
     
    }

  },
  acceptPoster(){
    if (app.globalData.token == null) {
      authenticationUtil.checkAuthToken();
    }else{
      var data = {
        centerId: this.data.mess.centerId,
        inviterId: this.data.mess.inviter.inviterId,
        inviteByConsultant: this.data.mess.inviter.inviteByConsultant
      };
      centerService.getAcceptInvite(this.data.mess.centerId, this.data.mess.inviter.inviterId, this.data.mess.inviter.inviteByConsultant, data).then((res) => {
        wx.showToast({
          title: '成功接受邀请',
        })
        setTimeout(function () {
          wx.switchTab({
            url: '/pages/mine/mine',
          })
        }, 1000)
      })
    }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})