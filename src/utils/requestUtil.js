
// var authenticationUtil =require('authenticationUtil.js');

var requestUtil = (function () {
  function putRequest(url, param) {
    // console.log(url)
    // console.log(param)
    return basicRequest('PUT', url, param)
  }

  function getRequest(url, showErrorModal = true, hideLoad = true) {
    return basicRequest('GET', url, null, showErrorModal, hideLoad)
  }

  function postRequest(url, param, hideInfo = true) {
    return basicRequest('POST', url, param, true, hideInfo)
  }

  function basicRequest(method, url, param = null, showErrorModal = true, hideInfo = true) {
    var token = getApp().globalData.token;
    var header = {
      'content-type': 'application/json',
    };
    if (token) {
      header.WXAPPCHATID = token
    } else if (wx.getStorageSync("tokenKey")){
      header.WXAPPCHATID = wx.getStorageSync("tokenKey")
    }else{
      var testToken = getApp().globalData.testToken;
      if (testToken) {
      header.WXAPPCHATID = testToken
      }
    }

    return new Promise(function (resolve, reject) {
      wx.request({
        url: url,
        data: param ? param : {},
        header: header,
        method: method,
        success: function (res) {
          // console.log(res)
          wx.stopPullDownRefresh()
          // if (hideInfo){

          //   
          // }
          wx.hideLoading();
          if (res.data.status == 0) {
            resolve(res.data.data);
          }
          else if (res.data.status == 2) {
            resolve(res.data.openId);
          }
          else {
            //处理更衣柜
            if (res.data.failCode){
              resolve(res.data);
            }else{
              reject(res.data.message);
              if (showErrorModal && res.data.message) {
                wx.showModal({
                  content: res.data.message,
                  showCancel: false
                });
              }
              wx.hideLoading();
            }
          }
        },
        fail: function (res) {
          console.log(res)
          reject(res);
          if (res.errMsg.indexOf('interrupted')>0 || res.errMsg.indexOf('timeout')>0){
            wx.showModal({
              title: "网络异常，请稍后再试",
              content: "网络异常，请稍后再试",
            })
          }else{
            wx.showModal({
              title: JSON.stringify(res),
              content: url + "请求地址" + JSON.stringify(param) + "请求头" + JSON.stringify(header) + method,
            })
          }
    
  
        },complete:err=>{
          // console.log(err)
        }
      })
    })
  }

  return {
    getRequest: getRequest,
    postRequest: postRequest,
    putRequest: putRequest
  }

})()


module.exports = requestUtil;