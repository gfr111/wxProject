// pages/protocol/protocol.js
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
var isPay = false;
var requestUtil = require('../../utils/requestUtil.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    descrip: '',
    showSignBox: false,
    src: "",
    // img: "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=578899140,1412678472&fm=27&gp=0.jpg",
    img: "",
    rpx: '',
    procotolId: null,
    id: 1,
    contractId: null,
    centerId: null,
    signImg: null,
    cardMess: null,
    centerList: [],
    isShowSign: false,
    noPic: false,
    scene: null,
    isShow: false,
    showPay: false, //是否显示支付按钮
    signersError: false, //是否是本人
    isCanvas: false,
    canvasWidth: 260,
    canvasHeight: 600,
    rpx:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log('培训课')
    var that=this;
    that.data.scene = options.scene;
    wx.getSystemInfo({
      success(res) {
       that.setData({
         rpx:res.windowWidth / 375
       })
      },
    })
  },
  // wx.request({
  //   url: config.host + 'wxApp/' + that.data.id + '/cardContract/' + that.data.contractId + '?loadPreCardInfo=true' , // 仅为示例，并非真实的接口地址
  //   header: {
  //     // 'content-type': 'application/json', // 默认值
  //     'WXAPPCHATID': 'eyJuYW1lIjoi6b6a5Yek5aaCIiwicGhvbmUiOiIxNTI1NzE3NjI5MyIsImFjY291bnRJZCI6MTUyOTUyMCwiaW1wZXJzb25hdGVkIjpmYWxzZX0=.bM+ILo0JcBZDctmn3mr04MTRCj7pOENleVOpU/CZh40='
  //   },
  //   success(res) {
  //      console.log(res.data.data)
  //      that.setData({
  //        cardMess: res.data.data,
  //      })
  //      var arr=[]
  //     for (var i = 0; i < res.data.data.usableCenters.length;i++){
  //       arr.push(res.data.data.usableCenters[i].name)
  //     }
  //     that.setData({
  //       centerList: arr
  //     })
  //   }
  // })

  confirm: function() {
    this.setData({
      noPic: true,
      isShow: true
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  prevent: function() {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this

    if (that.data.scene != null) {
      this.data.centerId = this.data.scene.split("_")[0],
        this.data.contractId = this.data.scene.split("_")[1]


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

      // console.log('-----------')
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
    app.checkAuthToken(function() {

      // 使用 wx.createContext 获取绘图上下文 context
      context = wx.createCanvasContext('canvas');
      context.beginPath()
      context.setStrokeStyle('#000000');
      context.setLineWidth(4);
      context.setLineCap('round');
      context.setLineJoin('round');
      // context.drawImage('../../images/img111.png', 0, 0, canvasw, 500);
      context.draw();

      console.log('---token---', app.globalData)
      console.log('----参数----', that.data.centerId, '---' + that.data.contractId)
      centerService.getBuyCardInfoDetail(that.data.centerId, that.data.contractId).then(res => {
        console.log('----扫码结果----', res)
        if (res.signersError == true) {
          that.setData({
            signersError: res.signersError
          })
        }
        that.setData({
          cardMess: res
        })

        if (res.contract.status == -2 && res.contract.isTraineeSigned) {
          that.setData({
            showPay: true
          })
        }
        if (res.contract.status >= 0) {
          that.setData({
            showPay: false
          })
        }
        if (res.contract.isTraineeSigned) {
          that.setData({
            signImg: res.signUrl,
            showSignBox: false,
            isShowSign: true,
            isShow: true,
            noPic: true,

          })
        }


        var arr = []
        for (var i = 0; i < res.usableCenters.length; i++) {
          arr.push(res.usableCenters[i].name)
        }
        that.setData({
          centerList: arr
        })
        if (that.data.scene != null) {


          app.globalData.selectCenter = res.center;
          console.log('--000' + app.globalData.selectCenter.name)
          storageUtil.saveSelectCenter(res.center);
          that.data.scene == null
        }

      });
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },
  imgRotate(path) {
    var that = this;
    var canvas = wx.createContext('canvas2');
    // that.setData({
    //   canvasWidth: 300,
    //   canvasHeight: 180
    // });
    var rpx = that.data.rpx;
    canvas.translate(10 * rpx, 165 * rpx);
    canvas.rotate(-90 * Math.PI / 180);
    canvas.drawImage(path, 0, 0, 150 * rpx, 250 * rpx);
    wx.drawCanvas({
      canvasId: 'canvas2',
      actions: canvas.getActions()
    })
  },
  //开始
  canvasStart: function(event) {
    isButtonDown = true;
    arrz.push(0);
    arrx.push(event.changedTouches[0].x);
    arry.push(event.changedTouches[0].y);
  },
  //过程
  canvasMove: function(event) {
    var that = this
    if (isButtonDown) {
      arrz.push(1);
      // console.log(event)
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
  // 点击保存图片
  clickMe: function() {
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
      success: function(res) {
        console.log(res)
        that.imgRotate(res.tempFilePath);
        setTimeout(function () {
          wx.canvasToTempFilePath({
            canvasId: 'canvas2',
            success: function (resp) {
              console.log('--图片--', resp)
            //存入服务器
            wx.uploadFile({
              url: config.uploadSignImgUrl(that.data.contractId),
              //url: config.host + 'wxApp/' + that.data.id + '/' + that.data.contractId +'/electroincSign', //接口地址
              filePath: resp.tempFilePath,
              name: 'file',
              header: header,

              success: function(res) {
                // console.log(JSON.parse(res.data).meage);
                if (JSON.parse(res.data).status == 1) {
                  that.setData({
                    showSignBox: false,
                  })
                  wx.showToast({
                    title: JSON.parse(res.data).message,
                    icon: 'none'
                  })
                    
                } else {
                  that.setData({
                    signImg: JSON.parse(res.data).data,
                    showSignBox: false,
                    isShowSign: true,
                    isShow: true,
                    noPic: true,
                    showPay: true
                  })
                }
                if (that.data.cardMess.contract.status >= 0) {
                  that.setData({
                    showPay: false
                  })
                }
              },
              fail: function(res) {
                wx.showToast({
                  title: '上传签名失败！',
                  icon: 'none'
                })
              },
              complete: function(res) {}
            });
            }
          })
        },50)
      }
    })
  },

  goPay: function(evt) {
    //service.setUrl($scope.centerId+'/courseOrder/'+item);
    var that = this;
    if (isPay) {
      return
    }
    isPay = true;
    var that = this;
    buyCardService.preCardPay(that.data.cardMess.contract.id).then((res) => {
      console.log(isPay)
      buyCardService.goPay(res, function(tradeNo) {
        wx.showToast({
          title: '购买成功',
        })
        console.log(isPay)
        that.setData({

          showPay: false
        })
      })
      console.log(isPay)
      isPay = false;
    }).catch((err) => {
      wx.hideLoading();
      systemMessage.showModal('', err);
      isPay = false;
    })

  },


  canvasEnd: function(event) {
    isButtonDown = false;
  },
  cleardraw: function() {
    this.setData({
      isCanvas: false
    })
    //清除画布
    arrx = [];
    arry = [];
    arrz = [];
    context.draw(false);
  },
  showSignPop: function() {
    this.setData({
      showSignBox: true
    })
    this.cleardraw();
  },
  cancelEvent: function() {
    this.cleardraw();
    this.setData({
      showSignBox: false
    })
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})