// pages/coupon/pages/orderPage/orderPage.js
var centerService = require("../../../../service/centerService.js");
var buyCardService = require("../../../../service/buyCardService.js");
var headOfficeService = require("../../../../service/headOfficeService.js");
var util = require('../../../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    img:'',
    couponName:'',
    num:'',
    allPrice:'',
    list:'',
    planData:'',
    ticketId:'',
    date:'',
    isWechat:'',
    contractId:'',
    type:'',
    openingDay: '',
    closingDay: '',
    showCourse:false,
    firstOpen: '',
    firstClose: '',
    effEndDay:'',
    usageType:'',
    allDate:'',
    couponList: [],
    coupon: null,
    discountPrice: 0,
    amount: 0,
    realPrice: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var data=null;
    var that=this;
    wx.getStorage({
      key: 'couponMess',
      success: function(res) {
       data=JSON.parse(res.data);
        console.log(JSON.parse(res.data))
        that.setData({
            img: data.img,
            couponName:data.name,
            num: data.cartsNum,
            list: data.instances,
            allPrice: data.allPrice,
            amount:data.allPrice,
            realPrice: data.allPrice,
            planData: data.date.substring(4, 6) + '月' + data.date.substring(6,8)+'日',
            ticketId: data.ticketId,
              allDate:data.date,
            date: (data.date + '').substring(0, 4) + '.' + (data.date + '').substring(4, 6) + '.' + (data.date + '').substring(6,8),
            type:data.type,
            firstOpen: data.openingDay,
            firstClose: data.closingDay,
            usageType: data.usageType,
            openingDay: (data.openingDay + '').substring(0, 4) + '-' + (data.openingDay + '').substring(4, 6) + '-' + (data.openingDay + '').substring(6, 8),
            closingDay: (data.closingDay + '').substring(0, 4) + '-' + (data.closingDay + '').substring(4, 6) + '-' +( data.closingDay + '').substring(6, 8),
            notice: data.notice,
        })
        if (that.computerData(that.data.openingDay, data.saleDayLimit) < that.data.closingDay){
          that.setData({
            effEndDay: that.computerData(that.data.openingDay, data.saleDayLimit)
          })
        }else{
          that.setData({
            effEndDay: that.data.closingDay
          })
        }
        that.getCoupon();
      },
    })
    centerService.getStoreValueCardList().then((res) => {
       if(res.length>0){
         that.setData({
           isWechat: false,
           contractId: res[0].contractId
         })
       }
    })
  },
  // 获取优惠券
  getCoupon() {
    headOfficeService.getUsableCoupon(32).then((res) => {
      var arr = [];
      for (var i = 0, len = res.length; i < len; i++) {
        if (res[i].amountLimit <= this.data.allPrice) {
          arr.push(res[i])
        }
      }
      console.log(arr)
      this.setData({
        couponList: arr
      })
    })
  },

  //计算有效期后的天数
  computerData(date, num){
    var odate = new Date(date)
    odate = odate.valueOf()
    odate = odate + num * 24 * 60 * 60 * 1000
    odate = new Date(odate);
    return odate.getFullYear() + "-" + ((odate.getMonth() + 1) < 10 ? '0' + (odate.getMonth() + 1) : (odate.getMonth() + 1)) + "-" + (odate.getDate() < 10 ? '0' + odate.getDate() :odate.getDate())
  },
  toPay:function(){
    var that = this;
    var list = that.data.list;
    console.log(list)
    wx.removeStorage({
      key: 'valueCard'
    })
    for (var i = 0, len = list.length; i < len; i++) {
      list[i].ticketId = Number(that.data.ticketId);
      list[i].timesId = list[i].id || list[i].timesId;
      list[i].count = list[i].buyCount || list[i].count;
      list[i].date = that.data.allDate;

      list[i].ticketName = that.data.couponName;
      delete list[i].buyCount;
      delete list[i].centerId;
      delete list[i].time;
      delete list[i].createTime;
      delete list[i].id;
      delete list[i].price;
      delete list[i].singleCount;
      delete list[i].updateTime;
      delete list[i].startTime;
      delete list[i].endTime;
      delete list[i].name;
    }
    console.log(list)
    var data={
      payAmount:that.data.allPrice,
      instances:list,
      payMethod: that.data.isWechat?5:99,
      contractId: that.data.contractId == 0 ? '' : that.data.contractId,
      type:that.data.type,
      couponInstanceId: that.data.coupon ? that.data.coupon.id:null
    }
    console.log(data)
    centerService.buyCoupon(data).then((datas) => {
      //跳过支付时orderId为负数
      // console.log(datas<0)
      if (datas<0){
        wx.showLoading({
          title: '支付中',
          mask: true
        })
        wx.navigateTo({
          url: '/pages/coupon/pages/payResult/payResult?status=' + 1 + '&id=' + datas * (-1),
        })
      }else{
        buyCardService.goPay(datas, function () {
            wx.navigateTo({
              url: '/pages/coupon/pages/payResult/payResult?status=' + 1 + '&id=' + datas.objectId,
            })
          })
      }
    }).catch((err) => {
      wx.hideLoading();
      // wx.navigateTo({
      //   url: '/pages/coupon/pages/payResult/payResult?status='+0,
      // })
    })
  },
  toCoupon() {
    var id = this.data.coupon ? this.data.coupon.id : -1;
    wx.navigateTo({
      url: '/pages/tickets/newCouponList?id=' + id + '&type=32' + '&price=' + this.data.allPrice,
    })
  },
  changeStyle:function(){
    wx.navigateTo({
      url: '/pages/coupon/pages/payStyle/payStyle?isWechat=' + this.data.isWechat + '&contractId=' + this.data.contractId,
    })
  },
  preventTouchMove:function(){

  },
  showRemind(){
   this.setData({
     showCourse:true
   })
  },
  hideCourse: function () {
    this.setData({
      showCourse: false
    })
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
    var that=this;
    wx.getStorage({
      key: 'valueCard',
      success: function (res) {
          that.setData({
            isWechat: JSON.parse(res.data).isWechat,
            contractId: JSON.parse(res.data).contractId
          })
        console.log(JSON.parse(res.data))
      },
      fail(res){
        centerService.getStoreValueCardList().then((res) => {
          if (res.length > 0) {
            that.setData({
              isWechat: false,
              contractId: res[0].contractId
            })
          }
        })
      }
    })
    if (this.data.coupon) {
      console.log(this.data.coupon)
      if (this.data.coupon.type == 1) {
        if (this.data.coupon.discount > this.data.amount) {
          this.setData({
            discountPrice: this.data.amount,
            realPrice: util.floatSub(this.data.amount, this.data.coupon.discount) < 0 ? 0 : util.floatSub(this.data.amount, this.data.coupon.discount)
          })
        } else {
          this.setData({
            discountPrice: this.data.coupon.discount,
            realPrice: util.floatSub(this.data.amount, this.data.coupon.discount) < 0 ? 0 : util.floatSub(this.data.amount, this.data.coupon.discount)
          })
        }
        
      } else {
        if ((this.data.coupon.maxDeductionAmount < util.mul(this.data.amount, this.data.coupon.discount) && this.data.coupon.maxDeductionAmount)) {
          console.log(util.floatSub(this.data.amount, this.data.coupon.maxDeductionAmount))
          this.setData({
            discountPrice: this.data.coupon.maxDeductionAmount,
            realPrice: util.floatSub(this.data.amount, this.data.coupon.maxDeductionAmount) < 0 ? 0 : util.floatSub(this.data.amount, this.data.coupon.maxDeductionAmount)
          })
        } else {
          this.setData({
            realPrice: util.mul(this.data.amount, this.data.coupon.discount),
            discountPrice: util.floatSub(this.data.amount, util.mul(this.data.amount, this.data.coupon.discount)) < 0 ? 0 : util.floatSub(this.data.amount, util.mul(this.data.amount, this.data.coupon.discount))
          })
        }
      }
    } else {
      this.setData({
        discountPrice: 0,
        realPrice: this.data.allPrice
      })
    }
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
    wx.removeStorage({
      key: 'valueCard'
    })
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