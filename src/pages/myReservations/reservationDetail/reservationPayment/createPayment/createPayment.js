
var notificationCenter = require('../../../../../WxNotificationCenter.js');
var config = require('../../../../../config.js');
var notifConstant = require('../../../../../utils/notifConstant.js');
var orderService = require('../../../../../service/orderService.js');
var buyCardService = require('../../../../../service/buyCardService.js')
var requestUtil = require('../../../../../utils/requestUtil.js')
var isPay = false
// var wxPromisify = require('../../../../../utils/wxPromisify.js')


Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalTime: 0,
    formatTime: '',
    orderId: "",
    order: null,
    countTimer: null,
    checkTimer: null,
    tradeNo: "",
    isPayAvailable: true,
    isPaySuccess: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.data.orderId = options.orderId;
    // this.countDown();
    this.getData();
  },

  getData: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    orderService.orderDetail(that.data.orderId).then((res) => {
      if (res) {
        that.handleData(res);
      }
    });
  },

  handleData: function (data) {
    var that = this;
    that.setData(
      {
        order: data
      }
    );
    if (data.statusId == -2) //已支付
    {
      that.setData(
        {
          isPayAvailable: false,
          totalTime: 0,
          formatTime: '00:00',
        }
      );
    }
    else {
      let current = Math.round(new Date() / 1000);
      let createTimeTs = Math.round(data.createTime / 1000);
      let interval = current - createTimeTs;
      if (interval < 900) //15分钟之内
      {
        that.data.totalTime = 899 - interval;
        that.countDown();
      }
      else //超时
      {
        that.setData(
          {
            isPayAvailable: false,
            totalTime: 0,
            formatTime: '00:00',
          }
        );
      }
    }
  },

  countDown: function () {
    var seconds = this.data.totalTime;
    var that = this;
    if (seconds == 0) {
      clearTimeout(that.data.countTimer);
      return;
    }
    that.data.countTimer = setTimeout(function () {

      seconds = seconds - 1;
      let temp = that.formatSeconds(seconds);
      that.setData(
        {
          totalTime: seconds,
          formatTime: temp
        });
      that.countDown();

    }, 1000)
  },

  didTapGreenBtn: function () {

    if (this.data.isPayAvailable) {
     // this.wechatPay();
      this.goPay();
    }
  },


  goPay: function () {
    console.log('456')
    //service.setUrl($scope.centerId+'/courseOrder/'+item);
    var that = this;
    var url = config.orderStatus(that.data.orderId)
    requestUtil.getRequest(url).then(res => {
      // if (isPay) {
      //   return
      // }
      // isPay = true;
      var that = this;
      buyCardService.goBuyActivity(that.data.orderId, 1).then((res) => {
        console.log(isPay)
        buyCardService.goPay(res, function (tradeNo) {
          wx.showToast({
            title: '购买成功',
          })
          console.log(isPay)
          wx.redirectTo({
            url: '../paymentSuccess/paymentSuccess?orderId=' + that.data.orderId,
          })
          return;
        })
        // isPay = false;
      }).catch((err) => {
        wx.hideLoading();
        systemMessage.showModal('', err);
        // isPay = false;
      })

    }).catch(err => {
      // isPay = false;
      notificationCenter.postNotificationName(notifConstant.refreshReservationListNotif, { name: "pay" });
    })
  },



  // wechatPay: function () {
  //   wx.showLoading({
  //     title: '加载中',
  //   })
  //   var that = this;
  //   //服务端获取支付参数

  //   orderService.wechatPay(that.data.orderId).then((res) => {

  //     that.data.tradeNo = res.tradeNo;
  //     that.wxPayment(res);

  //   }).catch((err) => {
  //     notificationCenter.postNotificationName(notifConstant.refreshReservationListNotif, { name: "pay" });
  //   })

  // },


  //调用微信支付API支付
  // wxPayment: function (res) {
  //   var that = this;
  //   wx.requestPayment({
  //     timeStamp: String(res.timestamp),
  //     nonceStr: res.nonceStr,
  //     package: "prepay_id=" + res.prepayId,
  //     signType: res.signType,
  //     paySign: res.signKey,
  //     success: function (res) {
  //       wx.hideLoading();
  //       wx.showModal({
  //         title: '支付成功',
  //         showCancel: false
  //       })
  //       that.setData(
  //         {
  //           isPayAvailable: false,
  //         }
  //       );
  //       that.checkPayResult();

  //     },
  //     fail: function (res) {
  //       wx.hideLoading();
  //       wx.showModal({
  //         title: '支付失败',
  //         showCancel: false
  //       })
  //     }
  //   })
  // },

  //轮训支付结果
  // checkPayResult: function () {

  //   var that = this;
  //   if (that.data.isPaySuccess) {

  //     clearTimeout(that.data.checkTimer);
  //     notificationCenter.postNotificationName(notifConstant.refreshReservationListNotif, { name: "pay" });

  //     //最多可以有五个页面,所以在当前页面打开
  //     wx.redirectTo({
  //       url: '../paymentSuccess/paymentSuccess?orderId=' + that.data.orderId,
  //     })
  //     return;
  //   }
  //   that.data.countTimer = setTimeout(function () {
  //     orderService.checkWechatPayResult(that.data.tradeNo).then((res) => {
  //       that.data.isPaySuccess = res;
  //       that.checkPayResult();
  //     });
  //   }, 1000);

  // },

  //秒数转分秒
  formatSeconds: function (total) {

    var minutes = Math.floor(total / 60);
    var seconds = total % 60;
    function twoDigits(num) {
      return ('0' + num).slice(-2);
    }
    let temp = twoDigits(minutes) + ":" + twoDigits(seconds);
    return temp
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


})