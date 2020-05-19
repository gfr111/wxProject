// pages/collage/collageList/collageList.js
var buyCardService = require("../../../service/buyCardService.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    collageList:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    buyCardService.getMyCollage().then((res)=>{
      console.log(res)
     that.setData({
       collageList:res
     })
    })
  },
  goCollageDetail:function(){
    wx.navigateTo({
      // url: '../collageDetail/collageDetail?id=' + e.currentTarget.dataset.id,
      url: '../collageDetail/collageDetail'
    })
  },
  toDetail(e){
   wx.navigateTo({
     url: '/pages/collage/joinOtherCollage/joinOtherCollage?status=2&id=' + e.currentTarget.dataset.id,
   })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (evt) {
 
    if (evt.from === 'button') {
      let centerId = wx.getStorageSync('selectCenterKey').id
      console.log(centerId)
      console.log(evt.target.dataset.id)
      return {
        title: getApp().globalData.account.name + '邀请您拼团',
        path: '/pages/collage/joinOtherCollage/joinOtherCollage?share=isShare&id=' + evt.target.dataset.id + '&centerId=' + centerId,
        //imageUrl: '/images/share.png'
      }
    }
  }
})