// pages/space/bookingpeopleinfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: null,
    phone: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  },



  /*****************/

  nameInput: function (e) {
    var that = this;
    that.setData({ name: e.detail.value })
  },

  phoneInput: function (e) {
    var that = this;
    that.setData({ phone: e.detail.value })
  },

  sure: function () {
    var that = this;
    var name = that.data.name;
    var phone = that.data.phone;
    if (!name || name == null || name.length == 0) {
      wx.showToast({
        title: '预订人姓名不能为空',
        icon: 'none'
      })
      return;
    }
    if (!isTel(phone)) {
      return;
    }
    var pages = getCurrentPages();
    if (pages.length > 1) {
      var prePage = pages[pages.length - 2];
      prePage.changeData(that.data.name, that.data.phone);
      wx.navigateBack({
      });
    }
  },
})


/*验证是否为手机号*/
function isTel(tel) {
  if (tel == null) {
    wx.showToast({
      title: '请填写手机号',
      icon: 'none',
    })
    return false;
  }
  if (tel.length != 11) {
    wx.showToast({
      title: '请填写正确的手机号',
      icon: 'none',
    })
    return false;
  }
  if (tel.slice(0, 1) != '1') {
    wx.showToast({
      title: '请填写正确的手机号',
      icon: 'none',
    })
    return false;
  }
  return true;
}