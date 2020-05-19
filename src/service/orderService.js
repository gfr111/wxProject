var requestUtil = require('../utils/requestUtil.js');
var config = require('../config.js');


var orderService = (function(){
  function orderList() {
    let url = config.orderListUrl();
    return requestUtil.getRequest(url);
   }

  function orderDetail(id) {
    let url = config.orderDetailUrl(id);
    return requestUtil.getRequest(url);
  }

  function wechatPay(orderId) {
    let url = config.wechatPayUrl(orderId);
    return requestUtil.postRequest(url, getApp().globalData.openId);
  }

  function checkWechatPayResult(tradeNo) {
    let url = config.wechatPayResultUrl(tradeNo);
    return requestUtil.postRequest(url, null);
  }

  function checkPayAvailable(orderId) {
    let url = config.payAvailableUrl(orderId)
    return requestUtil.getRequest(url);
  }
   return {
     orderList:orderList,
     orderDetail:orderDetail,
     wechatPay:wechatPay,
     checkWechatPayResult:checkWechatPayResult,
     checkPayAvailable:checkPayAvailable
   }
})()

module.exports = orderService