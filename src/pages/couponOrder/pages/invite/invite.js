// pages/couponOrder//pages/invite/invite.js
var headOfficeService = require("../../../../service/headOfficeService.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invite:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var centerId=getApp().globalData.selectCenter.id;
    headOfficeService.getInviteDetail(centerId,null).then((res)=>{
      this.setData({
        invite:res
      })
    })
  },
  toDetail(){
    wx.navigateTo({
      url: '/pages/couponOrder/pages/inviteList/inviteList?id=' + this.data.invite.invitation.id,
    })
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
    var url = '/pages/couponOrder/pages/openInvite/openInvite?inviterId=' + getApp().globalData.account.id + '&centerId=' + getApp().globalData.selectCenter.id + '&activityId=' + this.data.invite.invitation.id;
    var img = '../../resources/shareCard.jpg';
    return {
      title: getApp().globalData.account.name + '送您一张会员卡',
      path: url,
      imageUrl: img
    }
  }
})