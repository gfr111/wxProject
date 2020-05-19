// pages/space/spaceDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPhone:false,
    sapceDetail:null,
    height: '',
  },
  preventTouchMove: function (e) {
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight,
        })
      }
    })
    this.setData({
      sapceDetail: JSON.parse(options.spaceDetail)
    })
    // console.log(this.data.sapceDetail)
  },
  callTel:function(){
   this.setData({
     showPhone:true
   })
  },
  intoMap: function () {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {  //因为这里得到的是你当前位置的经纬度
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({        //所以这里会显示你当前的位置
          latitude: 35.8087080000,
          longitude: 119.7298510000,
          name: "瑞博国际店",
          address: "中国山东省青岛市开平路533号",
          scale: 14
        })
      }
    })
  },
  cancelTel:function(){
    this.setData({
      showPhone: false
    })
  },
  phoneEvent:function(){
    var that=this;
    wx.makePhoneCall({
      phoneNumber: that.data.sapceDetail.phone// 仅为示例，并非真实的电话号码
    })
  },
  hidePhone:function(){
    this.setData({
      showPhone: false
    })
  },
  inbtn: function (e) {
    
  },
  toMap:function(){
    wx.navigateTo({
      url: '/pages/space/spaceMap',
    })
  },
  previewImgs:function(){
    var that=this;
    wx.previewImage({
      current: that.data.sapceDetail.sitesPhoto, // 当前显示图片的http链接
      urls: [that.data.sapceDetail.sitesPhoto]
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

  }
})