// pages/space/buyCarInfo.js

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
    id: '',//卡的id
    card: {},
    cardImg: '/images/card_small_3.jpg',
    useTime: '',
    periodRestriction: '',
    newCard: true,
    select: false,
    modeText: '',
    buyText: '购买',
    price: null,
    isLogin: false,
    realPrice: '',
    salesPromotionId: null,
    isGroupBooking: null,
    groupBooking: null,
    agree: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log('---详情---', options)
    that.setData({ id: options.id})
    that.getCarInfo()//会员卡详情数据
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

  


  /********会员卡详情请求********/

  getCarInfo: function(){
    var that = this
    buyCardService.getSellCardDetail(that.data.id).then((res) => {
      console.log( '---详情数据---', res)
      if (res.groupBooking != undefined) {
        that.setData({
          isGroupBooking: true,
          groupBooking: res.groupBooking
        })
      }
      if (res.salesPromotion != undefined) {
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

  getUseTime: function (card) {
    if (!card.restriction.enabled || !card.restriction.weekEnabled) {
      return "无";
    }
    var rest = card.restriction;
    var useTime = '';
    if (rest.day1) {
      useTime += '周一';
      useTime += this.getTime(1, rest);
      useTime += '; '
    }
    if (rest.day2) {
      useTime += '周二';
      useTime += this.getTime(2, rest);
      useTime += '; '
    }
    if (rest.day3) {
      useTime += '周三';
      useTime += this.getTime(3, rest);
      useTime += '; '
    }
    if (rest.day4) {
      useTime += '周四';
      useTime += this.getTime(4, rest);
      useTime += '; '
    }
    if (rest.day5) {
      useTime += '周五';
      useTime + this.getTime(5, rest);
      useTime += '; '
    }
    if (rest.day6) {
      useTime += '周六';
      useTime += this.getTime(6, rest);
      useTime += '; '
    }
    if (rest.day7) {
      useTime += '周日';
      useTime += this.getTime(7, rest);
      useTime += '; '
    }

    return useTime;
  },

  getTime: function (day, restriction) {
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

  getPeriodRestriction: function (card) {
    if (!card.restriction.enabled || !card.restriction.periodEnabled) {
      return "无";
    }
    if (card.restriction.periodType == 1) {
      return "每周" + card.restriction.periodCount + '次';
    } else {
      return "每月" + card.restriction.periodCount + '次';
    }
  },
  selectWay: function (e) {
    this.setData({
      newCard: e.currentTarget.dataset.way
    })
    this.selectTitle();
  },

  cancelSelect: function () {
    this.setData({
      select: false,
      buyText: '购买'
    })
  },

  selectTitle: function () {
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

  toGym: function () {
    wx.navigateTo({
      url: '/pages/cardsPurchaseOnline/usePlace?id=' + this.data.id,
    })
  },
  toCourse: function () {
    wx.navigateTo({
      url: '/pages/cardsPurchaseOnline/useClass?id=' + this.data.id,
    })
  },
  selectAgree: function () {
    this.setData({
      agree: this.data.agree ? false : true
    })
  },
  agreementClick: function(){
    wx.navigateTo({
      url: '/pages/agreement/agreement?tp=0',
    })
  },

  selectType: function () {
    if (app.globalData.token == null) {
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

  getNoPaySales: function () {
    var url = config.getNoPaySalesUrl(this.data.salesPromotionId);
    requestUtil.getRequest(url).then(res => {
      isPay = false;
      wx.redirectTo({
        url: '/pages/payResult/carPayResult'
      })

    })
    isPay = false;
  },

  goBuyCard: function () {
    var that = this;
    var isSales = false;
    if (this.data.salesPromotionId != null && this.data.card.salesPromotion.amount > 0) {
      isSales = true
    }
    buyCardService.goBuyCard(this.data.card.card.id, this.data.newCard ? -1 : this.data.card.haveContractId,-1, isSales ? this.data.salesPromotionId : null).then((res) => {
      buyCardService.goPay(res, function () {
        wx.redirectTo({
          url: '/pages/payResult/carPayResult'
        })
      })
      isPay = false;
    }).catch((err) => {
      wx.hideLoading();
      systemMessage.showModal('', err);
      isPay = false;
    })
  },

})