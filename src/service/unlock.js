//index.js
//获取应用实例
var app = getApp();
var scanCode = require('scanCode.js');
var systemMessage = require('../SystemMessage.js');
var filter = require('../utils/authFilter.js');
var notifConstant = require('../utils/notifConstant.js');
var promiseUtil = require('../utils/promiseUtil.js');
var centerService = require('centerService.js');




  // //来自微信扫一扫
function scranQrCodeFromWexin(options, success) {
     if (typeof (options.q) != 'undefined' && app.globalData.token != null){
       let src = decodeURIComponent(options.q);
       getQrcode(src, function (qrCode, centerId) {
         getWXLocation(function (location) {
           scanCode.uploadQRcodeScanResult(centerId, location.latitude, location.longitude, qrCode).then((result) => {
             success(result);
           });
         });
       });
     }
   }






function checkLocationAuthorized(success1, fail) {
     var that = this;
     wx.getSetting({
       success: (res) => {
         if (!res.authSetting['scope.userLocation']) {
           wx.authorize({
             scope: 'scope.userLocation',
             success: (res) => {
               success1(res);
             },
             fail: (res) => {
               fail();
             }
           });
         } else {
           success1();
         }
       },
       fail: (res) => {
         fail();
       }
     })
   }
//扫小程序码进行登录

  // //先获取用户授权
function checkUserLocationAuthorized() {
     checkLocationAuthorized(function (res) {
       console.log("location authorized");
     }, function () {
       console.log("location rejected");
     });
   }

   //获取位置
function getWXLocation(success1) {
     checkLocationAuthorized(function (res) {
       getLocation(success1);
     }, function () {
       wx.showModal({
         content: '获取位置失败,请前往设置',
         confirmText: '设置',
         success: (res) => {
           if (res.confirm) {
             wx.openSetting({
             });
           }
         }
       });
     })
   }

function getLocation(success1) {
     wx.getLocation({
       type: 'gcj02',
       success: function (res) {
         success1(res);
       },
       fail: function (res) {
         //console.log('获取位置失败!' + res.errMsg);
         systemMessage.showModal('', '获取位置失败, 请前往手机设置中检查微信位置权限!');
       }
     });
   }

   // 扫码开锁
function qrCode(success1) {
    getWXLocation(function (location) {
      wx.scanCode({
        success: (res) => {
          getQrcode(res.result, function (qrCode, centerId) {
            console.log(centerId)
            scanCode.uploadQRcodeScanResult(centerId, location.latitude, location.longitude, qrCode).then((res) => {
              success1(res);
            });
          });
        },
        fail: (res) => {
          let errMsg = res.errMsg;
          if (errMsg.includes("cancel")) {
          } else {
            systemMessage.showModal('', '扫码失败，请重试!');
          }
        }
      })
       });
     
   }

function getQrcode(url, success) {
     let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : null;
     //let centerIdStr = "";
     let prefix = "";
     if (extConfig != null && extConfig.miniUrl && extConfig.miniUrl != 1){
      // centerIdStr = extConfig.miniUrl+"/";
       prefix = "https://www.forzadata.cn/miniapp3/" + extConfig.miniUrl + "/";
     }else{
       prefix = "https://www.forzadata.cn/miniapp/";
     }
     
     if (url.indexOf(prefix) == 0) {
       let qrCode = url.replace(prefix, "");
       let centerId = qrCode.split("_")[0];
       success(qrCode, centerId);
     }
     else {
       // 二维码不合法提示
       systemMessage.showModal('', '不是有效二维码');
     }
   }

module.exports =
  {
  qrCode: qrCode,
  checkUserLocationAuthorized: checkUserLocationAuthorized,
  scranQrCodeFromWexin: scranQrCodeFromWexin
  } 
  


