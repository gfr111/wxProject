var requestUtil = require('../utils/requestUtil.js');
var config = require('../config.js');
var systemMessage = require('../SystemMessage.js');
/*var tryCount = 0;
var maxTryCount = 30;*/

function getSellCards(){
  var url = config.sellCardListUrl();
  return requestUtil.getRequest(url);
}
function getSellCardDetail(id,exId=null){
  var url = config.sellCardDetailUrl(id, exId);
  return requestUtil.getRequest(url);
}
function getSellCourseDetail(id){
  var url = config.sellCourseDetailUrl(id);
  return requestUtil.getRequest(url);
}
function getTrainerList(courseId){
  var url = config.getTrainerListUrl(courseId);
  return requestUtil.getRequest(url);
}
function getusefulClub(id,course) {
  var url = config.usefulClub(id, course);
  return requestUtil.getRequest(url);
}
function getusefulClubV2(contractId) {
  var url = config.usefulClubV2(contractId);
  return requestUtil.getRequest(url);
}
function getusefulCourse(centerId,id) {
  var url = config.usefulCourse(centerId,id);
  return requestUtil.getRequest(url);
}
function getusefulCourseV2(centerId, id) {
  var url = config.usefulCourseV2(centerId, id);
  return requestUtil.getRequest(url);
}
function getAgreement(type) {
  var url = config.agreement(type);
  return requestUtil.getRequest(url);
}
function lookForAgreementR( protocolId) {
  var url = config.lookForAgreement(protocolId)
  return requestUtil.getRequest(url)
}

function getTrainerDetail(id, center = null) {
  var url = config.trainerDetail(id, center);
  return requestUtil.getRequest(url);
}

function getTicketList() {
  var url = config.ticketList();
  return requestUtil.getRequest(url);
}

function getTicketDetail(id) {
  var url = config.ticketDetail(id);
  return requestUtil.getRequest(url);
}

function goToCollageDetail(id) {
  var url = config.collageDeatail(id);
  return requestUtil.getRequest(url);
}

function getMyCollage() {
  var url = config.myCollage();
  return requestUtil.getRequest(url);
}


function getInstanceCollage(id) {
  var url = config.instanceCollage(id);
  return requestUtil.getRequest(url);
}

function goBuyCard(cardId, contractId, sellerId = null, salesId = null, collageId = null, instanceId = null, standardId = null, distributorId = null, couponInstanceId=null){
    wx.showLoading({
      title: '支付中',
      mask: true
    })
  var url = config.getBuyCardUrl(cardId, contractId, sellerId, salesId, collageId, instanceId, standardId, distributorId, couponInstanceId);
  return requestUtil.getRequest(url,true,false);
}

function goBuyActPay(centerId, orderId, orderType = 5, source = 3){
  wx.showLoading({
    title: '支付中',
    mask: true
  })
  var url = null
  if (source == 3) {
    if (orderType == 5) {
      url = config.activityBuyPay(centerId, orderId)
    } else if (orderType == 3) {
      url = config.getCardOrderUrl(orderId);
    } else {
      url = config.getCourseOrderUrl(orderId);
      return requestUtil.postRequest(url, { trainerId: -1 }, false);
    }
  } else {
    url = config.otherPay(orderId);
  }
  return requestUtil.getRequest(url, false, false);
}

function goBuyActivity(orderId,orderType = 5,source = 3){
  wx.showLoading({
    title: '支付中',
    mask: true
  })
  var url =null
  if(source ==3){
  if(orderType==5){
     url = config.activityPay(orderId)
  }else if(orderType==3){
    url = config.getCardOrderUrl(orderId);
  }else{
    url = config.getCourseOrderUrl(orderId);
    return requestUtil.postRequest(url, {trainerId:-1}, false);
  }
  }else{
    url = config.otherPay(orderId);
  }
  
  return requestUtil.getRequest(url,false,false);
}
function preCardPay(contractId){
  wx.showLoading({
    title: '支付中',
    mask: true
  })
  var url = config.preCardPay(contractId)
  return requestUtil.getRequest(url,false,false);
}
function goBuyCoursePro(centerId, courseId, count, trainerId, amount, preId) {
  wx.showLoading({
    title: '支付中',
    mask: true
  })
  var data = { trainerId: trainerId, buyCount: count, amount: amount }
  var url = config.getBuyCourseProUrl(centerId, courseId,preId);
  return requestUtil.postRequest(url, data, false);
}

function goBuyCourse(courseId, count, trainerId, amount, collageId = null, instanceId = null, couponInstanceId=null){
  wx.showLoading({
    title: '支付中',
    mask: true
  })
  var data = { trainerId: trainerId, buyCount: count, amount: amount}
  console.log(data)
  var url = config.getBuyCourseUrl(courseId, collageId, instanceId, couponInstanceId);
  return requestUtil.postRequest(url,data,false);
}

