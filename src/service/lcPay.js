var requestUtil = require('../utils/requestUtil.js');
var config = require('../config.js');
function getLcPayParam(openId) {
  var url = config.lcPayUrl(openId);
  //console.log(centerId);
  console.log(openId);
  console.log('url : ' + url);
  
  return requestUtil.getRequest(url);
}

/* 
 lcPay.getLcPayParam(app.globalData.openId).then((res) => {
        //console.log("info==" + JSON.stringify(res));
        //console.log("info==" + res.timeStampStr);


          wx.requestPayment({
            timeStamp: String(res.timestampStr),
            nonceStr: res.nonceStr,
            package: res.packageStr,
            signType: res.signType,
            paySign: res.signKey,
            success: function (res) {
              wx.hideLoading();
              wx.showModal({
                title: '支付成功',
                showCancel: false
              })


            },
            fail: function (res) {
              wx.hideLoading();
              wx.showModal({
                title: '支付失败' + JSON.stringify(res),
                showCancel: false
              })
            }
          })

      }).catch((err) => {
        console.log("ssss==" + err);
      }); */

module.exports =
  {
  getLcPayParam: getLcPayParam
  }

