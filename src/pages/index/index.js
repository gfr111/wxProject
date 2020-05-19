//index.js
//获取应用实例
var app = getApp();
var notificationCenter = require('../../WxNotificationCenter.js');
var scanCode = require('../../service/scanCode.js');
var systemMessage = require('../../SystemMessage.js');
var filter = require('../../utils/authFilter.js');
var notifConstant = require('../../utils/notifConstant.js');
var btnClickUtil = require('../../utils/uiUtils/btnClickUtil.js');
var promiseUtil = require('../../utils/promiseUtil.js');
var P = require('../../lib/wxpage.js');
var centerService = require('../../service/centerService.js');
var storageUtil = require('../../utils/storageUtil.js');
var requestUtil = require('../../utils/requestUtil.js');
var config = require('../../config.js');
var loginService = require('../../service/loginService.js');
var unlock = require('../../service/unlock.js')
var authenticationUtil = require('../../utils/authenticationUtil.js');
var btnClickUtil = require('../../utils/uiUtils/btnClickUtil.js');
var util = require('../../utils/util.js');
var headOfficeService = require('../../service/headOfficeService.js');
var isLocation = false;

P('index', {
  data: {
    notifications: null,
    activities: null,
    sliders: null,
    selectCenter: null,
    account: null,
    trainers: null,
    exprience: null,
    optionsq: null,
    active: null,
    indicatorDots: false,
    indicatorDot: false,
    current: 0,
    cur: 0,
    autoplay: false,
    allowTicket: null,
    phone: '',
    clubType: '',
    centerId: '',
    groupBookings: [],
    timeUtils: '',
    IAQDiff: [50, 50, 50, 50, 100, 100, 100],
    pmDiff: [35, 40, 40, 35, 100, 100, 150],
    pmMin: [0, 35, 75, 115, 150, 250, 350, 500],
    IAQMin: [0, 50, 100, 150, 200, 300, 400, 500],
    IAQIndex: ['优', '良', '轻度污染', '中度污染', '重度污染', '严重污染'],
    branchCenterList: [],
    isauthSetting: true,
    trueNumber: 0,
    enableParent: false,
    banner: true,
    featureSetting: '',
    clubPhotoList: [],
    showCoupon: false,
    couponList:[]
  },
  getbind(data, params) {
    if (data[2]) {
      var url = config.getbind(data[0], data[2])
      requestUtil.postRequest(url, params).then(res => {
        wx.removeStorageSync("params")
        wx.removeStorageSync("actscan")
      })
    }
  },
  previewImage(e) {
    var img = e.currentTarget.id
    wx.previewImage({
      urls: this.data.clubPhotoList,
      current: img
    })
  },
  onLoad: function(options) {
    if (options.centerId) {
      this.setData({
        centerId: options.centerId
      })
    }
    // 拿token
    authenticationUtil.checkAuth(res => {
      // 外部进入带团队Id
      if (options.centerId) {
        app.globalData.selectCenter = {
          id: options.centerId,
        }
      } else {
        // 缓存有没有团队，没有跳转，有赋值
        authenticationUtil.checkSelectclub(
          res => {
            this.setData({
              selectCenter: res
            })
            this.getwxAppSetting();
            this.getactualNumber();
            this.getairPollution();
            this.updateData();
            this.getList();
          }
        )
      }
    })
    if(options.scene) {
      let params = options
      options = options.scene.split("_")
      wx.setStorageSync("targetCenterId", options[0])
      wx.setStorageSync("actscan", options)
      wx.setStorageSync("params", params)
    }
  },
  toPage(e) {
    wx.navigateTo({
      url: '/pages/trainers/trainerDetail?id=' + e.currentTarget.id + '&centerId=' + app.globalData.selectCenter.id,
    })
  },
  onShow: function() {
    if (app.globalData.isAppOnShow) {
      app.globalData.isAppOnShow = false;
    }
    this.setData({
      timeUtils: Date.parse(new Date()),
      banner: true,
      isother: wx.getStorageSync("isother") || false
    })
    if (this.data.centerId) {
      loginService.getCenterList().then((res) => {
        res.map(item => {
          if (item.id == this.data.centerId) {
            app.globalData.selectCenter = item;
            wx.setStorageSync('selectCenterKey', item)
            this.setData({
              selectCenter: item
            })
          }

        })
        this.setData({
          clubType: wx.getStorageSync('selectCenterKey').clubType || 0
        })
        // 获取数据
        if (wx.getStorageSync('selectCenterKey') || app.globalData.selectCenter) {
          this.updateData()
        }
        this.getwxAppSetting();
        this.getactualNumber();
        this.getairPollution();
        this.getCoupon();
        console.log(wx.getStorageSync('selectCenterKey').mainCenter)
        if (wx.getStorageSync('selectCenterKey').mainCenter) {
          this.getList();
        }
        // 会员与教练绑定
        var opti = wx.getStorageSync("actscan")
        var parm = wx.getStorageSync("params")
        if (opti && parm) {
          app.checkAuthToken(() => {
            if (app.globalData.token || wx.getStorageSync("tokenKey")) {
              this.getbind(opti, parm)
            }
          })
        }
      })
    } else {
      this.setData({
        clubType: wx.getStorageSync('selectCenterKey').clubType || 0
      })
      // 获取数据
      if (wx.getStorageSync('selectCenterKey') || app.globalData.selectCenter) {
        this.updateData()
      }
      this.getwxAppSetting();
      this.getCoupon();
      // 会员与教练绑定
      var opti = wx.getStorageSync("actscan")
      var parm = wx.getStorageSync("params")
      if (opti && parm) {
        app.checkAuthToken(() => {
          if (app.globalData.token || wx.getStorageSync("tokenKey")) {
            this.getbind(opti, parm)
          }
        })
      }
      this.getactualNumber();
      this.getairPollution();
      if (wx.getStorageSync('selectCenterKey').mainCenter) {
        this.getList();
      }
    }
    // 获取第三方信息
    var wxGetExtConfig = promiseUtil.wxPromisify(wx.getExtConfig);
    wxGetExtConfig().then((res) => {
      if (JSON.stringify(res.extConfig) != '{}') {
        wx.setNavigationBarTitle({
          title: res.extConfig.centerName
        });
      }else{
        wx.setNavigationBarTitle({
          title: '菠菜+'
        });
      }
    })
  },
  toMap() {
    wx.navigateTo({
      url: '/pages/headOffice/pages/officeMap/officeMap',
    })
  },
  getList() {
    var that = this;
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        that.setData({
          isauthSetting: true
        })
        headOfficeService.getBranchCenterList({
          latitude: res.latitude,
          longitude: res.longitude
        }).then((result) => {
          result.forEach(function(item) {
            item.distance = (item.distance * 0.001).toFixed(3)
          })
          that.setData({
            branchCenterList: result
          })
        })
      },
      fail: (res) => {
        wx.getSetting({
          success: function(res) {
            if (!res.authSetting['scope.userLocation']) {
              that.setData({
                isauthSetting: false
              })
            } else {
              //用户已授权，但是获取地理位置失败，提示用户去系统设置中打开定位
              wx.showModal({
                title: '',
                content: '请在系统设置中打开定位服务',
                confirmText: '确定',
                showCancel: false,
                success: function(res) {

                }
              })
            }
          }
        })
      }
    })
  },
  //获取票券列表
  getCoupon(){
    centerService.getSystemCoupons().then((res)=>{
      console.log(res)
      if(res.length>0){
        if(res.length>3){
          this.setData({
            couponList: res.slice(0, 3),
            showCoupon: true
          })
        }else{
          this.setData({
            couponList: res,
            showCoupon: true
          })
        }
      }else{
        this.setData({
          showCoupon: false
        })
      }
    })
  },
  hideList(){
    this.setData({
      showCoupon: false
    })
  },
  couponCenter(){
    wx.navigateTo({
      url: '/pages/tickets/tickets',
    })
  },
  //总店获取分店列表
  getBranchList() {
    var that = this;
    wx.getSystemInfo({
      success(res) {
        console.log(res.locationEnabled)
        if (res.locationEnabled) {
          that.getList();
        } else {
          wx.showToast({
            title: '手机定位未打开，无法获取分店列表',
            icon: 'none'
          })
        }
      }
    })

  },
  getopensetting(e) {
    if (e.detail.authSetting['scope.userLocation']) {
      this.getList();
    } else {
      wx.showToast({
        title: '授权以后才能获取哦',
        icon: 'none'
      })

    }
  },
  getairPollution() {
    var url = config.airPollution()

    requestUtil.getRequest(url).then(res => {
      if (!res || !res.latest) {
        return
      }
      var value = res.latest.PM25
      var index = 0
      var pmMin = this.data.pmMin
      for (var i = 0; i < pmMin.length; i++) {
        if (i < pmMin.length - 1) {
          if (value >= pmMin[i] && value < pmMin[i + 1]) {
            index = i;
            break;
          }
          continue;
        } else {
          index = i - 1;
        }
      }
      var airscore = Math.floor(this.data.IAQDiff[index] / this.data.pmDiff[index] * (value - pmMin[index]) + this.data.IAQMin[index]);
      var airstatus = index <= 1 ? this.data.IAQIndex[index] : '--'
      var airindex = index
      this.setData({
        air: res,
        airscore: airscore,
        airstatus: airstatus,
        airindex: airindex
      })
    })

  },
  toDetail(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/headOffice/pages/officeDetail/officeDetail?clubId=' + e.currentTarget.dataset.id,
    })
  },
  getactualNumber() {
    var url = config.actualNumber()
    requestUtil.getRequest(url).then(res => {
      let allnum = wx.getStorageSync('selectCenterKey').fullNumber
      var percent = res / allnum;
      var actualNumberstatus = percent > 0.8 ? 1 : percent > 0.6 && percent < 0.8 ? 2 : percent > 0.3 && percent < 0.6 ? 3 : percent > 0.1 && percent < 0.3 ? 4 : 5

      this.setData({
        actualNumberstatus: actualNumberstatus
      })
    })

  },

  toAssembleDetail(e) {
    var id = e.currentTarget.dataset.id;
    this.data.groupBookings.forEach(item => {
      if (id == item.objectId) {
        // console.log(item.objectType)
        if (item.objectType != 1) {
          wx.navigateTo({
            url: '/pages/courseBuyOnline/availableCourseDetail?id=' + item.objectId + '&pageTip=courses',
          })
        } else {
          wx.navigateTo({
            url: '/pages/cardsPurchaseOnline/availableCardDetail?id=' + item.objectId + '&pageTip=cars',
          })
        }

      }
    })
  },
  swiperChange(e) {
    //获取当前轮播图片的下标, 可以给当前指示点加样式
    this.setData({
      cur: e.detail.current
    })
  },
  swiperImg(e) {
    //获取当前轮播图片的下标, 可以给当前指示点加样式
    this.setData({
      current: e.detail.current
    })
  },

  unLoad: function() {
    notificationCenter.removeNotification(notifConstant.refreshMainPageNotif, this);
  },

  qrCode: function() {
    if (app.globalData.token == null) {
      app.globalData.receive = true
      authenticationUtil.checkAuthToken();
    } else {
      var that = this;
      if (!that.data.buttonClicked) {
        btnClickUtil.buttonClicked(that);
        unlock.qrCode(function(res) {
          app.globalData.selectCenter = res;
          that.setData({
            selectCenter: res
          });
          systemMessage.showToast('扫码成功\n若5秒内未开门请重新扫码', 'none', 3000);
        });
      }
    }
  },
  toAssembleList() {
    wx.navigateTo({
      url: '/pages/memberCarlist/assembleCourseList',
    })
  },
  // activitiesDetail: function(e) {
  //   console.log(e)
  //   wx.navigateTo({
  //     url: '/pages/activity/activity?id=' + e.currentTarget.dataset.id + '&centerId=' + this.data.selectCenter.id + '&centerName=' + this.data.selectCenter.name + '&centerAddress=' + this.data.selectCenter.address + '&centerPhone=' + this.data.phone,
  //   })
  // },

  activitiesDetail: function (e) {
    wx.navigateTo({
      url: '/pages/activity/activity?id=' + e.currentTarget.dataset.id + '&centerId=' + this.data.selectCenter.id + '&centerName=' + this.data.selectCenter.name + '&centerAddress=' + this.data.selectCenter.address + '&centerPhone=' + this.data.phone,
    })
  },





  notificationsDetail: function(e) {
    console.log("这是公告详情页" + e.currentTarget.dataset.index)
  },

  updateData: function() {
    var that = this
    // that.setData({
    //   current: 0
    // })
    centerService.getCenterInfo().then((res) => {

      if (res.testToken != undefined && app.globalData.token == null && app.globalData.testToken == null) {
        app.globalData.testToken = res.testToken
      }
      var phone = res.phone ? res.phone : '';
      if (!res.groupBookings) {
        return;
      }
      var arr = res.groupBookings.length > 0 ? res.groupBookings.slice(0, 3) : res.groupBookings;
      arr.forEach(item => {
        if (item.startTs > Date.parse(new Date())) {
          item.startTime = util.get_time_diff(item.startTs)
        }
      })
      // console.log(res.description)
      // console.log('------')
      // console.log(util.html2Text(res.description))
      that.setData({
        account: app.globalData.account,
        selectCenter: app.globalData.selectCenter,
        sliders: res.sliders,
        descrip: res.description,
        trainers: res.trainers.slice(0, 5),
        notifications: res.notifications,
        activities: res.activities,
        active: res.allowWxSportExchange,
        exprience: res.salesPromoyions,
        allowTicket: res.allowTicket,
        phone: phone,
        groupBookings: arr,
        clubPhotoList: res.pictures ? res.pictures : []
      })
    })
  },
  /**
   * JS获取距当前时间差
   * 
   * @param int time JS毫秒时间戳
   *
   */

  callPhone: function(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone,
      fail: res => {
        // wx.showModal({
        //   title: '拨打电话失败',
        //   content: res.errMsg,
        //   showCancel: false
        // })
      }
    })
  },
  tapMoreHeader: function(e) {
    if (e.currentTarget.dataset.id == 2) {
      wx.navigateTo({
        url: '/pages/trainers/trainerList',
      })
    }
  },

  goCenterList: function() {
    wx.navigateTo({
      url: '/pages/centers/centerList',
    });
  },

  navigateTo: function(url) {
    if (!this.data.buttonClicked) {
      btnClickUtil.buttonClicked(this);
      if (this.data.account != null) {
        wx.navigateTo({
          url: url,
        });
      }
    }
  },

  routeTo: function(url) {
    if (!this.data.buttonClicked) {
      btnClickUtil.buttonClicked(this);
      if (this.data.account != null) {
        this.$route(url);
      }
    }
  },

  goShop: function() {
    if (app.globalData.token == null) {
      app.globalData.receive = true
      authenticationUtil.checkAuthToken();
    } else {
      wx.navigateTo({
        url: '/pages/shop/merchandiseList',
      })
    }
  },
  onHide() {
    this.setData({
      centerId: '',
      banner: false
    })
  },



  runTo: function(option) {
    wx.navigateTo({
      url: '/pages/integral/integralChange',
    })
  },

  //顶部轮播图点击跳转事件
  swiperInfo: function(e) {
    var that = this
    var title = e.currentTarget.dataset.title
    var type = e.currentTarget.dataset.type
    var idx = e.currentTarget.dataset.idx
    var content = that.data.sliders[idx]
    console.log(content)
    //  0 无链接 1 链接地址 2 文本 4 活动 5 会员卡 6 培训卡 7 私教课 8 优惠券 9 商品
    if (type == 2 || type == 3) {
      wx.navigateTo({
        url: '/pages/index/swiperinfo?title=' + title + '&content=' + encodeURIComponent(content.content),
      })
    } else if (type == 1) {
      wx.navigateTo({
        url: '/pages/index/linkPage?title=' + title + '&link=' + encodeURIComponent(content.link),
      })

    } else if (type == 4) {
      wx.navigateTo({
        url: '/pages/activity/activity?id=' + content.objectId + '&centerId=' + this.data.selectCenter.id + '&centerName=' + this.data.selectCenter.name + '&centerAddress=' + this.data.selectCenter.address + '&centerPhone=' + this.data.phone,
      })
    } else if (type == 5 || type == 6) {
      console.log('?id=' + content.objectId + '&pageTip=cars')
      wx.navigateTo({
        url: '/pages/cardsPurchaseOnline/availableCardDetail?id=' + content.objectId + '&pageTip=cars',
      })

    } else if (type == 7) {
      wx.navigateTo({
        url: '/pages/courseBuyOnline/availableCourseDetail?id=' + content.objectId,
      })

    } else if (type == 8) {
      wx.navigateTo({
        url: '/pages/couponOrder/pages/receiveNewCoupon/receiveNewCoupon?id=' + content.objectId,
      })
    }
    //  else if (type == 9) {
    //   wx.navigateTo({
    //     url: '/pages/index/linkPage?title=' + title + '&link=' + encodeURIComponent(content.link),
    //   })
    // }
  },
  // 获取小程序的配置信息
  getwxAppSetting() {
    var url = config.getwxAppSetting();
    wx.getExtConfig({
      success: res => {
        if (res.extConfig.enableParent) {
          this.setData({
            enableParent: res.extConfig.enableParent
          })
        }
      }
    })
    requestUtil.getRequest(url).then(res => {
      var arr = [{
          name: '二维码',
          valname: res.wxAppSetting.showHomeMemberQr
        },
        {
          name: '购卡',
          valname: res.wxAppSetting.showHomeBuyCard
        },
        {
          name: '购课',
          valname: res.wxAppSetting.showHomeBuyCourse
        },
        {
          name: '购票',
          valname: res.wxAppSetting.showHomeBuyTicket
        },
        {
          name: "反馈",
          valname: res.wxAppSetting.showHomeFeedback
        },
        {
          name: "报名",
          valname: res.featureSetting.allowTrainingModule
        }
      ]
      var num = 0;
      arr.forEach((item) => {
        if (item.valname) {
          num++
        }
      })
      this.setData({
        wxAppSetting: res.wxAppSetting,
        trueNumber: num,
        featureSetting: res.featureSetting
      })
    })
  },
  preventTouchMove() {

  },
  onShareAppMessage: function() {
    return {
      path: "/pages/index/index"
    }
  },
})