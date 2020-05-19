// pages/space/bookingsure.js
var util = require('../../utils/util.js');
var centerService = require("../../service/centerService.js");
var buyCardService = require("../../service/buyCardService.js");
var headOfficeService = require("../../service/headOfficeService.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '', //预订人名字
    phone: '', //预订人电话
    showModal: false, //是否显示预订须知
    orderDetail: null,
    spaceMess: null,
    year: '',
    month: '',
    day: '',
    realAmount: null,
    reduceAmount: null,
    carList: null,
    noUseCard: null,//不可用的会员卡
    list: [],
    price: 0,
    planDate: null,
    isAgreement: true,
    groundId: null,
    defaultReduceAmount:'',
    defaultRealAmount:'',
    discountPrice:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    console.log('----', options)

    that.setData({
      carList: JSON.parse(options.carList),
      orderDetail: JSON.parse(options.data),
      defaultRealAmount: JSON.parse(options.data).realAmount,
      spaceMess: JSON.parse(options.spaceMess),
      name: getApp().globalData.account.name,
      phone: getApp().globalData.account.phone,
      year: JSON.parse(options.data).planDate.substring(0, 4),
      month: JSON.parse(options.data).planDate.substring(4, 6),
      day: JSON.parse(options.data).planDate.substring(6, 8),
      groundId: options.groundId,
      noUseCard: JSON.parse(options.noUseCard),
      list: JSON.parse(options.list),
      price: options.price,
      planDate: options.planDate,
    })
    var reduceAmount = null
    if (that.data.carList.length == 1 && that.data.carList[0].cardType == null) {
      that.setData({ reduceAmount: 0, defaultReduceAmount:0})
    } else {
      that.setData({ 
        reduceAmount: util.floatSub(JSON.parse(options.data).total, JSON.parse(options.data).realAmount),
        defaultReduceAmount: util.floatSub(JSON.parse(options.data).total, JSON.parse(options.data).realAmount)
       })
    }
    that.setCardData();
    that.getCoupon();
  },
  // 获取优惠券
  getCoupon() {
    var that = this;
    console.log(that.data.course)
    headOfficeService.getUsableCoupon(64).then((res) => {
      var arr = [];
      for (var i = 0, len = res.length; i < len; i++) {
        if (res[i].amountLimit <= that.data.orderDetail.realAmount) {
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
      url: '/pages/tickets/newCouponList?id=' + id + '&type=64' + '&price=' + this.data.orderDetail.realAmount,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  setDiscount: function() {
    console.log(this.data.spaceMess)
    console.log(this.data.price)
    wx.navigateTo({
      url: '/pages/space/availableCar?carList=' + JSON.stringify(this.data.carList) + '&noUseCard=' + JSON.stringify(this.data.noUseCard) + '&list=' + JSON.stringify(this.data.list) + '&price=' + this.data.price + '&planDate=' + this.data.planDate + '&spaceMess=' + JSON.stringify(this.data.spaceMess) + '&groundId=' + this.data.groundId,
    })
  },

  onShow() {
    if (this.data.orderDetail.name == null){
      if (this.data.coupon) {
        if (this.data.coupon.type == 1) {
          // 使用优惠券+无卡折扣的金额大于默认的金额
          if ((util.floatAdd(this.data.defaultReduceAmount, this.data.coupon.discount) > this.data.defaultRealAmount)) {
                  //使用的优惠券大于优惠后的真实金额
            if (this.data.orderDetail.realAmount > this.data.coupon.discount){
              this.setData({
                discountPrice: util.floatAdd(this.data.coupon.discount , this.data.defaultReduceAmount),
                realPrice: util.floatSub(this.data.defaultRealAmount, this.data.coupon.discount) < 0 ? 0 : util.floatSub(this.data.defaultRealAmount, this.data.coupon.discount)
              })
            }else{
              this.setData({
                discountPrice: this.data.defaultRealAmount + this.data.defaultReduceAmount,
                realPrice: util.floatSub(this.data.defaultRealAmount, this.data.coupon.discount) < 0 ? 0 : util.floatSub(this.data.defaultRealAmount, this.data.coupon.discount)
              })
            } 
          } else {
            this.setData({
              discountPrice: util.floatAdd(this.data.defaultReduceAmount, this.data.coupon.discount),
              realPrice: util.floatSub(this.data.defaultRealAmount, this.data.coupon.discount) < 0 ? 0 : util.floatSub(this.data.defaultRealAmount, this.data.coupon.discount)
            })
          }
        } else {
          if (this.data.coupon.maxDeductionAmount < util.mul(this.data.defaultRealAmount, this.data.coupon.discount) && this.data.coupon.maxDeductionAmount) {
            this.setData({
              discountPrice: util.floatAdd(this.data.coupon.maxDeductionAmount, this.data.defaultReduceAmount),
              realPrice: util.floatSub(this.data.defaultRealAmount, this.data.coupon.maxDeductionAmount) < 0 ? 0 : util.floatSub(this.data.defaultRealAmount, this.data.coupon.maxDeductionAmount)
            })
          } else {
            this.setData({
              discountPrice: util.floatAdd(util.floatSub(this.data.defaultRealAmount, util.mul(this.data.defaultRealAmount, this.data.coupon.discount)) < 0 ? 0 : util.floatSub(this.data.defaultRealAmount, util.mul(this.data.defaultRealAmount, this.data.coupon.discount)), this.data.defaultReduceAmount),
              realPrice: util.mul(this.data.defaultRealAmount, this.data.coupon.discount)
            })
          }
        }
      } else {
        var data = this.data.orderDetail;
        data.realAmount = this.data.defaultRealAmount;
        this.setData({
          reduceAmount: this.data.defaultReduceAmount,
          orderDetail: data
        })
      }
    }else{
      this.setData({
        coupon:null
      })
    }
   
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },



  /*******返回刷新******/
  changeData: function(name, phone) {
    var that = this;
    that.setData({
      name: name,
      phone: phone
    })
  },


  /*****************/

  setCardData: function() {
    var that = this
    var arr1 = [];
    var carList = that.data.carList
    for (var i = 0, len = carList.length; i < len; i++) {
      carList[i].checked = false;
      //循环计算储值卡扣卡余额是否足够
      if (carList[i].cardType == 5 && carList[i].discountType == 1) {
        carList[i].counts = util.mul(carList[i].deductionAmount, that.data.list.length)
      } else {
        carList[i].counts = null;
      }
      if (carList[i].objectId > 0) {
        arr1.push(carList[i])
      }else {
        if (carList.length == 1 && carList[0].cardType == null){
          arr1.push(carList[0])
        }else{
          arr1.push(carList[i])
        }
      }
    }

    if (arr1.length==0){
      return;
    }

    var data = {}
    data.planDate = that.data.planDate;
    data.sites = that.data.list;
    data.total = Number(that.data.price);
    if (arr1[0].discountRatio != null) {
      data.realAmount = util.mul(util.mul(that.data.price, arr1[0].discountRatio), 0.1);
    } else {
      data.realAmount = Number(that.data.price);
    }

    if (carList.length > 0) {
      carList[0].checked = true
      data.payType = carList[0].payType;
      data.cardType = carList[0].cardType;
      data.objectId = carList[0].objectId;
      data.name = carList[0].objectName;
      data.discountType = carList[0].discountType;
      if (carList[0].discountType == null) {
        data.discountRatio = 10;
      } else {
        if (carList[0].discountType == 2) {
          data.discountRatio = carList[0].discountRatio;
        } else {
          if (carList[0].cardType == 4) {
            if (carList[0].discountType == 1) {
              data.deductionCount = carList[0].deductionCount * that.data.list.length;
            } else {
              data.deductionCount = carList[0].deductionCount;
            }
            console.log(data.deductionCount)
          } else if (carList[0].cardType == 5) {
            if (carList[0].discountType == 1) {
              data.deductionAmount = util.mul(carList[0].deductionAmount, that.data.list.length)
            } else {
              data.deductionAmount = carList[0].deductionAmount;
            }
          }
        }
      }
    }
    that.setData({
      carList: carList,
      orderDetail: data,
      defaultRealAmount:data.realAmount,
      year: data.planDate.substring(0, 4),
      month: data.planDate.substring(4, 6),
      day: data.planDate.substring(6, 8),
      reduceAmount: util.floatSub(data.total, data.realAmount),
      defaultReduceAmount: util.floatSub(data.total, data.realAmount)
    })
    console.log('---金额---', that.data.reduceAmount)
    console.log('---list---', that.data.carList)
    console.log('---啦啦啦---', data)
  },

  bookingPInfo: function() {
    wx.navigateTo({
      url: '/pages/space/bookingpeopleinfo',
    })
  },

  lookForAgreement: function() {
    var that = this;
    that.setData({
      showModal: true
    })
  },

  agreement: function(){
    var that = this
    that.setData({ isAgreement: !this.data.isAgreement})
  },

  onCancle: function() {
    var that = this;
    that.setData({
      showModal: false
    })
  },

  toPayFor: function() {
    var that = this;
    var data = that.data.orderDetail;
    data.subscriberPhone = that.data.phone;
    data.subscriberName = that.data.name;
    delete data['name'];
    delete data['cardType'];
    if (data.discountType == 1) {
      data.realAmount = 0;
    }
    data.couponInstanceId = that.data.coupon == null ? null : that.data.coupon.id;
    centerService.goBuyGround(that.data.spaceMess.id, data).then((res) => {
      if (data.realAmount == 0 || that.data.realPrice==0) {
        wx.redirectTo({
          url: '/pages/space/paysuccess?id=' + res,
        })
      } else {
        buyCardService.goPay(res, function() {
          wx.redirectTo({
            url: '/pages/space/paysuccess?id=' + res.objectId
          })
        })
      }

    })
  },

  //刷新数据
  changePeferData: function (carList, data, spaceMess) {
    var that = this
    that.setData({
      carList: carList,
      orderDetail: data,
      defaultRealAmount:data.realAmount,
      spaceMess: spaceMess,
      year: data.planDate.substring(0, 4),
      month: data.planDate.substring(4, 6),
      day: data.planDate.substring(6, 8),
      reduceAmount: util.floatSub(data.total, data.realAmount),
      defaultReduceAmount: util.floatSub(data.total, data.realAmount)
    })
  },
  returnBook: function () {
    wx.navigateBack({});
  },
  //购买会员卡
  toBuyCar: function () {
    wx.navigateTo({
      url: '/pages/space/buyCarList?groundId=' + this.data.groundId,
    })
  },
})