var requestUtil = require('../utils/requestUtil.js');
var config = require('../config.js');

function getUserQRCode() {
  var url = config.userQRCodeUrl()
  return requestUtil.getRequest(url)
}

module.exports = {
  getUserQRCode: getUserQRCode
}