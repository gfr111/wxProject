// pages/courseBuyOnline/buyDetail.js
var buyCardService = require("../../service/buyCardService.js");
var systemMessage = require('../../SystemMessage.js');
var authenticationUtil = require('../../utils/authenticationUtil.js');
var headOfficeService = require("../../service/headOfficeService.js");
var util = require('../../utils/util.js');
var app = getApp();
var isPay = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    count: 8,
    amount: '',
    trainerId:-1,
    trainerName:'请选择',
    coupon:null,
    couponList:[],
    discountPrice: 0,
    allPricre: 0,
    realPrice: 0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.data.options = options;
    this.init();
  },
  init: function () {
    var that = this;
    if (that.options.trainerId && that.options.trainerName && that.options.trainerId != 'undefined' && that.options.trainerName!='undefined') {
      this.setData({
        trainerId: that.options.trainerId,
        trainerName: that.options.trainerName
      })
    }
    buyCardService.getSellCourseDetail(that.options.id).then((res) => {
      that.setData({
        course: res.course,
        availableCenterCount: res.availableCenterCount,
        amount: res.course.cardType == 1 ? res.course.onlineBuyPrice * this.data.count : res.course.onlineBuyPrice,
        realPrice: res.course.cardType == 1 ? res.course.onlineBuyPrice * this.data.count : res.course.onlineBuyPrice,
        allPricre: res.course.cardType == 1 ? res.course.onlineBuyPrice * this.data.count : res.course.onlineBuyPrice
      });
      that.getCoupon();
    })
  },
  refreshCount: function (evt) {
    if (evt.target.dataset.method) {
      this.setData({
        count: this.data.count + 1,
      })
    } else {
      if (this.data.count > 1) {
        this.setData({
          count: this.data.count - 1,
        })
      }
    }
    this.setData({
      amount: this.data.count * this.data.course.onlineBuyPrice,
      realPrice: this.data.count * this.data.course.onlineBuyPrice,
      allPricre: this.data.count * this.data.course.onlineBuyPrice
    })
    this.changeDiscount();
  },
  countInput: function (e) {
    if (e.detail.value > 0) {
      if (e.detail.value.length > 1 && e.detail.value.charAt(0) == 0) {
        e.detail.value = e.detail.value.substr(1)
      }
    } else {
      if (e.detail.value == '') {
        return
      }
      e.detail.value = 8
    }
    this.setData({
      count: parseInt(e.detail.value),
      amount: parseInt(e.detail.value) * this.data.course.onlineBuyPrice,
      realPrice: parseInt(e.detail.value) * this.data.course.onlineBuyPrice,
      allPricre: parseInt(e.detail.value) * this.data.course.onlineBuyPrice
    })
    this.changeDiscount();
  },
  blur: function (e) {
    if (e.detail.value == '') {
      console.log('----')
      e.detail.value = this.data.count
    }
  },
  chooseTrainer(){
    wx.navigateTo({
      url: '/pages/courseBuyOnline/selectTrainer?id=' + this.data.options.id,
    })
  },
  toCoupon() {
    var id = this.data.coupon ? this.data.coupon.id : -1;
    wx.navigateTo({
      url: '/pages/tickets/newCouponList?id=' + id + '&type=' + (this.data.course.isTrainingCourse ? 4 : 2 )+ '&price=' + this.data.amount,
    })
  },
  // 获取优惠券
  getCoupon() {
    var that=this;
    console.log(that.data.course)
    headOfficeService.getUsableCoupon(that.data.course.isTrainingCourse?4:2).then((res) => {
      var arr = [];
      for (var i = 0, len = res.length; i < len; i++) {
        if (res[i].amountLimit <= that.data.amount) {
          arr.push(res[i])
        }
      }
      that.setData({
        couponList: arr
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  selectAgree: function () {
    this.setData({
      agree: this.data.agree ? false : true
    })
  },
  changeDiscount(){
    if (this.data.coupon) {
      // console.log(this.data.coupon.type)
      if (this.data.coupon.type == 1) {
        if (this.data.coupon.discount > this.data.allPricre) {
          this.setData({
            discountPrice: this.data.allPricre,
            realPrice: util.floatSub(this.data.allPricre, this.data.coupon.discount) < 0 ? 0 : util.floatSub(this.data.allPricre, this.data.coupon.discount)
          })
        } else {
          this.setData({
            discountPrice: this.data.coupon.discount,
            realPrice: util.floatSub(this.data.allPricre, this.data.coupon.discount) < 0 ? 0 : util.floatSub(this.data.allPricre, this.data.coupon.discount)
          })
        }
      } else {
        if ((this.data.coupon.maxDeductionAmount < util.mul(this.data.allPricre, this.data.coupon.discount) && this.data.coupon.maxDeductionAmount)) {
          // console.log(util.floatSub(this.data.allPricre, this.data.coupon.maxDeductionAmount))
          this.setData({
            discountPrice: this.data.coupon.maxDeductionAmount,
            realPrice: util.floatSub(this.data.allPricre, this.data.coupon.maxDeductionAmount) < 0 ? 0 : util.floatSub(this.data.allPricre, this.data.coupon.maxDeductionAmount)
          })
        } else {

          this.setData({
            realPrice: util.mul(this.data.allPricre, this.data.coupon.discount),
            discountPrice: util.floatSub(this.data.allPricre, util.mul(this.data.allPricre, this.data.coupon.discount)) < 0 ? 0 : util.floatSub(this.data.allPricre, util.mul(this.data.allPricre, this.data.coupon.discount))
          })
          // console.log(this.data.allPricre, this.data.coupon.discount)
          // console.log(this.data.realPrice, this.data.discountPrice)
        }
      }
    } else {
      this.setData({
        discountPrice: 0,
        realPrice: this.data.amount
      })
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (app.globalData.token != null && this.data.isLogin) {
      this.init();
      this.data.isLogin = false
    }
    this.changeDiscount();
  },
  goBuyCourse: function () {
    if (app.globalData.token == null) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      authenticationUtil.checkAuthToken();
      return
    }
    if (this.data.count <= 0 || this.data.amount <= 0) {
      wx.showToast({
        title: '购买数量不能小于1',
        icon: 'none'
      })
      return
    }
    if (this.data.trainerId < 0) {
      wx.showToast({
        title: '上课教练不能为空',
        icon: 'none'
      })
      return
    }
    if (isPay) {
      return
    }
    isPay = true;
    var that = this;
    buyCardService.goBuyCourse(this.data.course.id, this.data.course.cardType == 2 ? 1 : this.data.count, this.data.trainerId, this.data.amount,null,null,this.data.coupon ? this.data.coupon.id : null).then((res) => {
      if(res){
        buyCardService.goPay(res, function (tradeNo) {
          console.log(tradeNo)
          wx.redirectTo({
            url: '/pages/payResult/coursePayResult'
          })
        })
      }else{
        wx.redirectTo({
          url: '/pages/payResult/coursePayResult'
        })
      }
      isPay = false;
    }).catch((err) => {
      console.log(err)
      wx.hideLoading();
      systemMessage.showModal('', err);
      isPay = false;
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