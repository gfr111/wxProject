var requestUtil = require('../utils/requestUtil.js');
var config = require('../config.js');

function userLogin(code) {
  // var url = config.thirdPartyLoginUrl(code)
  var url = config.loginUrl(code)
  return requestUtil.getRequest(url)
}

function getUserAccount() {
  var url = config.userAccountUrl()
  return requestUtil.getRequest(url)
}


function getCenterList() {
  var url = config.centerListUrl()
  return requestUtil.getRequest(url)
}

function getUserCardList() {
  var url = config.cardListUrl()
  return requestUtil.getRequest(url)
}

function getUserCourseList() {
  var url = config.courseListUrl()
  return requestUtil.getRequest(url)
}

function bindPhone(phone, code, openId, sex, name,photo) {
  var url = config.bindPhoneUrl()
  var data =
    {
      phone: phone,
      code: code,
      openId: openId,
      sex: sex,
      name: name,
      photo:photo
    }
  return requestUtil.postRequest(url, data)
}

function requestSmsCode(phone,changePhone=false) {
  var url = config.requestSmsCode(changePhone)
  var data = 
  {
    phone: phone
  }
  return requestUtil.postRequest(url, data)
}
function changePhone(phone,code) {
  var url = config.changePhone()
  var data = 
  {
    phone: phone,
    code,code
  }
  return requestUtil.postRequest(url, data)
}

function bindWXPhone(openId, sex, name, encryptedData, iv,photo) {
  console.log(photo)
  var url = config.bindWXPhoneUrl()
  var data =
    {
      openId: openId,
      sex: sex,
      name: name,
      encryptedData: encryptedData,
      iv: iv,
      photo:photo
    }
  return requestUtil.postRequest(url, data)
}

module.exports = {
  bindPhone:bindPhone,
  getCenterList: getCenterList,
  getUserCardList: getUserCardList,
  userLogin: userLogin,
  requestSmsCode: requestSmsCode,
  bindWXPhone: bindWXPhone,
  getUserAccount:getUserAccount,
  changePhone: changePhone,
  getUserCourseList: getUserCourseList

}