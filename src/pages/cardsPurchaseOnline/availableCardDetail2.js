// pages/cardsPurchaseOnline/availableCardDetail.js
var buyCardService = require("../../service/buyCardService.js");
var requestUtil = require('../../utils/requestUtil.js');
var systemMessage = require('../../SystemMessage.js');
var config = require("../../config.js")
var authenticationUtil = require('../../utils/authenticationUtil.js');
var util = require('../../utils/util.js');
var app = getApp();
var isPay = false;
var headOfficeService = require("../../service/headOfficeService.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    card: {},
    cardImg: '/images/card_small_3.jpg',
    newCard: true,
    select: false,
    modeText: '',
    price: null,
    isLogin: false,
    options: {},
    salesPromotionId: null,
    isGroupBooking: null,
    groupBooking: null,
    agree: false,
    choosedTrainer: {},
    multiId: '',
    multilName: '',
    multiPrice: '',
    alreadyBuy: false,
    couponList: [],
    coupon: null,
    discountPrice: 0,
    allPricre: 0,
    realPrice: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    // options={
    //   distributorId:3146936,
    //   id:76
    // }
    if (options.scene) {
      // 是否营销活动新人活动或则会员端活动进来
      var index = options.scene.indexOf('a')
      if (index > -1) {
        options.scene = options.scene.slice(index + 1)
        options = options.scene.split("_")
        this.data.options = {
          id: options[1],
          centerId: options[0],
          exId: options[2]
        }
      }
      // 扫码进去获取center团队的信息，有token拿token，没有拿testToken用游客身份获取信息获取信息以后，请求活动详情
      app.nologincenterInfo(options[0], res => {
        this.init()
        this.getseller();
      })
    } else {
      this.data.options = options
      this.init();
      this.getseller();
      this.setData({
        options: options
      })
      if (options.alreadyBuy) {
        this.setData({
          alreadyBuy: options.alreadyBuy
        })
      }
    }
  },

  init: function() {
    var that = this;
    var exid = null
    if (that.data.options.exId != undefined &&that.data.options.exId !='undefined') {
      exid = that.data.options.exId
      console.log(789)
    } else {
      exid = null
    }
    console.log(that.data.options.id, exid)
    buyCardService.getSellCardDetail(that.data.options.id, exid).then((res) => {
      if (res.salesPromotion != undefined) {
        res.salable = true
        that.setData({
          price: res.salesPromotion.amount,
          realPrice: res.salesPromotion.amount,
          allPricre: res.salesPromotion.amount
        })
      } else {
        that.setData({
          price: res.card.onlineBuyPrice,
          realPrice: res.card.onlineBuyPrice,
          allPricre: res.card.onlineBuyPrice
        })
      }
      that.setData({
        card: res
      });
      if (res.haveContractId != null) {
        that.setData({
          newCard: false,
        })
      }
      that.selectTitle();
      that.getCoupon();
    })
  },
  // 获取销售人
  getseller() {
    var url = config.getsellers(this.data.options.distributorId ? this.data.options.distributorId : null)
    requestUtil.getRequest(url).then(res => {
      var choosedTrainer = {};
      if (res.length == 1) {
        choosedTrainer = {
          id: res[0].id,
          name: res[0].name
        }
      }
      this.setData({
        trainer: res,
        choosedTrainer: choosedTrainer
      })
    })
  },
  // 获取优惠券
