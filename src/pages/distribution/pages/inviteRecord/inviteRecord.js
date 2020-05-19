// pages/distribution//pages/inviteRecord/inviteRecord.js
var centerService = require("../../../../service/centerService.js"); 
var imgUrl = require("../../../../utils/uiUtils/imgUrl.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight:'',
    pageNum:0,
    result:'',
    showMore:false,
    list:[],
    pageSize:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getlist();
  },
  getlist() {
    centerService.getInviteRecord(this.data.pageNum).then((res) => {
      if(res.data.length>0){
        for (var i = 0; i < res.data.length; i++) {
          var photo = imgUrl.getDefaultSpace(res.data[i].photo)
          res.data[i].photo = photo
        }
      }
      this.setData({
        result: res,
        list:res.data
      })
    })
  },
  toSaleRecord(e){
    console.log(e)
    wx.navigateTo({
      url: '/pages/distribution/pages/saleRecord/saleRecord?id=' + e.currentTarget.dataset.id,
    })
  },
  showMore() {
    this.data.pageNum++;
    centerService.getInviteRecord(this.data.pageNum).then((res) => {
      if (res.data.length == 0) {
        wx.showToast({
          title: '暂无更多数据',
          icon: 'none'
        })
        this.setData({
          showMore: false
        })
      } else {
        var arr = this.data.list
        res.data.forEach(function (item) {
          var photo = imgUrl.getDefaultSpace(item.photo)
          item.photo = photo
          arr.push(item)
        })
        this.setData({
          list: arr
        })
      }
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
    var that = this;
    wx.getSystemInfo({
      success(res) {
        that.setData({
          windowHeight: res.windowHeight - 90
        })
      }
    })
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