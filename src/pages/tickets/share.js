// pages/tickets/share.js
var app = getApp()
var config = require('../../config.js')
var storageUtil = require('../../utils/storageUtil.js')
var authenticationUtil = require('../../utils/authenticationUtil.js')
var requestUtil = require('../../utils/requestUtil.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showResult:false,
    animationData: {},
    coupon:null,
    showOver:false,
    couponText:'票被领完了',
    receive1:true,
    rece:false,
    centerId:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var that = this
    var url = config.shareDetail(options.code,options.centerId)
    requestUtil.getRequest(url).then(res=>{
    if(res.status==1||res.status==0){
      that.setData({
        centerId: options.centerId,
        showOver:true,
        couponText: res.status == 0 ? '票券不存在' :'票被领完了'
      })
    }else{
      that.setData({
        centerId: options.centerId,
        coupon:res
      })
    }
    })
  /*  if (app.globalData.isAppOnShow) {
      app.globalData.isAppOnShow = false;
      app.checkAuthToken();
    }
    else {
      
    }
*/
  },
  goIndex:function(){
    // console.log(111)
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  tryReceive: function () {
    var that = this;
    var url = config.receive(this.data.centerId, this.data.coupon.instanceId);
    requestUtil.getRequest(url).then(res => {
      if (res) {
        wx.showToast({
          title: '领取成功',
        })

        that.setData({
          receive1: false
        })
      } else {
        that.showErr()
      }
    }).catch(err => {
      that.showErr()
    })
  },
  receive:function(){
    let info = {
      id: this.data.centerId,
      name: this.data.coupon.centerName,
      address: this.data.coupon.centerAddress,
      phone: this.data.coupon.centerPhone
    }
    app.globalData.selectCenter = info;
    storageUtil.saveSelectCenter(info);
    /* app.globalData.selectCenter = info;
     storageUtil.saveSelectCenter(info);
     app.checkAuthToken(); */
    var that = this;
    if (!app.globalData.token) {
      app.globalData.receive = true
      var p = new Promise(function (resolve, reject) {
        authenticationUtil.checkAuthToken(that.tryReceive);
      })
      app.globalData.promise = p;
       that.setData({
         rece:true
       })
    }else{
      that.tryReceive();
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
    if (this.data.rece && app.globalData.token){
      var that = this;
      var url = config.receive(this.data.centerId, this.data.coupon.instanceId);
      requestUtil.getRequest(url).then(res => {
        if (res) {
          wx.showToast({
            title: '领取成功',
          })

          that.setData({
            receive1: false
          })
        } else {
          that.showErr()
        }
      }).catch(err => {
        that.showErr()
      })
    }
  },
  // 领取失败
  showErr:function(){
    console.log(1)
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })

    this.animation = animation
        
    setTimeout(function () {
      animation.translateY(40).step()
      animation.translateY(-40).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 2000)
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