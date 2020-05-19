// pages/shop/submitOrder/submitOrder.js
var requestUtil = require('../../../utils/requestUtil.js');
var configs = require('../../../config.js')
var buyCardService = require('../../../service/buyCardService.js');
var headOfficeService = require("../../../service/headOfficeService.js");
var util = require('../../../utils/util.js');
var systemMessage = require('../../../SystemMessage.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: '',
    ids: [],
    items: [],
    price: '',
    card: {
      name: '',
      id: ''
    },
    coupon: null,
    discountPrice: 0,
    allPricre: 0,
    realPrice: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var ischange = options.ischange ? true : false
    var item = JSON.parse(options.item)
    var data = {
      ids: []
    }
    item.map((item) => {
      data.ids.push(item.itemId)
    })
    this.setData({
      items: item,
      price: options.price,
      allPricre: options.price,
      realPrice: options.price,
      ids: data,
      ischange: ischange
    })
    this.req();
    this.getCoupon();
  },
  // 获取商品信息及可用储值卡
  req() {
    var url = configs.getordergoods()
    requestUtil.postRequest(url, this.data.ids).then(res => {
      var hasmoney = false
      if (res.cards.length > 0) {
        for (var i = 0; i < res.cards.length; i++) {
          var cards = res.cards[i]
          if (cards.amount > this.data.price) {
            this.data.card = {
              name: cards.cardName,
              id: cards.contractId
            }
            hasmoney = true
            break;
          }
        }
      } else {
        this.data.card = {
          name: '微信支付',
          id: ''
        }
      }
      if (!hasmoney) {
        this.data.card = {
          name: '微信支付',
          id: ''
        }
      }
      this.setData({
        goods: res,
        card: this.data.card
      })
    })
  },
  chooseway() {
    wx.navigateTo({
      url: '/pages/shop/payway/payway?cardid=' + this.data.card.id,
    })
  },
  // 获取优惠券
  getCoupon() {
    var that = this;
    console.log(that.data.course)
    headOfficeService.getUsableCoupon(16).then((res) => {
      var arr = [];
      for (var i = 0, len = res.length; i < len; i++) {
        if (res[i].amountLimit <= that.data.price) {
          arr.push(res[i])
        }
      }
      that.setData({
        couponList: arr
      })
    })
  },
  toCoupon() {
    var id = this.data.coupon ? this.data.coupon.id : -1;
    wx.navigateTo({
      url: '/pages/tickets/newCouponList?id=' + id + '&type=16' + '&price=' + this.data.price,
    })
  },
  topay() {
    this.data.card.id = this.data.ischange ? null : this.data.card.id
    var ismoney = this.data.ischange?false: this.data.card.id ? false : true
    var payMethod = this.data.ischange ? 100 : 5
    buyCardService.goBuyShop(this.data.items, this.data.price, this.data.card.id, payMethod,this.data.coupon?this.data.coupon.id:null).then((res) => {
      // 储值卡支付
      if (res.orderId) {
        wx.redirectTo({
          url: '/pages/shop/shopPayResult?orderId=' + res.orderId + '&ismoney=' + (this.data.coupon ? false : ismoney)
        })
      } else {
        buyCardService.goPay(res, function(tradeNo) {
          wx.redirectTo({
            url: '/pages/shop/shopPayResult?orderId=' + tradeNo
          })
        })
      }
      console.log(res)
    }).catch((err) => {
      wx.hideLoading();
      // systemMessage.showModal('', err);
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    if (this.data.coupon) {
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
        realPrice: this.data.price
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

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

  }
})