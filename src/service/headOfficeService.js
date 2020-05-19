var requestUtil = require('../utils/requestUtil.js');
var config = require('../config.js');

//获取总店下的门店
function getBranchCenterList(res) {
  var url = config.branchCenterList();
  return requestUtil.postRequest(url,res)
}

function getBranchCenterDetail(id) {
  var url = config.branchCenterDetail(id);
  return requestUtil.getRequest(url)
}
//获取社区信息
function getCommunity() {
  var url = config.community();
  return requestUtil.getRequest(url)
}
//获取个人信息
function getPersonalMess() {
  var url = config.personalMess();
  return requestUtil.getRequest(url)
}
//提交个人信息
function putPersonalMess(data) {
  var url = config.submitPersonalMess();
  return requestUtil.postRequest(url,data)
}
// 获取优惠券列表
function getCouponList(type) {
  var url = config.newCouponList(type);
  return requestUtil.getRequest(url)
}
// 获取已领取的优惠券详情
function getCouponDetail(centerId,id) {
  var url = config.newCouponDetail(centerId,id);
  return requestUtil.getRequest(url)
}
// 获取领券中心可领券列表
function getReceivableCouponList() {
  var url = config.receivableCouponList();
  return requestUtil.getRequest(url)
}
// 获取领券中心可领券列表详情
function getReceivableCouponDetail(centerId,id) {
  var url = config.receivableCouponDetail(centerId,id);
  return requestUtil.getRequest(url)
}
//领取优惠券
function getCoupon(id) {
  var url = config.receiveCoupon(id);
  return requestUtil.postRequest(url)
}
//获取业务可使用优惠券列表
function getUsableCoupon(type) {
  var url = config.usableCoupon(type);
  return requestUtil.getRequest(url)
}
// 当前门店的邀请好友活动详情Api
function getInviteDetail(centerId, inviterId = null, activityId=null) {
  var url = config.inviteDetail(centerId, inviterId, activityId);
  return requestUtil.getRequest(url)
}
// 当前门店的邀请好友活动详情Api
function getNewMemberInvite(id) {
  var url = config.newMemberInvite(id);
  return requestUtil.getRequest(url)
}
// 领取
function getReceiveInvite(centerId, activityId, inviterId) {
  var url = config.receiveInvite(centerId, activityId, inviterId);
  return requestUtil.postRequest(url)
}
module.exports = {
  getReceiveInvite: getReceiveInvite,
  getNewMemberInvite: getNewMemberInvite,
  getInviteDetail: getInviteDetail,
  getUsableCoupon: getUsableCoupon,
  getCoupon: getCoupon,
  getReceivableCouponDetail: getReceivableCouponDetail,
  getReceivableCouponList: getReceivableCouponList,
  getCouponDetail: getCouponDetail,
  getCouponList: getCouponList,
  putPersonalMess: putPersonalMess,
  getPersonalMess: getPersonalMess,
  getCommunity: getCommunity,
  getBranchCenterList: getBranchCenterList,
  getBranchCenterDetail: getBranchCenterDetail
}