var requestUtil = require('../utils/requestUtil.js');
var config = require('../config.js');


// 首页信息
function getCenterInfo() {
  var url = config.getCenterInfo()
  return requestUtil.getRequest(url,true,false)
}
function getCenterIntroduction() {
  var url = config.getCenterIntroduction()
  return requestUtil.getRequest(url)
}

function pointRequest(data){
  var url = config.integralOperationRecords(data);
  return requestUtil.getRequest(url)
}

function getBuyCardInfoDetail(centerId,contractId){
  var url = config.getBuyCardInfoDetail(centerId, contractId);
  return requestUtil.getRequest(url)
}

function stepExchangeIntegralRequest(){
  var url = config.stepConversionIntegral();
  return requestUtil.getRequest(url)
}
function submitStepRequests(res){
  var url = config.commitSteps();
  return requestUtil.postRequest(url,res)
}
function exchangeRequest(score){
  var url = config.exchange(score);
  return requestUtil.getRequest(url);
}
function preCheckIn(centerId){
  var url = config.preCheckIn(centerId);
  return requestUtil.getRequest(url);
}
function confirmStartPrivateCourse(centerId,code){
  var url = config.confirmStartPrivateCourse(centerId,code);
  return requestUtil.getRequest(url);
}

function signCourse(centerId, code) {
  var url = config.signCourse(centerId, code);
  return requestUtil.getRequest(url);
}

function checkInStatus(centerId,checkInId){
  var url = config.checkInStatusUrl(centerId, checkInId);
  return requestUtil.getRequest(url);
}
//签出
function tryCheckOut(centerId, deviceId){
  var url = config.tryCheckOut(centerId, deviceId);
  return requestUtil.getRequest(url);
}
function checkOut(centerId, deviceId){
  var url = config.checkOut(centerId, deviceId);
  return requestUtil.getRequest(url);
}
//三代更衣柜
function getLocker(centerId,deviceId, qrType, other) {
  var url = config.openLocker(centerId,deviceId, qrType, other);
  return requestUtil.getRequest(url);
}
//场地列表
function getOrderSpaceList() {
  var url = config.orderSpaceList();
  return requestUtil.getRequest(url);
}
//场地详情
function getOrderSpaceDetail(groundId, planDate) {
  var url = config.orderSpaceDetail(groundId, planDate);
  return requestUtil.getRequest(url);
}

//场地预订：我的预订（列表）
function getSiteMyreservation(){
  var url = config.siteMyreservation();
  return requestUtil.getRequest(url);
}
//场地预订: 预订详情
function getSiteMyreservationDetail(id) {
  var url = config.siteMyreservationDetail(id);
  return requestUtil.getRequest(url);
}
 //场地核销
function getSignQr(orderNo){
   var url = config.spaceSign(orderNo);
   return requestUtil.getRequest(url);
 }
//取消预订
function submitRemoveSpace(id) {
  var url = config.removeSpace(id);
  return requestUtil.getRequest(url);
}

//购买场地
function goBuyGround(groundId, data) {
  wx.showLoading({
    title: '支付中',
    mask: true
  })

  var url = config.buyGround(groundId);
  return requestUtil.postRequest(url,data, false, false);
}
//获取签到记录
function getSignRecord(){
  var url = config.signRecord();
  return requestUtil.getRequest(url);
}

//设置服务密码
function putServicePassword(res){
  var url = config.servicePassword();
  return requestUtil.putRequest(url, res);
}

//私教课电子合同签字确认
function getBuyPrivateProtocolInfo(centerId, preCourseId) {
  var url = config.getBuyPrivateProtocol(centerId, preCourseId);
  return requestUtil.getRequest(url)
}

//消课记录
function getCourseConsume(centerId, depositId){
  var url = config.getCourseConsumeUrl(centerId, depositId);
  return requestUtil.getRequest(url)
}

//我的私教课详情-->使用门店
function getUsableCenterDetails(depositId){
  var url = config.getUsableCenterDetailsUrl(depositId);
  return requestUtil.getRequest(url)
}

//我的私教课详情-->授课教练
function getCourseTrainerDetails(depositId){
  var url = config.getCourseTrainerDetailsUrl(depositId)
  return requestUtil.getRequest(url)
}

