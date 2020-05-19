// pages/collage/joinOtherCollage/joinOtherCollage.js
var buyCardService = require("../../../service/buyCardService.js");
var systemMessage = require('../../../SystemMessage.js');
var app = getApp();
var authenticationUtil = require('../../../utils/authenticationUtil.js');
var storageUtil = require('../../../utils/storageUtil.js');
var loginService = require('../../../service/loginService.js');
var isPay = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
   goods:null,
    days: null,
    hours: null,
    minutes: null,
    remain:[],
    other:[],
    status:1,//场景1参加别人的拼团，2我的拼团
    showCollage: true,
    isShare:false,
    centerId:null,
		centerName:null,
    centerAddress:null,
    centerPhone:null,
    id:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id: options.id
    })
    if (options.status != null) {
      this.setData({
        status: 2
      })
    }
    if (options.share!=null){
      this.setData({
        isShare:true
      })
      if(options.centerId){
        app.globalData.selectCenter = {
          id: options.centerId
        }
        loginService.getCenterList().then((res) => {
          res.map(item => {
            if (item.id == options.centerId) {
              console.log(item)
              app.globalData.selectCenter = item
              wx.setStorageSync('selectCenterKey', item)
              this.setData({
                selectCenter: item
              })
            }
          })
          console.log(10)
          this.getMess();
        })
      }else{
        this.getMess();
      }
    } else {
      this.getMess();
    }
   // console.log('------' + options.id)
  

  },
  getMess(){
    var that = this;
    buyCardService.getInstanceCollage(that.data.id).then((res) => {
      if (res.tg.realNumber == null) {
        res.tg.realNumber = 0
      }
      if (that.data.isShare) {
        that.setData({
          centerId: res.centerId,
          centerName: res.centerName,
          centerAddress: res.centerAddress,
          centerPhone: res.centerPhone
        })
      }
      var ls = new Array();
      for (var i = 0; i < (res.tg.personNumber - res.tg.realNumber); i++) {
        ls[i] = i
      }

      that.setData({
        goods: res.tg,
        other: res.instance ? res.instance : [],
        remain: ls
      })
      that.getTime(res.tg.endTs)
      if (that.data.hours == 0 && that.data.days == 0 && that.data.minutes == 0) {
        that.setData({
          showCollage: false
        })
      }
      var timer2 = setInterval(function () {
        that.getTime(res.tg.endTs)
        if (that.data.hours == 0 && that.data.days == 0 && that.data.minutes == 0) {
          clearInterval(timer2)
          that.setData({
            showCollage: false
          })
        }
      }, 60000)
    })
  },
  getTime: function (endTs) {
    var stime = Date.parse(new Date())
    var etime = endTs;
    var usedTime = etime - stime;  //两个时间戳相差的毫秒数


    var days = Math.floor(usedTime / (24 * 3600 * 1000));

    //计算出小时数

    var leave1 = usedTime % (24 * 3600 * 1000);    //计算天数后剩余的毫秒数

    var hours = Math.floor(leave1 / (3600 * 1000));

    //计算相差分钟数

    var leave2 = leave1 % (3600 * 1000);        //计算小时数后剩余的毫秒数

    var minutes = Math.floor(leave2 / (60 * 1000));

    var time = days + "天" + hours + "时" + minutes + "分";
    this.setData({
      days: days,
      hours: hours,
      minutes: minutes
    })
  },
  joinCollage:function(){
   
    if (app.globalData.token == null) {
      this.goLogin(this.joinGroup);
    }else{
      this.joinGroup();
}
  },
  goLogin:function(evt){
    var that = this
    let info = {
      id: this.data.centerId,
      name: this.data.centerName,
      address: this.data.centerAddress,
      phone: this.data.centerPhone
    }
    console.log(this)
    app.globalData.selectCenter = info;
    storageUtil.saveSelectCenter(info);

    app.globalData.receive = true
    var p = new Promise(function (resolve, reject) {
      authenticationUtil.checkAuthToken(evt);
    })
    app.globalData.promise = p;
  },
  joinGroup:function(){
    if(this.data.goods.cardType<=2){
      buyCardService.goBuyCourse(this.data.goods.objectId, this.data.goods.cardType == 2 ? 1 : this.data.goods.objectCount, '', this.data.goods.price, this.data.goods.groupBookingId, this.data.goods.id).then((res) => {
        buyCardService.goPay(res,  (tradeNo)=> {
          // wx.redirectTo({
          //   // url: '/pages/collage/myselfCollage/myselfCollage'
          //   url: '/pages/collage/joinOtherCollage/joinOtherCollage?status=2&id=' + this.data.goods.id
          // })
          this.getMess();
          this.setData({
            status:2
          })
        })
    
      }).catch((err) => {
        // console.log(err)
        wx.hideLoading();
        // systemMessage.showModal('', err);
      })
    }else{
      var that = this;
      buyCardService.goBuyCard(that.data.goods.objectId, -1, -1,-1, that.data.goods.groupBookingId, that.data.goods.id).then((res) => {
        buyCardService.goPay(res, ()=> {
          // wx.redirectTo({
          //   // url: '/pages/collage/myselfCollage/myselfCollage'
          //   url: '/pages/collage/joinOtherCollage/joinOtherCollage?status=2&id=' + that.data.goods.id
          // })
          this.getMess();
          this.setData({
            status: 2
          })
        })
   
      }).catch((err) => {
        wx.hideLoading();
        // systemMessage.showModal('', err);

      })
    }
   
  },
  gotoCarDetail:function(){
    if (app.globalData.token == null) {
      this.goLogin(res=>{
        if(this.data.goods.cardType>2){
          wx.redirectTo({
            url: '/pages/cardsPurchaseOnline/availableCardDetail?id=' + this.data.goods.objectId,
          })
        }else{
          wx.redirectTo({
            url: '/pages/courseBuyOnline/availableCourseDetail?id=' + this.data.goods.objectId,
          })
        }
       
      })
    }else{
      if (this.data.goods.cardType > 2) {
        wx.redirectTo({
          url: '/pages/cardsPurchaseOnline/availableCardDetail?id=' + this.data.goods.objectId,
        })
      } else {
        wx.redirectTo({
          url: '/pages/courseBuyOnline/availableCourseDetail?id=' + this.data.goods.objectId,
        })
      }
    }
  },
  gotoGroupDetail:function(){
    if (app.globalData.token == null) {
      this.goLogin(res=>{
        wx.redirectTo({
          url: '/pages/cardsPurchaseOnline/availableCardDetail?id=' + this.data.goods.cardId,
        })
      })
    }else{
    wx.redirectTo({
      url: '/pages/cardsPurchaseOnline/availableCardDetail?id=' + this.data.goods.cardId,
    })
    }
  },
  returnToIndex: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    console.log('------' + this.data.goods.id)
    return {
      title: getApp().globalData.account.name + '邀请您拼团',
      path: '/pages/collage/joinOtherCollage/joinOtherCollage?share=isShare&id=' + this.data.goods.id,
      //imageUrl: '/images/share.png'
    }

  }
})