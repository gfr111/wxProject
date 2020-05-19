// QRCode.js
var app = getApp();
var userQRCode = require('../../../../service/UserQRCode.js');
var systemMessage = require('../../../../SystemMessage.js');
var authenticationUtil = require('../../../../utils/authenticationUtil.js');
var P = require('../../../../lib/wxpage.js');
var requestUtil = require('../../../../utils/requestUtil.js');
var config = require('../../../../config.js');
var MQTT = require("../../resources/paho-mqtt.js");

P("index/QRCode", {
  /**
   * 页面的初始数据
   */
  data: {
    qrCode: "",
    photo: "",
    name: '',
    club: "",
    phone: "",
    show: null,
    isLogin: false,
    isrefresh: true,
    status: 1,
    cardmsg: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(app.globalData.account)
    if (app.globalData.account) {
      var url = app.globalData.account.photo
      if (url) {
        if (url.indexOf("http") >= 0) {} else {
          url = "/images/defaultAvatar.png";
        }
      } else {
        url = "/images/defaultAvatar.png";
      }
      this.setData({
        photo: url,
        name: app.globalData.account.name,
        phone: app.globalData.account.phone,
        club: app.globalData.selectCenter.name
      })
    }

    var that = this
    wx.getScreenBrightness({
      success: function(res) {
        that.data.show = res.value
      }
    })
    if (app.globalData.token == null) {
      this.data.isLogin = true
      app.globalData.receive = true
      authenticationUtil.checkAuthToken();
    } else {
      this.reqQRCode(res => {
        if (app.globalData.mqtt_client && app.globalData.mqtt_client.isConnected()) {
          app.globalData.mqtt_client.onMessageArrived = (msg) => {
            console.log('消息来了')
            that.getmyQrscanResult()
          }
          this.subscribe();
        } else {
          this.connect()
        }
      });
    }
    let timer = setInterval(res => {
      this.reqQRCode()
    }, 600000)
    this.setData({
      timer: timer
    })
    setTimeout(res => {
      this.setData({
        isrefresh: false
      })
    }, 3000)

  },

  renovate() {
    this.reqQRCode(res => {
      clearInterval(this.data.timer)
      let timer = setInterval(res => {
        this.reqQRCode()
      }, 60000)
      this.setData({
        qrCode: res.qr,
        isrefresh: true,
        timer: timer
      })
      setTimeout(res => {
        this.setData({
          isrefresh: false
        })
      }, 3000)
    })
  },
  reqQRCode(callback) {
    userQRCode.getUserQRCode().then((res) => {
      console.log(res)
      this.setData({
        qrCode: res.qr,
        mqttServer: res.mqttServer
      })
      if (callback) {
        callback(res)
      }
    })
  },


  // 连接
  connect() {
    var client = new MQTT.Client("wss://" + this.data.mqttServer.host + "/mqtt", "wx" + app.globalData.account.id + '_' + Math.random().toString(12).substr(10));
    var that = this;
    //connect to  MQTT broker
    var connectOptions = {
      timeout: 60,
      useSSL: true,
      cleanSession: true,
      keepAliveInterval: 60,
      reconnect: true,
      onSuccess: () => {
        app.globalData.mqtt_client = client;
        this.subscribe()
        client.onMessageArrived = (msg) => {
          console.log('消息来了')
          console.log(msg)
          this.getmyQrscanResult()
        }
        client.onConnectionLost = function(responseObject) {
          if (typeof app.globalData.onConnectionLost === 'function') {
            return app.globalData.onConnectionLost(responseObject);
          }
          if (responseObject.errorCode !== 0) {
            console.log("onConnectionLost:" + responseObject.errorMessage);
          }
        }
      },
      onFailure: function(option) {
        console.log(option);
      }
    };
    connectOptions.userName = this.data.mqttServer.userName;
    connectOptions.password = this.data.mqttServer.password;
    client.connect(connectOptions);

  },


  // 订阅
  subscribe() {
    if (app.globalData.mqtt_client && app.globalData.mqtt_client.isConnected()) {
      app.globalData.mqtt_client.subscribe('center/wxcheckin/' + app.globalData.account.id, {
        qos: 1,
        onSuccess: () => {
          console.log("dingyue")
          // wx.showToast({
          //   title: 'success',
          // });
        },
        onFailure: (err) => {},
      });
    }
  },


  getmyQrscanResult() {
    var url = config.getmyQrscanResult()
    requestUtil.getRequest(url).then(res => {
      console.log(res)
      var img = res.cardType == 5 ? 'StoredvalueCard' : res.cardType == 4 || res.cardType == 7 ? 'subCard' : 'timeLimitCard'
      res.cardBg = res.cardBg ? res.cardBg : "../../images/" + img + ".jpg"
      res.remainAmount = res.cardType == 5 ? res.remainAmount.toFixed(2) : res.remainAmount != 0 ? parseInt(res.remainAmount) : res.remainAmount
      var p = res.cardType == 5 ? '元' : res.cardType == 4 ? '次' : '天'
      res.text = res.remainAmount + '' + p
      this.setData({
        cardmsg: res,
        status: 2
      })
    })
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.setScreenBrightness({
      value: 0.8
    })

    if (app.globalData.token != null && this.data.isLogin) {
      this.reqQRCode();
      this.data.isLogin = false
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    var that = this
    wx.setScreenBrightness({
      value: that.data.show
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    var that = this
    wx.setScreenBrightness({
      value: that.data.show
    })
    this.$take('qrcode');
    clearInterval(this.data.timer)
    if (app.globalData.mqtt_client && app.globalData.mqtt_client.isConnected()) {
      app.globalData.mqtt_client.unsubscribe('center/wxcheckin/' + app.globalData.account.id, {})
    }
  },



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      path: "/pages/index/index"
    }
  }
})