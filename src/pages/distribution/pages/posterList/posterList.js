// pages/distribution//pages/posterList/posterList.js
var centerService = require("../../../../service/centerService.js"); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form:'',
    list:[]
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      form: options.form
    })
    if (options.form==3){
      wx.setNavigationBarTitle({
        title: '邀请海报'
      })
    }else{
      wx.setNavigationBarTitle({
        title: '推广海报'
      })
    }
    centerService.getPosterList(options.form).then((res)=>{
      this.setData({
        list:res
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  toPoster(e){
    if(this.data.form==3){
      wx.navigateTo({
        url: '/pages/distribution/pages/poster/poster?id=' + e.currentTarget.dataset.id,
      })
    }else{
      wx.navigateTo({
        url: '/pages/distribution/pages/posterExtension/posterExtension?id=' + e.currentTarget.dataset.id,
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})