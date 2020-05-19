// pages/private-sign/private-sign.js


var config = require('../../config.js');
var buyCardService = require("../../service/buyCardService.js");
var centerService = require('../../service/centerService.js');
var storageUtil = require('../../utils/storageUtil.js');
var promiseUtil = require('../../utils/promiseUtil.js');
var systemMessage = require('../../SystemMessage.js');
var app = getApp();
var context = null;
var isButtonDown = false;
var arrx = [];
var arry = [];
var arrz = [];
var canvasw = 0;
var canvash = 0;
var requestUtil = require('../../utils/requestUtil.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showSignBox: false,
    id: 1,
    centerId: null,
    signImg: null,
    preMess: null,
    isShowSign: false,
    noPic: false,
    scene: null,
    isShow: false,
    signersError: false,//是否是本人
    depositId: null,//签字参数
    isCanvas: false,
    canvasWidth:260,
    canvasHeight:600,
    rpx:'',
    isAgreement:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('私教课')
    var that=this;
    that.data.scene = options.scene;
    wx.getSystemInfo({
      success(res) {
        that.setData({
          rpx: res.windowWidth / 375
        })
      },
    })
  },
  agreement(){
    this.setData({
      isAgreement: !this.data.isAgreement
    })
  },
  lookForAgreement(){
    wx.createSelectorQuery().select('#j_page').boundingClientRect(function (rect) {
      // 使页面滚动到底部
      wx.pageScrollTo({
        scrollTop: rect.height,
        success: res => {
          console.log(res)
        },
        fail: err => {
          console.log(err)
        }
      })
    }).exec()
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },
  // onResize: function (res) {
  //   console.log('屏幕方向旋转', res)
  //    "pageOrientation": "auto"
  // },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this
    if (that.data.scene != null) {
      this.data.centerId = this.data.scene.split("_")[0]
      this.data.depositId = this.data.scene.split("_")[1]
    }
    if (app.globalData.isAppOnShow) {
      app.globalData.isAppOnShow = false;
      if (that.data.scene != null) {
        let info = {
          id: this.data.centerId
        }
        app.globalData.selectCenter = info;
        storageUtil.saveSelectCenter(info);
      }

      if (!app.globalData.token && that.data.scene != null) {
        var wxGetExtConfig = promiseUtil.wxPromisify(wx.getExtConfig);
        wxGetExtConfig().then((res) => {
          if (JSON.stringify(res.extConfig) != '{}') {
            wx.setNavigationBarTitle({
              title: res.extConfig.centerName
            });
          }
        })
      }
    } else {
      if (that.data.scene != null) {
        let info = {
          id: this.data.centerId
        }
        app.globalData.selectCenter = info;
        storageUtil.saveSelectCenter(info);

        var wxGetExtConfig = promiseUtil.wxPromisify(wx.getExtConfig);
        wxGetExtConfig().then((res) => {
          if (JSON.stringify(res.extConfig) != '{}') {
            wx.setNavigationBarTitle({
              title: res.extConfig.centerName
            });
          }
        })
      }
    }
    if (app.globalData.token == null) {
      app.globalData.receive = true
    }

    app.checkAuthToken(function () {

      // 使用 wx.createContext 获取绘图上下文 context
      context = wx.createCanvasContext('canvas');
      context.beginPath()
      context.setStrokeStyle('#000000');
      context.setLineWidth(4);
      context.setLineCap('round');
      context.setLineJoin('round');
      // context.drawImage('../../images/img111.png', 0, 0, canvasw, 500);
      context.draw();
      console.log('---参数---', that.data.centerId, that.data.depositId)
      centerService.getCourseDepositProtocolInfo(that.data.centerId, that.data.depositId).then(res => {
        console.log('---请求结果---', res)
        if (res.signersError == true) {
          that.setData({ signersError: res.signersError })
        }
        that.setData({
          preMess: res
        })

        if (res.prePrivateCourse.signaturePhoto) {
          that.setData({
            signImg: res.prePrivateCourse.signaturePhoto,
            showSignBox: false,
            isShowSign: true,
            isShow: true,
            noPic: true,
          })
        }

        if (that.data.scene != null) {
          app.globalData.selectCenter = res.center;
          console.log('--000--' + app.globalData.selectCenter)
          // console.log('--000' + app.globalData.selectCenter.name)
          storageUtil.saveSelectCenter(res.center);
          that.data.scene == null
        }

      });
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },




  /*******页面点击事件******/

  //开始
  canvasStart: function (event) {
    isButtonDown = true;
    arrz.push(0);
    arrx.push(event.changedTouches[0].x);
    arry.push(event.changedTouches[0].y);
  },
  //过程
  canvasMove: function (event) {
    var that = this
    if (isButtonDown) {
      arrz.push(1);
      arrx.push(event.changedTouches[0].x);
      arry.push(event.changedTouches[0].y);
    };
    for (var i = 0; i < arrx.length; i++) {
      if (arrz[i] == 0) {
        context.moveTo(arrx[i], arry[i])
      } else {
        context.lineTo(arrx[i], arry[i])
      };
    };
    context.clearRect(0, 0, canvasw, canvash);
    // context.setFillStyle('red')
    // context.fillRect(0, 0, 300, 180)
    context.setStrokeStyle('#000000');
    context.setLineWidth(4);
    context.setLineCap('round');
    context.setLineJoin('round');
    context.stroke();
    context.draw(false);
    this.setData({
      isCanvas: true
    })
  },
  imgRotate(path) {
    var that=this;
    var canvas = wx.createContext('canvas2');
    // that.setData({
    //   canvasWidth:300,
    //   canvasHeight:180
    // });
    var rpx = that.data.rpx;
    canvas.translate(10 * rpx, 165 * rpx);
    canvas.rotate(-90 * Math.PI / 180);
    canvas.drawImage(path, 0, 0, 150*rpx, 250*rpx);
    wx.drawCanvas({
      canvasId: 'canvas2',
      actions: canvas.getActions()
    })
    // canvas.scale(2, 2);
  },
  // 点击保存图片
  clickMe: function () {
    if (this.data.isCanvas == false) {
      wx.showToast({
        title: '签字不能为空!',
        icon: 'none'
      })
      return
    }
    var that = this;
    var header = {
      'WXAPPCHATID': getApp().globalData.token,
      'content-type': 'application/json;charset=UTF-8'
    };

    wx.canvasToTempFilePath({
      canvasId: 'canvas',
      success: function (res) {
        console.log('--图片--', res)
        that.imgRotate(res.tempFilePath);
        setTimeout(function(){
          wx.canvasToTempFilePath({
            canvasId: 'canvas2',
            success: function (resp) {
              console.log('--图片--', resp)
              //存入服务器
              wx.uploadFile({
                url: config.uploadCourseDepositSignImgUrl(that.data.centerId, that.data.depositId),
                filePath: resp.tempFilePath,
                name: 'file',
                header: header,
                success: function (res) {
                  console.log('---上传结果---', res)
                  if (JSON.parse(res.data).status == 1) {
                    that.setData({
                      showSignBox: false,
                    })
                    wx.showToast({
                      title: JSON.parse(res.data).message,
                      icon: 'none'
                    })              
                  } else {
                    console.log('---结果---', JSON.parse(res.data).data)
                    that.setData({
                      signImg: JSON.parse(res.data).data,
                      showSignBox: false,
                      isShowSign: true,
                      isShow: true,
                      noPic: true,
                    })
                    console.log('--图--' + that.data.signImg)
                  }
                },
                fail: function (res) {
                  wx.showToast({
                    title: '上传签名失败！',
                    icon: 'none'
                  })
                },
                complete: function (res) {
                }
              });
            }
          })
        },50)
      }
    })
  },


  canvasEnd: function (event) {
    isButtonDown = false;
  },
  cleardraw: function () {
    this.setData({
      isCanvas: false
    })
    //清除画布
    arrx = [];
    arry = [];
    arrz = [];
    context.draw(false);
  },
  showSignPop: function () {
    if(!this.data.isAgreement){
      return wx.showToast({
        title: '请勾选服务协议',
        icon:'none'
      })
    }
    this.setData({
      showSignBox: true
    })
    this.cleardraw();
  },
  cancelEvent: function () {
    this.cleardraw();
    this.setData({
      showSignBox: false
    })
  },

})