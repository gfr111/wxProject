// pages/cardsPurchaseOnline/availableCardDetail.js
var buyCardService = require("../../service/buyCardService.js");
var requestUtil = require('../../utils/requestUtil.js');
var systemMessage = require('../../SystemMessage.js');
var config = require("../../config.js")
var authenticationUtil = require('../../utils/authenticationUtil.js');
var app = getApp();
var isPay = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    card: {},
    useTime: '',
    periodRestriction: '',
    newCard: true,
    select: false,
    modeText: '',
    buyText: '购买',
    price: null,
    isLogin: false,
    realPrice: '',
    options: {},
    salesPromotionId: null,
    isGroupBooking: null,
    groupBooking: null,
    agree: false,
    showhide: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('进入',options)
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
        if (options[2]) {
          wx.setStorageSync('salesID', options[2])
        }
      } else {
        // 分銷商品掃碼
        options = options.scene.split("_");
        this.data.options = {
          id: options[1],
          centerId: options[0],
          distributorId: options[2]
        }
      }
      // 扫码进去获取center团队的信息，有token拿token，没有拿testToken用游客身份获取信息获取信息以后，请求活动详情
      app.nologincenterInfo(options[0], res => {
        this.init()
      })
    } else {
      this.data.options = options;
      if (options.centerId) {
        app.nologincenterInfo(options.centerId, res => {
          this.init()
        })
      } else {
        this.init();
      }

    }

  },

  toUseClass(e) {
    wx.navigateTo({
      url: '/pages/cardsPurchaseOnline/usePlace?id=' + e.currentTarget.id + '&buy=' + false,
    })
  },
  toUseCourse(e) {
    wx.navigateTo({
      url: '/pages/cardsPurchaseOnline/useClass?id=' + e.currentTarget.id + '&buy=' + false,
    })
  },
  init: function() {
    var that = this;
    var exid = null;
    if (that.data.options.exId != undefined && that.data.options.exId != 'undefined') {
      exid = that.data.options.exId
    } else {
      exid = null
    }
    console.log(that.data.options.id)
    buyCardService.getSellCardDetail(that.data.options.id, exid).then((res) => {
      // console.log(res)
      if (res.groupBooking != undefined) {
        that.setData({
          isGroupBooking: true,
          groupBooking: res.groupBooking
        })
      }
      if (res.salesPromotion != undefined) {
        res.salesPromotion.amount = res.salesPromotion.amount == 0 ? res.salesPromotion.amount + '' : res.salesPromotion.amount
        that.setData({
          price: res.salesPromotion.amount,
          realPrice: res.card.standardPrice
        })
      } else {
        that.setData({
          price: res.card.onlineBuyPrice,
          realPrice: ''
        })
      }
      that.setData({
        card: res,
        cardImg: '/images/card_small_' + res.card.cardType + '.jpg',
        useTime: that.getUseTime(res.card),
        periodRestriction: that.getPeriodRestriction(res.card)
      });
      if (res.haveContractId != null) {
        that.setData({
          newCard: false,
        })
      }
      that.selectTitle();
    })

  },
  selectAgree: function() {
    this.setData({
      agree: this.data.agree ? false : true
    })
  },
  getTime: function(day, restriction) {
    var temp = '',
      startH = 'day' + day + 'StartHour',
      startM = 'day' + day + 'StartMin',
      endH = 'day' + day + 'EndHour',
      endM = 'day' + day + 'EndMin';
    if (restriction[startH] != null && restriction[startM] != null &&
      restriction[endH] != null && restriction[endM] != null) {
      temp = temp + (parseInt(restriction[startH]) < 10 ? ('0' + restriction[startH]) : restriction[startH]);
      temp = temp + ':' + (parseInt(restriction[startM]) < 10 ? ('0' + restriction[startM]) : restriction[startM]);
      temp = temp + '-';
      temp = temp + (parseInt(restriction[endH]) < 10 ? ('0' + restriction[endH]) : restriction[endH]);
      temp = temp + ':' + (parseInt(restriction[endM]) < 10 ? ('0' + restriction[endM]) : restriction[endM]);
    }
    return temp;  
  },
  getUseTime: function(card) {
    if (!card.restriction.enabled || !card.restriction.weekEnabled) {
      return "无";
    }
    var rest = card.restriction;
    var useTime = [];
    if (rest.day1) {
      var s = '周日 ';
      s += this.getTime(1, rest);
      useTime.push(s)
    }
    if (rest.day2) {
      var s = '周一 ';
      s += this.getTime(2, rest);
      useTime.push(s)
    }
    if (rest.day3) {
      var s = '周二 ';
      s += this.getTime(3, rest);
      useTime.push(s)
    }
    if (rest.day4) {
      var s = '周三 ';
      s += this.getTime(4, rest);
      useTime.push(s)
    }
    if (rest.day5) {
      var s = '周四 ';
      s += this.getTime(5, rest);
      useTime.push(s)
    }
    if (rest.day6) {
      var s = '周五 ';
      s += this.getTime(6, rest);
      useTime.push(s)
    }
    if (rest.day7) {
      var s = '周六 ';
      s += this.getTime(7, rest);
      useTime.push(s)
    }

    return useTime;
  },
  getPeriodRestriction: function(card) {
    if (!card.restriction.enabled || !card.restriction.periodEnabled) {
      return "无";
    }
    if (card.restriction.periodType == 1) {
      return "每周" + card.restriction.periodCount + '次';
    } else {
      return "每月" + card.restriction.periodCount + '次';
    }
  },

  selectType: function() {
    if (app.globalData.token == null) {
      authenticationUtil.checkAuthToken();
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return
    }
    if (this.data.card.salesPromotion == undefined) {
      if (this.data.select) {
        if (isPay) {
          return
        }
        isPay = true;
        this.goBuyCard();
      } else {
        this.setData({
          select: true,
          buyText: '确定'
        })
      }
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
      newCard: e.currentTarget.dataset.way
    })
    this.selectTitle();
  },
  cancelSelect: function() {
    this.setData({
      select: false,
      buyText: '购买'
    })
  },
  selectTitle: function() {
    if (this.data.newCard) {
      if (this.data.card.card.onlineActivatedMode == 1) {
        this.setData({
          modeText: '办理新卡，立即开卡'
        })
      } else if (this.data.card.card.onlineActivatedMode == 2) {
        this.setData({
          modeText: '办理新卡，' + this.data.card.card.onlineActivatedInDays + '天内开卡'
        })
      } else if (this.data.card.card.onlineActivatedMode == 4) {
        this.setData({
          modeText: '办理新卡，首次使用开卡'
        })
      }
    } else {
      this.setData({
        modeText: '原卡续卡，原卡到期后自动开卡'
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (app.globalData.token != null && this.data.isLogin) {
      this.init();
      this.data.isLogin = false
    }
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

    buyCardService.goBuyCard(this.data.card.card.id, this.data.newCard ? -1 : this.data.card.haveContractId, -1, isSales ? this.data.salesPromotionId : null, this.data.options.distributorId ? this.data.options.distributorId : null).then((res) => {
      buyCardService.goPay(res, function() {
        wx.redirectTo({
          url: '/pages/payResult/payResult'
        })
      })

      isPay = false;
    }).catch((err) => {
      wx.hideLoading();
      systemMessage.showModal('', err);
      isPay = false;
    })
  },
  showEvent: function() {
    this.setData({
      showhide: true
    })
  },
  hideEvent: function() {
    this.setData({
      showhide: false
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
  onShareAppMessage: function() {
    console.log(this.data.options.exId)
    var center = wx.getStorageSync("selectCenterKey")
    var ids = center ? center.id : ''
    var path = '/pages/cardsPurchaseOnline/availableCardDetail?id=' + this.data.options.id + '&centerId=' + ids
    if (this.data.options.exId){
      path = path + '&exId=' + this.data.options.exId
    }
    console.log(path)

    var picname = this.data.card.card.cardType == 5 ? 'StoredvalueCard' : this.data.card.card.cardType == 4 || this.data.card.card.cardType == 7 ? 'subCard' : 'timeLimitCard'

    var img = this.data.card.card.cardBg ? this.data.card.card.cardBg : "../../images/" + picname + ".jpg"

    return {
      title: '' + this.data.card.card.name,
      path: path,
      imageUrl: img
    }
  },


  gobuy() {
    authenticationUtil.checkAuthToken(res => {
      var s = '?id=' + this.data.options.id
      if (this.data.options.exId) {
        s += '&exId=' + this.data.options.exId
      }
      if (this.data.options.distributorId) {
        s += '&distributorId=' + this.data.options.distributorId
      }
      wx.navigateTo({
        url: './availableCardDetail2' + s,
      })
    });
  },



})