//请假记录
function getLeaveRecord(){
  var url = config.getLeaveRecordUrl()
  return requestUtil.getRequest(url)
}

function chooseCardLeaveRecord(contractId) {
  var url = config.chooseCardLeaveRecordUrl(contractId)
  return requestUtil.getRequest(url)
}

function cardPause(contractId, data) {
  var url = config.cardPauseUrl(contractId)
  return requestUtil.postRequest(url, data, false, false);
}

//场地预约：购买会员卡列表
function buyCarList(groundId){
  var url = config.buyCarListUrl(groundId)
  return requestUtil.getRequest(url)
}

//网页端电子合同扫码签字
function getCourseDepositProtocolInfo(centerId, depositId){
  var url = config.getCourseDepositUrl(centerId, depositId)
  return requestUtil.getRequest(url)
}
//获取票券列表
function getCouponList(type) {
  var url = config.couponList(type)
  return requestUtil.getRequest(url)
}
//获取票券详情
function getCouponDetail(id, date, weekDay) {
  var url = config.couponDetail(id, date, weekDay)
  return requestUtil.getRequest(url)
}
//购买票券
function buyCoupon(data) {
  wx.showLoading({
    title: '支付中',
    mask: true
  })
  var url = config.buyCoupon();
  return requestUtil.postRequest(url, data, false, false);
}
//获取我的票券
function getMyCoupon() {
  var url = config.myCoupon()
  return requestUtil.getRequest(url)
}
//获取门店信息二维码
function getCenterMess(code) {
  var url = config.centerMess(code)
  return requestUtil.getRequest(url)
}
//获取票券订单详情
function getTicketOrderDetail(id) {
  var url = config.ticketOrderDetail(id)
  return requestUtil.getRequest(url)
}
//获取订单详情二维码
function getTicketOrderQr(code) {
  var url = config.ticketOrderQr(code)
  return requestUtil.getRequest(url)
}
//获取订单详情中的票券列表
function getSceneList(id) {
  var url = config.sceneList(id)
  return requestUtil.getRequest(url)
}
//获取储值卡
function getStoreValueCardList() {
  var url = config.storeValueCardList()
  return requestUtil.getRequest(url)
}
//获取定金列表
function getDeposit() {
  var url = config.getDepositList()
  return requestUtil.getRequest(url)
}
//获取培训课列表
function getTrainerCourseList() {
  var url = config.trainerCourse()
  return requestUtil.getRequest(url)
}
//获取培训课详情
function getTrainerCourseDetail(id) {
  var url = config.trainerCourseDetail(id)
  return requestUtil.getRequest(url)
}
//检查会员是否已有当前课程可用的卡
function getCheckTraineeCourseCards(id) {
  var url = config.checkTraineeCourseCards(id)
  return requestUtil.getRequest(url)
}
//可报名课程并且支持线上销售的会员卡列表
function getCheckTraineeUsefulCards(id) {
  var url = config.checkTraineeUsefulCards(id)
  return requestUtil.getRequest(url)
}
//获取培训班排班列表
function getTrainingClassCourse(date) {
  var url = config.trainingClassCourse(date)
  return requestUtil.getRequest(url)
}
//获取拼团列表
function getBookingList() {
  var url = config.getAssembleList()
  return requestUtil.getRequest(url)
}
//获取拼团课程详情
function getCourseBookingDetail(id) {
  var url = config.courseBookingDetail(id)
  return requestUtil.getRequest(url)
}
//获取评价课程详情
function getJudgeCourseMess(id) {
  var url = config.judgeCourseMess(id)
  return requestUtil.getRequest(url)
}
//是否为分销员
function getIsDistributor() {
  var url = config.isDistributor()
  return requestUtil.getRequest(url)
}
//获取销售列表
function getSaleRecord(accountId, pageNum, pageSize,data) {
  var url = config.saleRecord(accountId, pageNum, pageSize);
  return requestUtil.postRequest(url, data)
}
//获取分销人信息
function getDistributorMess() {
  var url = config.distributorMess();
  return requestUtil.getRequest(url)
}
//获取邀请记录
function getInviteRecord(pageNum) {
  var url = config.inviteRecord(pageNum);
  return requestUtil.postRequest(url)
}
//获取海报列表
function getPosterList(typeId) {
  var url = config.posterList(typeId);
  return requestUtil.getRequest(url)
}
//获取海报详情

