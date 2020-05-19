
var config = (function() {
  var host = 'https://www.forzadata.cn/api/';
  // var host = 'http://10.0.0.28:9090/api/'
  // var host = 'http://10.0.0.5:8081/api/'
  // var host = 'https://ce027cb5.ngrok.io/api/'
  //  var host = 'http://10.0.0.116:9090/api/';
  // var host = 'http://10.0.0.12:8080/api/';
  // var host = 'http://10.0.0.12:9095/api/';
  // var host = 'http://10.0.0.216:8080/api/';
  // var host = 'http://10.0.0.34:8085/api/';
  function isGlobalDataAvailable() {
    return typeof(getApp().globalData) != 'undefined'
  }
  function getOpenId() {
    if (!getApp().globalData.openId){
      getApp().getAppOpenId();
    }
    return getApp().globalData.openId;
  }

  function getCenterId() {
    var club = wx.getStorageSync('selectCenterKey') || getApp().globalData.selectCenter;
    let centerId = club.id ? club.id : ''
    if (centerId) {
      return centerId
    } else {
      return ""
    }
  }
  function getHeaderCenterId() {
    let centerId = getApp().globalData.headCenterId;
    if (centerId) {
      return centerId
    }
    return ""
  }
  function loginUrl(code) {
    if (getHeaderCenterId() == 1) {
      return host + 'wxApp/login/' + code + '/' + getHeaderCenterId();
    } else {
      return host + 'wxApp/login/customized/' + code + '/' + getHeaderCenterId();
    }
  }
  //在线购卡订单  originalId
  function getBuyCardUrl(cardId, contractId, sellerId = null, salesId = null, collageId = null, instanceId = null, standardId = null, distributorId = null, couponInstanceId=null) {
    var url = host + 'wxApp/buy/' + getCenterId() + '/createCardOrder/' + cardId + '?contractId=' + contractId + '&sellerId=' + sellerId + '&thirdParty=' + getHeaderCenterId() + '&openId=' + getOpenId();
    if (salesId != null) {
      url = url + '&salesId=' + salesId
    }
    if (collageId != null) {
      url = url + '&groupBookId=' + collageId
    }
    if (instanceId != null) {
      url = url + '&groupBookInstanceId=' + instanceId
    }
    if (standardId != null) {
      url = url + '&standardId=' + standardId
    }
    if (distributorId != null) {
      url = url + '&distributorId=' + distributorId
    }
    if (couponInstanceId != null) {
      url = url + '&couponInstanceId=' + couponInstanceId
    }
    return url;
  }

  function getCardOrderUrl(orderId) {
    return host + 'wxApp/buy/' + getCenterId() + '/createCardOrder/-1?orderId=' + orderId + '&thirdParty=' + getHeaderCenterId() + '&openId=' + getOpenId();
  }

  function getBuyCourseUrl(courseId, collageId = null, instanceId = null, couponInstanceId=null) {
    var url = host + 'wxApp/buy/' + getCenterId() + '/createCourseOrder/' + courseId + '?thirdParty=' + getHeaderCenterId() + '&openId=' + getOpenId();
    if (collageId != null) {
      url = url + '&groupBookId=' + collageId
    }
    if (instanceId != null) {
      url = url + '&groupBookInstanceId=' + instanceId
    }
    if (couponInstanceId != null) {
      url = url + '&couponInstanceId=' + couponInstanceId
    }
    return url;
  }

  function getBuyCourseProUrl(centerId, courseId, preId) {
    return host + 'wxApp/buy/' + centerId + '/createCourseOrder/' + courseId + '?perCourseId=' + preId + '&thirdParty=' + getHeaderCenterId() + '&openId=' + getOpenId();
  }

  function getBuyShopUrl() {
    return host + 'wxApp/buy/' + getCenterId() + '/createMerchandiseOrder/v2?thirdParty=' + getHeaderCenterId() + '&openId=' + getOpenId();
  }

  function getShopOrderListUrl() {
    return host + 'wxApp/buy/' + getCenterId() + '/stockOrderList';
  }

  function getShopOrderUrl(orderId, orderIdIsOnlineOrderId = true) {
    return host + 'wxApp/buy/' + getCenterId() + '/stockOrder/' + orderId + '?orderIdIsOnlineOrderId=' + orderIdIsOnlineOrderId;
  }

  function getCourseOrderUrl(orderId) {
    return host + 'wxApp/buy/' + getCenterId() + '/createCourseOrder/-1?thirdParty=' + getHeaderCenterId() + '&openId=' + getOpenId() + '&orderId=' + orderId;
  }
  //查询支付订单状态
  function checkPayStatusUrl(tradeNo) {
    return host + 'wx/pay/lc/' + tradeNo;
  }

  function thirdPartyLoginUrl(code) {
    return host + 'wxApp/login/customized/' + code + '/' + getHeaderCenterId();
  }
  // 获取积分规则
  function getscoreRule(code) {
    return host + 'wxApp/' + getCenterId() + '/scoreRule';
  }

  function scanCodeUrl(centerId) {
    var temp = centerId ? centerId : getCenterId();
    return host + 'wxApp/' + temp + '/preCheckIn';
  }
  //获取扫呗支付参数
  function lcPayUrl(openId) {
    return host + 'wxApp/' + 1 + '/lcPay/' + openId;
  }


  function bindPhoneUrl() {
    let targetCenterId = wx.getStorageSync('selectCenterKey').id || wx.getStorageSync("targetCenterId")
    if (targetCenterId) {
      return host + 'wxApp/login/' + getHeaderCenterId() + '/verifySmsCode?targetCenterId=' + targetCenterId;
    } else {
      return host + 'wxApp/login/' + getHeaderCenterId() + '/verifySmsCode';
    }
  }

  function preCheckIn(centerId) {
    return host + 'wxApp/' + centerId + '/qrCheckIn';
  }

  function checkInStatusUrl(centerId, checkInId) {
    return host + "wx3/center/" + centerId + '/refreshCheckInStatus/' + checkInId;
  }
  //签出
  function tryCheckOut(centerId, deviceId) {
    return host + 'wxApp/' + centerId + '/' + deviceId + '/tryCheckout';
  }

  function checkOut(centerId, deviceId) {
    return host + 'wxApp/' + centerId + '/' + deviceId + '/checkout';
  }

  function requestSmsCode(changePhone = false) {
    return host + 'wxApp/login/requestSmsCode?changePhone=' + changePhone;
  }

  function getStockList(centerId) {
    if (centerId == null) {
      return host + 'wxApp/buy/' + getCenterId() + '/stockList';
    } else {
      return host + 'wxApp/buy/' + centerId + '/stockList';
    }
  }

  function bindWXPhoneUrl() {
    let targetCenterId = wx.getStorageSync('selectCenterKey').id || wx.getStorageSync("targetCenterId")
    if (targetCenterId) {
      return host + 'wxApp/login/' + getHeaderCenterId() + '/getPhone?targetCenterId=' + targetCenterId;
    } else {
      return host + 'wxApp/login/' + getHeaderCenterId() + '/getPhone'
    }
    return host + 'wxApp/login/' + getHeaderCenterId() + '/getPhone';
  }


  // 第三方俱乐部门店列表
  function thirdPartyCenterListUrl() {
    return host + 'wxApp/login/' + getHeaderCenterId() + '/selector';
  }

  function getAppInfo() {
    return host + 'wxApp/login/' + getHeaderCenterId() + '/getAppInfo'
  }
  // 已登录的领取证券
  function receive(centerId, instanceId) {
    return host + 'wx4/' + centerId + '/coupon/appReceive/' + instanceId;
  }
  //所有门店列表
  function centerListUrl() {
    if (getHeaderCenterId() == 1) {
      if (getApp().globalData.token && getApp().globalData.token != null) {
        return host + "wxApp/traineeCenters";
      } else {
        return host + "wxApp/login/centers/1";
      }
    } else {
      return host + 'wxApp/login/' + getHeaderCenterId() + '/selector';
    }
  }

  function cardListUrl() {
    return host + 'wxApp/' + getCenterId() + '/myCards';
  }

  function officePrivateReserve(instanceId) {
    console.log(instanceId, "instanceId")
    return host + 'wx/groupCourse/' + getCenterId() + '/reserveStudio?instanceId=' + (instanceId && instanceId > 0 ? instanceId : -1);
  }

  function courseListUrl() {
    return host + 'wxApp/' + getCenterId() + '/privateCourse/v2';
  }

  function getCalendar(trainerId, ts) {
    return host + 'wx/addPrivateCourse/' + getCenterId() + '/' + trainerId + '/getCalendar/' + ts;
  }

  function getStudioCalendar(trainerId, ts) {
    return host + 'wx/addPrivateCourse/' + getCenterId() + '/' + trainerId + '/getStudioCalendar/' + ts;
  }

  function privateReserve() {
    return host + 'wx/addPrivateCourse/' + getCenterId() + '/reserve';
  }

  //购买不需要支付的促销活动 originalId
  function getNoPaySalesUrl(salesId) {
    return host + 'wxApp/' + getCenterId() + '/noPaySalesPromotion/' + salesId;
  }

  function uploadImgUrl() {
    return host + 'wxApp/' + getCenterId() + '/uploadImg';
  }

  function uploadSignImgUrl(contractId) {
    return host + 'wxApp/' + getCenterId() + '/' + contractId + '/electroincSign'
  }

  function submitEvaUrl() {
    return host + 'wx/centerFeedback/' + getCenterId();
  }

  function sellCardListUrl() {
    return host + 'wxApp/buy/' + getCenterId() + '/sellCards';
  }

  function sellCourseListUrl() {
    return host + 'wxApp/buy/' + getCenterId() + '/sellCourses';
  }

  function sellCardDetailUrl(cardId, exId = null) {
    if (exId == null) {
      return host + 'wxApp/buy/' + getCenterId() + '/cardDetail/' + cardId
    } else {
      return host + 'wxApp/buy/' + getCenterId() + '/cardDetail/' + cardId + '?salesPromotionId=' + exId
    }
  }

  function sellCourseDetailUrl(courseId) {
    return host + 'wxApp/buy/' + getCenterId() + '/courseDetail/' + courseId;
  }

  function getTrainerListUrl(courseId) {
    return host + 'wxApp/login/' + getCenterId() + '/chooseTrainer/' + courseId + '/v2';
  }

  function getTrainerCourse(trainerId, centerId) {
    if (centerId != null && centerId != 'null') {
      return host + 'wxApp/' + centerId + '/choosePrivateCourse/' + trainerId
    } else {
      return host + 'wxApp/' + getCenterId() + '/choosePrivateCourse/' + trainerId
    }
  }

  function reservePrivateCourseInfo(trainerId, courseId) {
    return host + 'wxApp/' + getCenterId() + '/reservePrivateCourse/' + trainerId + '/' + courseId
  }

  function officeReservePrivateCourseInfo(trainerId, courseId) {
    return host + 'wxApp/reserve/' + getCenterId() + '/studioCourse/' + trainerId + '/' + courseId
  }

  function userQRCodeUrl() {
    return host + 'wxApp/' + getCenterId() + '/myQr/v2';
  }

  function groupCourseList(date) {
    return host + 'wxApp/login/' + getCenterId() + '/groupCourse/' + date;
  }
  // 获取会员卡
  function getGroupCourseDetailUrl(centerId, instanceId, courseId) {
    console.log(centerId)
    if (centerId != null && centerId != 'null') {
      return host + 'wxApp/reserve/' + centerId + '/groupCourse/' + instanceId + '/' + courseId + '/v2';
    } else {
      return host + 'wxApp/reserve/' + getCenterId() + '/groupCourse/' + instanceId + '/' + courseId + '/v2';
    }
  }
  // 获取团课详情
  function getGroupCourseDetail(instanceId) {
    return host + 'wxApp/' + getCenterId() + '/groupCourseDetail/' + instanceId;
  }

  function getGroupCourseAppointmentSeatArrayUrl(instanceId) {
    return host + 'wx/groupCourse/' + getCenterId() + '/instance/' + instanceId + '/reservedSeat';
  }

  function appointmentConfirmUrl(instanceId) {
    return host + 'wx/groupCourse/' + getCenterId() + '/reserve/' + instanceId
  }

  function userAccountUrl() {
    return host + 'wxApp/' + getCenterId() + "/profile";
  }

  function shareLinkUrl(couponInstanceId, count, shareCode) {
    return host + 'wxApp/' + getCenterId() + "/coupon/" + couponInstanceId + "/" + count + "?shareCode=" + shareCode;
  }

  //我的预约列表
  function reservationListUrl(courseType, page, lastyear) {
    // return host + 'wxApp/' + getCenterId() + '/myReserved/' + page + '?year=' + lastyear;
    return host + 'wxApp/' + getCenterId() + '/myReserved/' + courseType + '/' + page + '?year=' + lastyear;
  }
  //分享的票券详情
  function shareDetail(code, centerId) {
    return host + 'wxApp/login/' + centerId + '/receiveDetail/' + '?shareCode=' + code;
  }

  function signCourse(centerId, code) {
    return host + 'wxApp/' + centerId + '/completeStudioCourse/' + code
  }
  //评价预约
  function rateReservation(id) {
    return host + 'course/reservation/' + id + '/rate';
  }
  //卡适用场馆
  function usefulClub(cardId, course) {
    return host + 'wxApp/' + getCenterId() + '/cardInfo/' + cardId + '/centers?isCard=' + course;
  }
  //卡使用场馆v2
  function usefulClubV2(contractId) {
    return host + 'wxApp/' + getCenterId() + '/usableCenters/' + contractId;
  }

  //拼团活动详情
  function collageDeatail(id) {
    return host + 'wxApp/buy/' + getCenterId() + '/groupBookingDetail/' + id;
  }
  // aaa
  function getActivity(centerId, id) {
    console.log(id)
    return host + 'wxApp/' + centerId + '/activityDetail/' + id;
  }

  function goReserve(centerId, id, count) {
    return host + 'wxApp/' + centerId + '/goReserve/' + id + '/' + count;
  }

  function orderStatus(orderId) {
    return host + 'wx4/' + getCenterId() + '/cardOrderValidateStatus/' + orderId;
  }

  function cancelOrder(orderId) {
    return host + 'wx4/' + getCenterId() + '/cardOrder/' + orderId + '/cancel';
  }
  // 报名 originalId
  function signUp(centerId, id, count, originalId) {
    if (originalId) {
      return host + 'wxApp/' + centerId + '/signUp/' + id + '/' + count + '?originalId=' + originalId
    }
    return host + 'wxApp/' + centerId + '/signUp/' + id + '/' + count
  }

  function confirmStartPrivateCourse(centerId, code) {
    return host + 'wxApp/' + centerId + '/confirmStartPrivateCourse/' + code
  }

  function getBuyCardInfoDetail(centerId, contractId) {
    return host + 'wxApp/' + centerId + '/cardContract/' + contractId + '?loadPreCardInfo=true'
    //return host + 'wxApp/' + centerId + '/confirmStartPrivateCourse/' + code
  }

  function activityBuyPay(centerId, orderId) {
    return host + 'wxApp/buy/' + centerId + '/createActivityOrder/' + orderId + '?thirdParty=' + getHeaderCenterId() + '&openId=' + getOpenId();
  }

  function activityPay(orderId) {
    return host + 'wxApp/buy/' + getCenterId() + '/createActivityOrder/' + orderId + '?thirdParty=' + getHeaderCenterId() + '&openId=' + getOpenId();
  }
  //会籍app私教app购卡购课收定金支付
  function otherPay(orderId) {
    return host + 'wxApp/buy/' + getCenterId() + '/createPhoneAppOrder/' + orderId + '?thirdParty=' + getHeaderCenterId() + '&openId=' + getOpenId();
  }
  //会籍预办卡签字完支付
  function preCardPay(contractId) {
    return host + 'wxApp/buy/' + getCenterId() + '/createPreCardPay/' + contractId + '?thirdParty=' + getHeaderCenterId() + '&openId=' + getOpenId();
  }

  //课适用场馆
  function usefulClub(cardId, course) {
    return host + 'wxApp/' + getCenterId() + '/cardInfo/' + cardId + '/centers?isCard=' + course;
  }
  //适用课程
  function usefulCourse(centerId, cardId) {
    return host + 'wxApp/' + centerId + '/cardInfo/' + cardId + '/courses';
  }
  //适用课程V2
  function usefulCourseV2(centerId, contractId) {
    return host + 'wxApp/' + centerId + '/cardUsefull/' + contractId;
  }
  // 获取服务协议
  function agreement(type) {
    if (type == null) {
      return host + 'wxApp/' + getCenterId() + '/protocol';
    } else {
      return host + 'wxApp/' + getCenterId() + '/protocol?type=' + type;
    }
  }
  // 获取票券列表
  function ticketList() {
    return host + 'wxApp/' + getCenterId() + '/myCoupon';
  }
  // 获取票券详情
  function ticketDetail(id) {
    return host + 'wxApp/' + getCenterId() + '/couponDetail/' + id;
  }
  //取消预约
  function cancelReservation(id) {
    return host + '/wx/groupCourse/' + getCenterId() + '/cancelReserve/' + id;
  }

  function cancelPrivateReservation(id) {
    return host + '/wx/addPrivateCourse/' + getCenterId() + '/cancelReservation/' + id;
  }
  //我的订单列表
  function orderListUrl() {
    return host + 'wxApp/' + getCenterId() + '/myOrders'
  }
  //教练详情
  function trainerDetail(id, centerId) {

    if (centerId != null && centerId != 'null') {
      return host + 'wxApp/' + centerId + '/trainer/' + id
    }else{
      return host + 'wxApp/' + getCenterId() + '/trainer/' + id
    }

  }
  //订单详情
  function orderDetailUrl(id) {
    return host + 'wxApp/' + getCenterId() + '/courseOrder/' + id;
  }

  //订单详情中的预约详情
  function reservationInfoUrl(id) {
    return host + 'wxApp/' + getCenterId() + "/reservationInfo/" + id;
  }

  //获取微信支付参数
  function wechatPayUrl(orderId) {
    return host + 'wx/pay/courseOrderForWxApp/' + getCenterId() + '/' + orderId;
  }
  //支付结果查询
  function wechatPayResultUrl(tradeNo) {
    return host + 'wx/pay/' + tradeNo
  }

  //检查预约是否可以支付
  function payAvailableUrl(orderId) {
    return host + "/wx/groupCourse/" + getCenterId() + "/validate/" + orderId;
  }

  //会员中心
  function getCenterInfo() {
    return host + "wxApp/login/" + getCenterId() + "/home"
  }
  //参团详情
  function instanceCollage(id) {
    return host + "wxApp/login/groupInstancesDetail/" + id;
  }
  //获取我的拼团列表
  function myCollage() {
    return host + "wxApp/buy/" + getCenterId() + "/myGroupBook"
  }

  //场馆介绍
  function getCenterIntroduction() {
    return host + "wxApp/" + getCenterId() + "/centerInfo"
  }
  //已购卡详情
  function myCarDetail(id, contractId, type) {
    return host + 'wxApp/' + id + '/cardContract/' + contractId + '?loadPreCardInfo=' + type;
  }


  //积分兑换详情
  function integralOperationRecords(data) {
    return host + "wxApp/myScore/v2/" + getCenterId() + "/" + data.month + '/' + data.scoreTypeId + "/" + data.pageIndex + '/' + data.pageSize;
  }

  //积分总数
  function getpiontnum(data) {
    return host + "wxApp/myScore/" + getCenterId() + "/scoreInfo";
  }

  //步数换积分详情
  function stepConversionIntegral() {
    return host + "wxApp/wxSportScore/" + getCenterId() + "/metadata";
  }
  //提交步数
  function commitSteps() {
    return host + "wxApp/wxSportScore/" + getHeaderCenterId() + "/decryptWxSport"
  }
  //积分兑换
  function exchange(score) {
    return host + "wxApp/wxSportScore/" + getCenterId() + "/exChange/" + score
  }
  //切换绑定手机号
  function changePhone() {
    return host + "wxApp/changePhone"
  }
  //三代更衣柜
  function openLocker(centerId, deviceId, qrType, other) {
    return host + 'wxApp/locker/' + centerId + '/scan/' + deviceId + '/' + qrType + '/' + other
  }
  //场地列表
  function orderSpaceList() {
    return host + 'wxApp/' + getCenterId() + '/getAthleticGroundList'
  }
  //预订详情
  function orderSpaceDetail(groundId, planDate) {
    return host + 'wxApp/' + getCenterId() + '/getAthleticGroundReserveList/' + groundId + '/' + planDate
  }

  //场地预约：我的预订（列表）
  function siteMyreservation() {
    return host + 'wxApp/' + getCenterId() + '/getMyGroundReserveList'
  }
  //场地预约：预订详情
  function siteMyreservationDetail(reserveId) {
    return host + 'wxApp/' + getCenterId() + '/getAthleticGroundOrder/' + reserveId
  }
  //取消场地预订
  function removeSpace(reserveOrderId) {
    return host + 'wxApp/buy/' + getCenterId() + '/cancelGroundReserve/' + reserveOrderId
  }
  //核销场地
  function spaceSign(orderNo) {
    return host + 'wxApp/' + getCenterId() + '/groundReserveQr/' + orderNo
  }
  //去支付
  function buyGround(groundId) {
    return host + 'wxApp/buy/' + getCenterId() + '/createGroundReservePay/' + groundId + '?thirdParty=' + getHeaderCenterId() + '&openId=' + getOpenId();
  }


  //签到记录
  function signRecord() {
    return host + 'wxApp/' + getCenterId() + '/cardLeaveInfo'
  }



  //设置服务密码
  function servicePassword() {
    return host + 'wxApp/' + getCenterId() + '/servicePwd'
  }

  //私教课电子合同签字确认
  function getBuyPrivateProtocol(centerId, preCourseId) {
    return host + 'wxApp/' + centerId + '/preCourseDetail/' + preCourseId
  }
  //私教课上传签名图片
  function uploadPrivateSignImgUrl(centerId, preCourseId) {
    return host + 'wxApp/' + centerId + '/upload/preCourseSignature/' + preCourseId
  }
  //消课记录
  function getCourseConsumeUrl(centerId, depositId) {
    return host + 'wxApp/' + centerId + '/courseConsume/' + depositId
  }
  //我的私教课详情-->使用门店
  function getUsableCenterDetailsUrl(depositId) {
    return host + 'wxApp/usableCenterDetails/' + depositId
  }
  //我的私教课详情-->授课教练
  function getCourseTrainerDetailsUrl(depositId) {
    return host + 'wxApp/courseTrainerDetails/' + depositId
  }
  //请假记录
  function getLeaveRecordUrl() {
    return host + 'wxApp/' + getCenterId() + '/leaveRecord'
  }

  function chooseCardLeaveRecordUrl(contractId) {
    return host + 'wxApp/chooseCardLeaveRecord/' + contractId
  }

  function cardPauseUrl(contractId) {
    return host + 'wxApp/' + getCenterId() + '/cardPause/' + contractId
  }

  //场地预约：购买会员卡列表
  function buyCarListUrl(groundId) {
    return host + 'wxApp/' + getCenterId() + '/getGroundAllCanUseCards/' + groundId
  }

  //网页端电子合同扫码签字
  function getCourseDepositUrl(centerId, depositId) {
    return host + 'wxApp/' + centerId + '/courseDeposit/' + depositId
  }

  //网页端电子合同扫码签字
  function uploadCourseDepositSignImgUrl(centerId, depositId) {
    return host + 'wxApp/' + centerId + '/upload/courseDeposit/' + depositId + '/signature'
  }

  //我的会员卡、私教课查看条款协议
  function lookForAgreement(protocolId) {
    return host + 'wxApp/' + getCenterId() + '/protocol/' + protocolId
  }
  // 消费明细
  function spenddetail(cardContractId, pageNum) {
    return host + 'wxApp/cardMember/' + getCenterId() + '/' + cardContractId + "/opLog/" + pageNum
  }
  //票券列表
  function couponList(type) {
    return host + 'wxApp/getTicketList/' + getCenterId() + '/' + type
    // return host + 'wxApp/getTicketList/' + getCenterId()
  }
  //票券详情
  function couponDetail(id, date, weekDay) {
    return host + 'wxApp/ticketDetailTimes/' + id + '/' + date + '?weekDay=' + weekDay
  }
  //购票支付
  function buyCoupon() {
    return host + 'wxApp/buy/addTicketOrder/' + getCenterId() + '?thirdParty=' + getHeaderCenterId() + '&openId=' + getOpenId();
  }
  //我的票券
  function myCoupon() {
    return host + 'wxApp/myTickets/' + getCenterId();
  }
  //获取门店信息和二维码
  function centerMess(code) {
    return host + 'wxApp/ticketInsDetail/' + code;
  }
  //票券订单详情
  function ticketOrderDetail(id) {
    return host + 'wxApp/ticketOrderDetail/' + id;
  }
  //获取订单详情的二维码
  function ticketOrderQr(code) {
    return host + 'wxApp/getTicketTakeQr/' + code;
  }
  //订单详情中的查看票券
  function sceneList(id) {
    return host + 'wxApp/orderTicketIns/' + id;
  }
  //获取可用的储值卡
  function storeValueCardList() {
    return host + 'wxApp/' + getCenterId() + '/loadUsableValueCards';
  }
  // 活动会员绑定
  function getbind(centerId, empId) {
    return host + 'wxApp/' + centerId + '/scanPosterOwner/' + empId
  }
  // 活动会员绑定
  function getcorseleves() {
    return host + 'wxApp/' + getCenterId() + '/levels'
  }
  // 场地是否开放
  function getloadCenterInfo() {
    return host + 'wxApp/loadCenterInfo/' + getCenterId()
  }
  //获取定金列表
  function getDepositList() {
    return host + 'wxApp/' + getCenterId() + '/depositList'
  }
  //游客进入获取门店
  function nologincenterInfo(centerId) {
    return host + 'wxApp/testToken?centerId=' + centerId
  }
  //小程序获取会员卡销售人列表
  function getsellers(distributorId) {
    console.log(distributorId)
    if (distributorId!=null){
      return host + 'wxApp/buy/' + getCenterId() + '/cardSellers?distributorId=' + distributorId
    }else{
      return host + 'wxApp/buy/' + getCenterId() + '/cardSellers'
    }

  }
  //小程序获取会员卡销售人列表
  function getAllcourse(courseId) {
    return host + 'wxApp/' + getCenterId() + '/groupCourse/' + courseId
  }
  //小程序商品获取商品信息及可用储值卡Api
  function getordergoods(courseId) {
    return host + 'wxApp/buy/' + getCenterId() + '/goodsAndAvailableValueCards'
  }
  //获取小程序配置
  function getwxAppSetting() {
    return host + 'wxApp/' + getCenterId() + '/wxAppSetting'
  }
  //获取培训课列表
  function trainerCourse() {
    return host + 'wxApp/' + getCenterId() + '/trainingCourses'
  }
  //获取培训课详情
  function trainerCourseDetail(id) {
    return host + 'wxApp/' + getCenterId() + '/courseDetail/'+id
  }
  //检查会员是否已有当前课程可用的卡
  function checkTraineeCourseCards(id){
    return host + 'wxApp/' + getCenterId() + '/checkTraineeCourseCards/' + id
  }
  //获取可报名课程并且支持线上销售的会员卡列表
  function checkTraineeUsefulCards(id) {
    return host + 'wxApp/' + getCenterId() + '/cards/' + id
  }
  //获取培训班排课列表
  function trainingClassCourse(date) {
    return host + 'wxApp/login/' + getCenterId() + '/trainingClassCourse/' + date
  }
  //获取拼团列表
  function getAssembleList() {
    return host + 'wxApp/' + getCenterId() + '/bookings'
  }
  //获取课程拼团详情
  function courseBookingDetail(id) {
    return host + 'wxApp/buy/' + getCenterId() + '/groupBookingDetail/' + id + '/v2'
  }

  //课程评价获取课程详情
  function judgeCourseMess(id) {
    return host + 'course/courseReservationDetail/' + id
  }
  //空气质量
  function airPollution() {
    return host + 'fitnessCenter/' + getCenterId() + '/airPollution'
  }

  //在场人数
  function actualNumber() {
    return host + 'fitnessCenter/' + getCenterId() + '/actualNumber'
  }
  // 获取扫码详情
  function getmyQrscanResult() {
    return host + 'wxApp/' + getCenterId() + '/myQr/scanResult'
  }
  // 获取登录服务协议
  function loginwxAppProtocol() {
    var id = getCenterId()
    id = id ? id : getHeaderCenterId()
    return host + 'wxApp/login/' +id + '/wxAppProtocol'
  }
  // 一件授权登录
  function loginbind() {
    let targetCenterId = wx.getStorageSync("targetCenterId")
    if (targetCenterId) {
      return host + 'wxApp/login/' + getHeaderCenterId() + '/verifyByAuthorizedWxPhone?targetCenterId=' + targetCenterId;
    } else {
      return host + 'wxApp/login/' + getHeaderCenterId() + '/verifyByAuthorizedWxPhone'
    }
    return host + 'wxApp/login/' + getHeaderCenterId() + '/verifyByAuthorizedWxPhone';
  }


  //总店下的门店列表
  function branchCenterList() {
    return host + 'wxApp/' + getCenterId() + '/subCenters'
  }
  //总店下门店详情
  function branchCenterDetail(id) {
    return host + 'wxApp/' + id + '/centerDetail'
  }
  //总点下课程强度
  function courseLevel(id) {
    return host + 'wxApp/' + getCenterId() + '/levels/' + id
  }
  //获取消费明细
  function consumeDetail(pageNum) {
    return host + 'wxApp/' + getCenterId() + '/valueCardConsumeDetail/' + pageNum
  }
  //获取社区信息
  function community() {
    return host + 'wxApp/quzhou/cityDistricts'
  }
  //获取个人信息
  function personalMess() {
    return host + 'wxApp/' + getCenterId() + '/userinfo'
  }
  //提交个人信息
  function submitPersonalMess() {
    return host + 'wxApp/' + getCenterId() + '/userinfo'
  }
  //分销
   //分销员判断
  function isDistributor() {
    return host + 'wxApp/distribution/' + getCenterId() + '/checkMember'
  }
  //获取销售记录
  function saleRecord(accountId, pageNum, pageSize) {
    return host + 'wxApp/distribution/' + getCenterId() + '/transaction/' + accountId + '/' + pageNum + '/' + pageSize
  }
  //获取分销员信息
  function distributorMess(accountId, pageNum, pageSize) {
    return host + 'wxApp/distribution/' + getCenterId() + '/me'
  }
  //获取邀请记录
  function inviteRecord(pageNum) {
    return host + 'wxApp/distribution/invitedRecord/' + getCenterId() + '/' + pageNum
  }
  //获取海报列表
  function posterList(typeId) {
    return host + 'wxApp/distribution/' + getCenterId() + '/' + typeId +'/posters'
  }
  //获取海报详情
  function posterDetail(posterId) {
    return host + 'wxApp/distribution/' + getCenterId() + '/' + posterId + '/info'
  }
  //获取海报二维码（邀请人）
  function inviteQrcode(posterId) {
    return host + 'wxApp/distribution/' + getCenterId() + '/' + posterId + '/inviteQr'
  }
  //获取海报二维码（商品）
  function goodsQrcode(posterId) {
    return host + 'wxApp/distribution/' + getCenterId() + '/' + posterId + '/goodsQr'
  }
//扫码进入邀请页面获取海报详情
  function scanPosterDetail() {
    return host + 'wxApp/distribution/invitationInfo'
  }
 //邀请进入邀请页面获取海报详情
  function invitePosterDetail(centerId, posterId, inviterId) {
    return host + 'wxApp/distribution/' + centerId + '/invitationInfo/' + posterId + '/' + inviterId
  }
  //接受分销邀请
  function acceptInvite(centerId, inviterId, inviteByConsultant) {
    return host + 'wxApp/distribution/' + centerId + '/' + inviterId + '/' + inviteByConsultant +'/accept'
  }
 //次卡分享
  function shareCard(contractId) {
    return host + 'wxApp/shareCard/' + getCenterId() + '/' + contractId
  }
  // 取消分享
  function cancelShare(shareId) {
    return host + 'wxApp/shareCard/' + getCenterId() + '/unshare/' + shareId
  }

//获取次卡分享信息
  function shareCardMess(centerId,shareId) {
    return host + 'wxApp/shareCard/' + centerId + '/info/' + shareId
  }
//领取次卡分享
  function receiveCard(centerId, shareId) {
    return host + 'wxApp/shareCard/' + centerId + '/receive/' + shareId
  }
  //评价列表
  function judgeList() {
    return host + 'wx/centerFeedback/' + getCenterId() + '/list'
  }
//  卡券列表
  function newCouponList(type) {
    return host + 'wxApp/coupon/v2/' + getCenterId() + '/' + type +'/receivedCoupons'
  }
  // 获取已领取的优惠券详情
  function newCouponDetail(centerId,id) {
    if (centerId == null || centerId=='null'){
      return host + 'wxApp/coupon/v2/' + getCenterId() + '/receivedCouponDetail/' + id
    }else{
      return host + 'wxApp/coupon/v2/' + centerId + '/receivedCouponDetail/' + id
    }

  }
  // 领券中心可领券列表
  function receivableCouponList() {
    return host + 'wxApp/coupon/v2/' + getCenterId() + '/receivable'
  }
  // 领券中心可领券列表详情
  function receivableCouponDetail(centerId,id) {
    console.log(centerId);
      console.log(id)
    if (centerId == null || centerId == 'null') {
      return host + 'wxApp/coupon/v2/' + getCenterId() + '/couponDetail/' + id
    } else {
      return host + 'wxApp/coupon/v2/' + centerId + '/couponDetail/' + id
    }
  }
  // 领取优惠券
  function receiveCoupon(id) {
    return host + 'wxApp/coupon/v2/' + getCenterId() + '/receive/' + id
  }
  // 获取业务可使用优惠券列表
  function usableCoupon(type) {
    return host + 'wxApp/coupon/v2/' + getCenterId() + '/usableCoupons/' + type
  }
  //获取指定门店下的原账号下的联系人
  function linkers() {
    var openId = wx.getStorageSync('openIdKey')
    return host + 'wxApp/' + getCenterId() + '/linkers'
  }
  //获取指定会员的token
  function getToken(id) {
    return host + 'wxApp/' + getCenterId() + '/getToken/'+id
  }
  //获取指定会员的token
  function getownermsg() {
    return host + 'wxApp/' + getCenterId() + '/owner'
  }

// 超时补款时获得instanceId
  function getInstanceId(id) {
    return host + 'wxApp/' + getCenterId() + '/ticketInstanceIdByOnlineOrderId/' + id
  }
  // 当前门店的邀请好友活动详情Api
  function inviteDetail(centerId, inviterId, activityId) {
    if (inviterId != null) {
      return host + 'wxApp/newMemberInvite/' + centerId + '/currentInvitationInfo?inviterId=' + inviterId + '&activityId=' + activityId
    } else {
      return host + 'wxApp/newMemberInvite/' + centerId + '/currentInvitationInfo'
    }
  }
  // 我的邀请详情Api
  function newMemberInvite(id) {
    return host + 'wxApp/newMemberInvite/' + getCenterId() + '/' + id + '/myInvitationDetail'
  }
  // 领取邀请活动
  function receiveInvite(centerId, activityId, inviterId) {
    return host + 'wxApp/newMemberInvite/' + centerId + '/' + activityId + '/' + inviterId
  }
  // 获取系统发放优惠券
  function systemCoupons() {
    return host + 'wxApp/coupon/v2/' + getCenterId() + '/systemCoupons'
  }

  return {
    systemCoupons,
    receiveInvite,
    newMemberInvite,
    inviteDetail,
    getownermsg,
    getInstanceId,
    getToken,
    linkers,
    usableCoupon,
    receiveCoupon,
    receivableCouponDetail,
    receivableCouponList,
    newCouponDetail,
    newCouponList,
    cancelShare,
    judgeList,
    receiveCard,
    shareCardMess,
    shareCard,
    acceptInvite,
    invitePosterDetail,
    scanPosterDetail,
    goodsQrcode,
    inviteQrcode,
    posterDetail,
    posterList,
    inviteRecord,
    distributorMess,
    saleRecord,
    isDistributor,
    usefulCourseV2,
    usefulClubV2,
    submitPersonalMess,
    personalMess,
    community,
    loginwxAppProtocol,
    loginbind,
    getmyQrscanResult,
    consumeDetail,
    courseLevel,
    branchCenterDetail,
    branchCenterList,
    actualNumber,
    airPollution,
    judgeCourseMess,
    getpiontnum,
    getscoreRule,
    trainingClassCourse,
    checkTraineeUsefulCards,
    checkTraineeCourseCards,
    trainerCourseDetail,
    trainerCourse,
    getwxAppSetting,
    courseBookingDetail,
    getAssembleList,
    getordergoods,
    getAllcourse,
    getsellers,
    nologincenterInfo,
    host: host,
    loginUrl: loginUrl,
    thirdPartyLoginUrl: thirdPartyLoginUrl,
    scanCodeUrl: scanCodeUrl,
    lcPayUrl: lcPayUrl,
    bindPhoneUrl: bindPhoneUrl,
    requestSmsCode: requestSmsCode,
    bindWXPhoneUrl: bindWXPhoneUrl,
    thirdPartyCenterListUrl: thirdPartyCenterListUrl,
    cardListUrl: cardListUrl,
    userQRCodeUrl: userQRCodeUrl,
    groupCourseList: groupCourseList,
    reservePrivateCourseInfo: reservePrivateCourseInfo,
    reservationListUrl: reservationListUrl,
    rateReservation: rateReservation,
    cancelReservation: cancelReservation,
    orderListUrl: orderListUrl,
    orderDetailUrl: orderDetailUrl,
    reservationInfoUrl: reservationInfoUrl,
    wechatPayUrl: wechatPayUrl,
    wechatPayResultUrl: wechatPayResultUrl,
    getGroupCourseDetailUrl: getGroupCourseDetailUrl,
    getGroupCourseAppointmentSeatArrayUrl: getGroupCourseAppointmentSeatArrayUrl,
    payAvailableUrl: payAvailableUrl,
    userAccountUrl: userAccountUrl,
    appointmentConfirmUrl: appointmentConfirmUrl,
    centerListUrl: centerListUrl,
    getCenterInfo: getCenterInfo,
    getTrainerCourse: getTrainerCourse,
    sellCardListUrl: sellCardListUrl,
    sellCourseListUrl: sellCourseListUrl,
    sellCardDetailUrl: sellCardDetailUrl,
    sellCourseDetailUrl: sellCourseDetailUrl,
    getBuyCardUrl: getBuyCardUrl,
    getCalendar: getCalendar,
    getCourseOrderUrl: getCourseOrderUrl,
    getCardOrderUrl: getCardOrderUrl,
    getBuyCourseUrl: getBuyCourseUrl,
    getBuyShopUrl: getBuyShopUrl,
    getTrainerListUrl: getTrainerListUrl,
    checkPayStatusUrl: checkPayStatusUrl,
    uploadImgUrl: uploadImgUrl,
    getShopOrderUrl: getShopOrderUrl,
    getShopOrderListUrl: getShopOrderListUrl,
    privateReserve: privateReserve,
    submitEvaUrl: submitEvaUrl,
    getCenterIntroduction: getCenterIntroduction,
    usefulCourse: usefulCourse,
    orderStatus: orderStatus,
    cancelOrder: cancelOrder,
    usefulClub: usefulClub,
    agreement: agreement,
    courseListUrl: courseListUrl,
    trainerDetail: trainerDetail,
    ticketList: ticketList,
    shareLinkUrl: shareLinkUrl,
    shareDetail: shareDetail,
    receive: receive,
    getActivity: getActivity,
    goReserve: goReserve,
    signUp: signUp,
    getAppInfo: getAppInfo,
    cancelPrivateReservation: cancelPrivateReservation,
    getNoPaySalesUrl: getNoPaySalesUrl,
    activityPay: activityPay,
    otherPay: otherPay,
    ticketDetail: ticketDetail,
    collageDeatail: collageDeatail,
    instanceCollage: instanceCollage,
    myCollage: myCollage,
    integralOperationRecords: integralOperationRecords,
    stepConversionIntegral: stepConversionIntegral,
    commitSteps: commitSteps,
    exchange: exchange,
    changePhone: changePhone,
    preCheckIn: preCheckIn,
    preCardPay: preCardPay,
    checkInStatusUrl: checkInStatusUrl,
    confirmStartPrivateCourse: confirmStartPrivateCourse,
    getStockList: getStockList,
    getBuyCardInfoDetail: getBuyCardInfoDetail,
    myCarDetail: myCarDetail,
    uploadSignImgUrl: uploadSignImgUrl,
    openLocker: openLocker,
    tryCheckOut: tryCheckOut,
    checkOut: checkOut,
    orderSpaceList: orderSpaceList,
    orderSpaceDetail: orderSpaceDetail,
    siteMyreservation: siteMyreservation,
    siteMyreservationDetail: siteMyreservationDetail,
    buyGround: buyGround,
    spaceSign: spaceSign,
    removeSpace: removeSpace,
    signRecord: signRecord,
    servicePassword: servicePassword,
    getBuyPrivateProtocol: getBuyPrivateProtocol,
    uploadPrivateSignImgUrl: uploadPrivateSignImgUrl,
    getCourseConsumeUrl: getCourseConsumeUrl,
    getUsableCenterDetailsUrl: getUsableCenterDetailsUrl,
    getCourseTrainerDetailsUrl: getCourseTrainerDetailsUrl,
    getLeaveRecordUrl: getLeaveRecordUrl,
    chooseCardLeaveRecordUrl: chooseCardLeaveRecordUrl,
    cardPauseUrl: cardPauseUrl,
    buyCarListUrl: buyCarListUrl,
    getCourseDepositUrl: getCourseDepositUrl,
    uploadCourseDepositSignImgUrl: uploadCourseDepositSignImgUrl,
    activityBuyPay: activityBuyPay,
    getBuyCourseProUrl: getBuyCourseProUrl,
    lookForAgreement: lookForAgreement,
    spenddetail: spenddetail,
    couponList: couponList,
    couponDetail: couponDetail,
    buyCoupon: buyCoupon,
    myCoupon: myCoupon,
    centerMess: centerMess,
    ticketOrderDetail: ticketOrderDetail,
    ticketOrderQr: ticketOrderQr,
    sceneList: sceneList,
    storeValueCardList: storeValueCardList,
    getbind,
    getGroupCourseDetail,
    getcorseleves,
    getloadCenterInfo,
    getDepositList: getDepositList,
    officeReservePrivateCourseInfo: officeReservePrivateCourseInfo,
    officePrivateReserve: officePrivateReserve,
    signCourse: signCourse,
    getStudioCalendar: getStudioCalendar,
    getloadCenterInfo,
    getDepositList: getDepositList
  }

})()


module.exports = config;