function goBuyShop(items, pricePayed, contractId, payMethod, couponInstanceId = null, orderIdIsOnlineOrderId = true, ){
  wx.showLoading({
    title: '支付中',
    mask: true
  })
  var data = { items: items, payMethod: payMethod, pricePayed: pricePayed, type: 1, contractId: contractId, couponInstanceId: couponInstanceId }
  // console.log(data)
  var url = config.getBuyShopUrl(orderIdIsOnlineOrderId);
  return requestUtil.postRequest(url,data,false);
}


function getSellCourses() {
  var url = config.sellCourseListUrl();
  return requestUtil.getRequest(url);
}
function getShopOrder(orderId, orderIdIsOnlineOrderId=true) {
  var url = config.getShopOrderUrl(orderId, orderIdIsOnlineOrderId);
  return requestUtil.getRequest(url);
}
function getShopOrderList() {
  var url = config.getShopOrderListUrl();
  return requestUtil.getRequest(url);
}

function getStockList(centerId=null){
  var url = config.getStockList(centerId)
  return requestUtil.getRequest(url)
}

function getMyCarDetail(id,contractId,type) {
  var url = config.myCarDetail(id, contractId,type)
  return requestUtil.getRequest(url)
}

//次卡分享
function submitShareCard(contractId,data) {
  var url = config.shareCard(contractId)
  return requestUtil.postRequest(url,data)
}
//取消次卡分享
function cancelhareCard(shareId) {
  var url = config.cancelShare(shareId)
  return requestUtil.postRequest(url)
}
//获取次卡分享信息
function getShareCardMess(centerId,shareId) {
  var url = config.shareCardMess(centerId, shareId)
  return requestUtil.getRequest(url)
}
// 领取次卡
function getReceiveCard(centerId, shareId) {
  var url = config.receiveCard(centerId, shareId)
  return requestUtil.postRequest(url)
}

function checkPayStatus(tradeNo, tryCount, success) {
  tryCount++;
  if (tryCount > 15) {
    wx.hideLoading();
    wx.showModal({
      // content: '支付超时，请查看已购会员卡/私教课/场地预约/我的票券或检查是否有退款',
      content: '支付超时，请查看相关订单或检查是否有退款',
      showCancel: false
    });
    return;
  }
  var url = config.checkPayStatusUrl(tradeNo);
  requestUtil.postRequest(url,null,false).then((res)=>{
    if (res == 1) {
      wx.hideLoading();
      // systemMessage.showToast('支付成功', 'success', 1500);
      success(tradeNo);
    } else if (res == 2) {
      setTimeout(function () {
        checkPayStatus(tradeNo, tryCount,success);
      }, 1000);
    } else if (res == 3) {
      wx.hideLoading();
      wx.showModal({
        content: '办卡/买课/场地预约时出现问题，已为您进行退款！',
        showCancel: false
      });
    } else if (res == 4) {
      wx.hideLoading();
      wx.showModal({
        content: '办卡/买课/场地预约时出现问题，退款时失败，请联系场馆人员！',
        showCancel: false
      });
    }
  });
};

function goPay(info, success){
  if (info.signInfo){
    info = info.signInfo
  }
  wx.requestPayment({
    timeStamp: String(info.timestampStr),
    nonceStr: info.nonceStr,
    package: info.packageStr,
    signType: info.signType,
    paySign: info.signKey,
    success: function (res) { 
      checkPayStatus(info.tradeNo, 0, success);
      
    },
    fail: function (res) {
      wx.hideLoading();
      wx.showModal({
        content: '支付失败',
        showCancel: false
      })
    }
  })
}

module.exports = {
  cancelhareCard: cancelhareCard,
  getReceiveCard: getReceiveCard,
  getShareCardMess: getShareCardMess,
  submitShareCard: submitShareCard,
  getusefulCourseV2: getusefulCourseV2,
  getusefulClubV2: getusefulClubV2,
  getSellCards: getSellCards,
  getSellCourses: getSellCourses,
  getSellCardDetail: getSellCardDetail,
  getSellCourseDetail: getSellCourseDetail,
  getTrainerList: getTrainerList,
  goBuyCard: goBuyCard,
  goBuyCourse: goBuyCourse,
  goBuyShop: goBuyShop,
  goPay: goPay,
  getShopOrder: getShopOrder,
  getusefulClub: getusefulClub,
  getusefulCourse: getusefulCourse,
  getAgreement: getAgreement,
  getTrainerDetail: getTrainerDetail,
  getTicketList: getTicketList,
  goBuyActivity: goBuyActivity,
  getTicketDetail: getTicketDetail,
  goToCollageDetail:goToCollageDetail,
  getInstanceCollage: getInstanceCollage,
  getMyCollage: getMyCollage,
  getStockList: getStockList,
  preCardPay: preCardPay,
  getShopOrderList: getShopOrderList,
  getMyCarDetail: getMyCarDetail,
  goBuyActPay: goBuyActPay,
  goBuyCoursePro: goBuyCoursePro,
  lookForAgreementR: lookForAgreementR
}
