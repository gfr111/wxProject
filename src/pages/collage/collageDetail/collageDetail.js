// pages/collage/collageDetail/collageDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select:false
  },
  joinOtherCollage:function(){
     wx.navigateTo({
       url: '/pages/collage/joinOtherCollage/joinOtherCollage',
     })
  },
  selectType: function () {
    this.setData({
      select: true
    })
  },
  hidden(e) {
    this.setData({
      select: false
    })
  },
  
})