function getPosterDetail(posterId) {
  var url = config.posterDetail(posterId);
  return requestUtil.getRequest(url)
}
//分销人二维码
function getInviteQrcode(posterId) {
  var url = config.inviteQrcode(posterId);
  return requestUtil.getRequest(url)
}
//分销商品二维码
function getGoodsQrcode(posterId) {
  var url = config.goodsQrcode(posterId);
  return requestUtil.getRequest(url)
}
//获取扫码进入的海报详情
function getScanPosterDetail(data) {
  var url = config.scanPosterDetail();
  return requestUtil.postRequest(url,data)
}
//获取邀请进入的海报详情
function getInvitePosterDetail(centerId, posterId, inviterId) {
  var url = config.invitePosterDetail(centerId, posterId, inviterId);
  return requestUtil.getRequest(url)
}
//接受邀请
function getAcceptInvite(centerId, inviterId, inviteByConsultant,data) {
  var url = config.acceptInvite(centerId, inviterId, inviteByConsultant);
  return requestUtil.postRequest(url, data)
}
//获取系统发放优惠券
function getSystemCoupons() {
  var url = config.systemCoupons();
  return requestUtil.getRequest(url)
}

module.exports = {
  getSystemCoupons: getSystemCoupons,
  getAcceptInvite: getAcceptInvite,
  getInvitePosterDetail: getInvitePosterDetail,
  getScanPosterDetail: getScanPosterDetail,
  getGoodsQrcode: getGoodsQrcode,
  getInviteQrcode: getInviteQrcode,
  getPosterDetail: getPosterDetail,
  getPosterList: getPosterList,
  getInviteRecord: getInviteRecord,
  getDistributorMess: getDistributorMess,
  getSaleRecord: getSaleRecord,
  getIsDistributor: getIsDistributor,
  getTrainingClassCourse,
  getCheckTraineeUsefulCards,
  getCheckTraineeCourseCards,
  getTrainerCourseDetail,
  getTrainerCourseList,
  getCenterInfo:getCenterInfo,
  getCenterIntroduction: getCenterIntroduction,
  pointRequest: pointRequest,
  stepExchangeIntegralRequest: stepExchangeIntegralRequest,
  submitStepRequests: submitStepRequests,
  exchangeRequest: exchangeRequest,
  preCheckIn: preCheckIn,
  confirmStartPrivateCourse: confirmStartPrivateCourse,
  checkInStatus: checkInStatus,
  getBuyCardInfoDetail: getBuyCardInfoDetail,
  getLocker: getLocker,
  tryCheckOut: tryCheckOut,
  checkOut: checkOut,
  getOrderSpaceList: getOrderSpaceList,
  getOrderSpaceDetail: getOrderSpaceDetail,
  getSiteMyreservation: getSiteMyreservation,
  goBuyGround: goBuyGround,
  getSiteMyreservationDetail: getSiteMyreservationDetail,
  getSignQr: getSignQr,
  submitRemoveSpace: submitRemoveSpace,
  getSignRecord: getSignRecord,
  putServicePassword: putServicePassword,
  getBuyPrivateProtocolInfo: getBuyPrivateProtocolInfo,
  getCourseConsume: getCourseConsume,
  getUsableCenterDetails: getUsableCenterDetails,
  getCourseTrainerDetails: getCourseTrainerDetails,
  getLeaveRecord: getLeaveRecord,
  chooseCardLeaveRecord: chooseCardLeaveRecord,
  cardPause: cardPause,
  buyCarList: buyCarList, 
  getCourseDepositProtocolInfo: getCourseDepositProtocolInfo,
  getCouponList: getCouponList,
  getCouponDetail: getCouponDetail,
  buyCoupon: buyCoupon,
  getMyCoupon: getMyCoupon,
  getCenterMess: getCenterMess,
  getTicketOrderDetail: getTicketOrderDetail,
  getTicketOrderQr: getTicketOrderQr,
  getSceneList: getSceneList,
  getStoreValueCardList: getStoreValueCardList,
  getDeposit: getDeposit,
  signCourse: signCourse,
  getBookingList,
  getCourseBookingDetail,
  getJudgeCourseMess
}