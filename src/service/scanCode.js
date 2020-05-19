var requestUtil = require('../utils/requestUtil.js');
var config = require('../config.js');
// function uploadQRcodeScanResult(location, qrcodeStr, callBack) {
//    var url = config.scanCodeUrl("1")
//    var data = {
//      'latitude': location.latitude,
//      'longitude': location.longitude,
//      'code': qrcodeStr
//    }
//    requestUtil.postRequest(url, data, callBack)
// }



function uploadQRcodeScanResult(centerId, latitude, longitude, qrcodeStr) {
  console.log(centerId)
  var url = config.scanCodeUrl(centerId);
  console.log(latitude);
  console.log(longitude);
  console.log('url : ' + url)
  var data = {
    'latitude': latitude,
    'longitude': longitude,
    'code': qrcodeStr
  }
  return requestUtil.postRequest(url, data, false)
}




module.exports = 
{
  uploadQRcodeScanResult: uploadQRcodeScanResult
}