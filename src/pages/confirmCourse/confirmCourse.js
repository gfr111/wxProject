// pages/confirmCourse/confirmCourse.js
var systemMessage = require('../../SystemMessage.js');
var app = getApp();
var promiseUtil = require('../../utils/promiseUtil.js');
var centerService = require('../../service/centerService.js');
var storageUtil = require('../../utils/storageUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
     info:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (typeof (options.q) != 'undefined') {

      this.data.optionsq = options

      this.scranQrCode(options)
    }

    //notificationCenter.addNotification(notifConstant.refreshMainPageNotif, this.updateData, this);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log(app.globalData)
    if (app.globalData.isAppOnShow || this.data.optionsq!=null) {
      var that = this
      app.globalData.isAppOnShow = false;
        that.scranQrCode(that.data.optionsq);
    }
    var wxGetExtConfig = promiseUtil.wxPromisify(wx.getExtConfig);
    wxGetExtConfig().then((res) => {
      if (JSON.stringify(res.extConfig) != '{}') {
        wx.setNavigationBarTitle({
          title: res.extConfig.centerName
        });
      }
    })
  },

  scranQrCode: function(options){
    var that = this
    //console.log(JSON.stringify(options))
    if (options!=null&& typeof (options.q) != 'undefined') {
      console.log('-----')
      let src = decodeURIComponent(options.q);
      // 判断是不是第三方
      let extConfig = wx.getExtConfigSync ? wx.getExtConfigSync() : null;
      //let centerIdStr = "";
      let prefix = "";
      if (extConfig != null && extConfig.miniUrl && extConfig.miniUrl != 1) {
        prefix = "https://www.forzadata.cn/wxapp3/confirmcourse/" + extConfig.miniUrl + "/";
      } else {
        prefix = "https://www.forzadata.cn/wxapp/confirmcourse/";
      }
      if (src.indexOf(prefix) == 0) {
        let qrCode = src.replace(prefix, "");
        let centerId = qrCode.split("/r/O/")[0];
        let number = qrCode.split("/r/O/")[1];
        // success(qrCode, centerId);
        //systemMessage.showModal('', centerId+"-"+number);
        let info = {
          id: centerId
        }
        app.globalData.selectCenter = info;
        storageUtil.saveSelectCenter(info);

        if (app.globalData.token == null) {
          app.globalData.receive = true
        }

        app.checkAuthToken(function () {
          centerService.confirmStartPrivateCourse(centerId, number).then(res => {
               that.setData({
                 info:res
               })
            app.globalData.selectCenter = res.center;
            storageUtil.saveSelectCenter(res.center);
          })
        })



        // app.globalData.selectCenter = res;
        // that.setData({
        //   selectCenter: res
        // });

      }
      else {
        // 二维码不合法提示
        systemMessage.showModal('', '不是有效二维码');
      }
      that.data.optionsq = null
    }
  },
  tomine(){
    wx.switchTab({
      url: '/pages/mine/mine',
    })
  }
})