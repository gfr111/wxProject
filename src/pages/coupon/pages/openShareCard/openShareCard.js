// pages/coupon//pages/openShareCard/openShareCard.js
var buyCardService = require("../../../../service/buyCardService.js");
var timer=null;
var timers=null;
var app = getApp();
var authenticationUtil = require('../../../../utils/authenticationUtil.js');
var imgUrl = require("../../../../utils/uiUtils/imgUrl.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPop:false,
    second:3,
    data:null,
    isOverdus:false,//是否过期
    countTimeObj: {
      h:'00',
      m:'00',
      s:'00'
    },
    time: '',
    endTime: null,
    isRecive:false,//是否领取
    isRemain:true,//是否剩余,
    options:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      options: options
    })
    app.nologincenterInfo(options.centerId, res => {
      buyCardService.getShareCardMess(options.centerId, options.shareId).then((res) => {
        res.trainee.photo = imgUrl.getDefaultSpace(res.trainee.photo)
        console.log(res)
        this.setData({
          data: res,
          time: res.shareLog.endTs,
          options: options
        })
        console.log(res.shareLog.endTs >= new Date().getTime() )
        if (res.shareLog.endTs>=new Date().getTime()){
          this.setData({
            isOverdus:false//未过期
          })
        }else{
          this.setData({
            isOverdus: true
          })
        }
        console.log(res.shareLog.receivedPeopleCount >= res.shareLog.peopleCount )
        if (res.shareLog.receivedPeopleCount >= res.shareLog.peopleCount){
          this.setData({
            isRemain: false
          })
        }else{
          this.setData({
            isRemain: true
          })
        }
        this.countTime();
      })
    })
  },
  // 倒计时
  countdown: function () {
    var that = this;
    var second = that.data.second
    if (second == 1) {
       //跳转页面
       console.log('跳转')
       wx.redirectTo({
         url: '/pages/index/Cards',
       })
       return;
    }
     timer = setTimeout(function () {
      that.setData({
        second: second - 1
      });
      that.countdown();
    }, 1000)
  },
  toList(){
    wx.redirectTo({
      url: '/pages/index/Cards',
    })
  },
  hide(){
   
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  receiveCard(){
    if (app.globalData.token == null) {
      authenticationUtil.checkAuthToken();
    } else {
      buyCardService.getReceiveCard(this.data.options.centerId, this.data.options.shareId).then((res)=>{
        this.setData({
          showPop: true,
          isRecive:true
        })
        this.countdown();
      })
    }
  },
  countTime() {
    var that = this;
    var start = new Date().getTime();
    function num(n) {
      return n < 10 ? ('0' + n) : n;
    }
    // 差值
    var leftTime = parseInt((that.data.time) - start);
    var h = (parseInt(leftTime / (60 * 60 * 1000) % 24));
    var m = (parseInt(leftTime / (60 * 1000) % 60));
    var s = (parseInt(leftTime / 1000 % 60));
    that.setData({
      countTimeObj :{
        h: num(h),
        m: num(m),
        s: num(s)
      },
      endTime: num(h) + ' : ' + num(m) + ' : ' + num(s)
    })
    // 时间差为0
    if (leftTime < 0) {
      that.setData({
        countTimeObj: {
          h: '00',
          m: '00',
          s: '00'
        }
      })
      clearTimeout(timers);
    } else {
      timers = setTimeout(that.countTime, 1000);
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearTimeout(timers);
    clearTimeout(timer);
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