getCoupon(){
  console.log(this.data.card.card)
  var type = (this.data.card.card.cardType == 8 || this.data.card.card.cardType == 9 || this.data.card.card.cardType == 10)?128:1;
  headOfficeService.getUsableCoupon(type).then((res)=>{
    console.log(this.data.price)
    var arr=[];
    for(var i=0,len=res.length;i<len;i++){
      if (res[i].amountLimit <= this.data.price) {
        arr.push(res[i])
      }
    }
    console.log(arr)
    this.setData({
      couponList: arr
    })
  })
},

  selectAgree: function() {
    this.setData({
      agree: this.data.agree ? false : true
    })
  },
  selectMulti: function(e) {
    this.setData({
      multiId: e.currentTarget.dataset.item.id,
      multilName: e.currentTarget.dataset.item.name,
      multiPrice: e.currentTarget.dataset.item.price
    })
  },
  selectType: function() {
    console.log(isPay)
    if (app.globalData.token == null) {
      authenticationUtil.checkAuthToken();
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return
    }
    // 是否拼团
    if (this.data.card.salesPromotion == undefined) {
      if (isPay) {
        return
      }
      isPay = true;
      this.goBuyCard();
    } else {
      if (isPay) {
        return
      }
      isPay = true;
      this.setData({
        salesPromotionId: this.data.card.salesPromotion.id
      })
      if (this.data.card.salesPromotion.amount == 0) {
        this.getNoPaySales();
      } else {
        this.goBuyCard();
      }
    }
  },


  selectWay: function(e) {
    this.setData({
      newCard: e.currentTarget.dataset.way,
      select: false
    })
    this.selectTitle();
  },
  cancelSelect: function() {
    this.setData({
      select: false
    })
  },
  selectTitle: function() {
    if (this.data.newCard) {
      if (this.data.card.card.onlineActivatedMode == 1) {
        this.setData({
          modeText: '立即开卡'
        })
      } else if (this.data.card.card.onlineActivatedMode == 2) {
        this.setData({
          modeText: +this.data.card.card.onlineActivatedInDays + '天内开卡'
        })
      } else if (this.data.card.card.onlineActivatedMode == 4) {
        this.setData({
          modeText: '首次使用开卡'
        })
      }
    } else {
      this.setData({
        modeText: '立即开卡'
      })
    }

  },
  buyMoreCard() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (app.globalData.token != null && this.data.isLogin) {
      this.init();
      this.data.isLogin = false
    }
    if (this.data.coupon) {
      console.log(this.data.coupon)
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
          console.log(util.floatSub(this.data.allPricre, this.data.coupon.maxDeductionAmount))
          this.setData({
            discountPrice: this.data.coupon.maxDeductionAmount,
            realPrice: util.floatSub(this.data.allPricre, this.data.coupon.maxDeductionAmount) < 0 ? 0 : util.floatSub(this.data.allPricre, this.data.coupon.maxDeductionAmount)
          })
        } else {
          this.setData({
            realPrice: util.mul(this.data.allPricre, this.data.coupon.discount),
            discountPrice: util.floatSub(this.data.allPricre, util.mul(this.data.allPricre, this.data.coupon.discount)) < 0 ? 0 : util.floatSub(this.data.allPricre, util.mul(this.data.allPricre, this.data.coupon.discount))
          })
        }
      }
    } else {
      this.setData({
        discountPrice: 0,
        realPrice: this.data.price
      })
    }

    // 如果已经登录，那么绑定会员与教练
    if (wx.getStorageSync("tokenKey") && wx.getStorageSync("actscan") && wx.getStorageSync("actscan")[2]) {
      app.getbind()
    }


  },

  onUnload: function() {
    isPay = false;
  },
  getNoPaySales: function() {
    var url = config.getNoPaySalesUrl(this.data.salesPromotionId);
    requestUtil.getRequest(url).then(res => {
      isPay = false;
      wx.redirectTo({
        url: '/pages/payResult/payResult'
      })

    })
    isPay = false;
  },

  goBuyCard: function() {
    var that = this;
    var isSales = false;
    if (this.data.salesPromotionId != null && this.data.card.salesPromotion.amount > 0) {
      isSales = true
    }
    var sellerId = this.data.choosedTrainer && this.data.choosedTrainer.id ? this.data.choosedTrainer.id : -1
    buyCardService.goBuyCard(this.data.card.card.id, this.data.newCard ? -1 : this.data.card.haveContractId, sellerId, isSales ? this.data.salesPromotionId : null, null, null, this.data.multiId ? this.data.multiId : null, this.data.options.distributorId ? this.data.options.distributorId : null, this.data.coupon ? this.data.coupon.id : null).then((res) => {
      if (res != null) {
        wx.removeStorageSync('salesID')
        buyCardService.goPay(res, function() {
          wx.redirectTo({
            url: '/pages/payResult/payResult'
          })
        })
      } else {
        wx.redirectTo({
          url: '/pages/payResult/payResult'
        })
      }
      isPay = false;
    }).catch((err) => {
      wx.hideLoading();
      console.log('error')
      // systemMessage.showModal('', err);
      isPay = false;
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {
  //   var path = '/pages/cardsPurchaseOnline/availableCardDetail?id=' + this.data.options.id + '&pageTip=' + this.data.options.pageTip
  //   return {
  //     title: '' + this.data.card.card.name,
  //     path: path,
  //     imageUrl: this.data.cardImg
  //   }
  // },
  cardType() {
    this.setData({
      select: true
    })
  },
  cancle() {
    this.setData({
      select: false
    })
  },
  totrainer() {
    var id = this.data.choosedTrainer.id ? this.data.choosedTrainer.id : -1
    if (this.data.options.distributorId) {
      wx.navigateTo({
        url: '/pages/cardsPurchaseOnline/seller/seller?id=' + id + '&distributorId=' + this.data.options.distributorId,
      })
    } else {
      wx.navigateTo({
        url: '/pages/cardsPurchaseOnline/seller/seller?id=' + id,
      })
    }

  },
  toCoupon() {
    var id = this.data.coupon ? this.data.coupon.id : -1;
    var type = (this.data.card.card.cardType == 8 || this.data.card.card.cardType == 9 || this.data.card.card.cardType == 10) ? 128 : 1;
    wx.navigateTo({
      url: '/pages/tickets/newCouponList?id=' + id + '&type=' + type+'&price='+this.data.price,
    })
  }
})