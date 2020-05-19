//index.js
//获取应用实例
var app = getApp();
var notificationCenter = require('../../WxNotificationCenter.js');
var scanCode = require('../../service/scanCode.js');
var lcPay = require('../../service/lcPay.js');
var systemMessage = require('../../SystemMessage.js');
var filter = require('../../utils/authFilter.js');
var notifConstant = require('../../utils/notifConstant.js');
var btnClickUtil = require('../../utils/uiUtils/btnClickUtil.js');
var promiseUtil = require('../../utils/promiseUtil.js');
var P = require('../../lib/wxpage.js');
var centerService = require('../../service/centerService.js');
var unlock = require('../../service/unlock.js')
var buyCardService = require("../../service/buyCardService.js");
var imgUrl = require("../../utils/uiUtils/imgUrl.js")
var config = require('../../config.js');
var requestUtil = require('../../utils/requestUtil.js');
var loginService = require('../../service/loginService.js');
P('index', {

  data: {
    headerImg: null,
    account: null,
    ticketList: null,
    totalScore: null, //总分
    classArr: [],
    towClassArr: [],
    array: [

    ],
    selectCenter: null,
    buttonClicked: false,
    optionsq: null,
    height: '',
    showPop: false,
    allowTicket: false,
    clubType: '',
    isTrial: false,
    enableParent: false,
    isDistributor: false,
    bopainav: [{
      name: '打卡记录',
      icon: 'clockrecord',
      path: 'pages/clocklist/clocklist'
    }, {
      name: '训练记录',
      icon: 'trainrecord',
        path: 'pages/trainerRecord/trainerRecord'
    },
    //  {
    //   name: '群组打卡',
    //   icon: 'groupclockrecord',
    //   path: ''
    // }, 
    {
      name: '体测数据',
      icon: 'testrecord',
      path: 'pages/bodyTest/bodyTest'
    }, ],
    supportInviteFriends:false
  },
  tobopai(e) {
    var index = e.currentTarget.id
    var path = this.data.bopainav[index].path + '?id=' + this.data.featureSetting.ptToolClubId
    wx.navigateToMiniProgram({
      appId: 'wx8ec962aec839fc7e',
      path: path, // 跳转小程序的路径
      extraData: { // 需要带的的参数
        barCode: 6940139226718,
        promo: 1
      },
      // 有效值 develop（开发版），trial（体验版），release（正式版）
      envVersion: 'release',
      success(res) {
        console.log('跳转成功');
      }
    })
  },
  onLoad: function(options) {
    console.log(options)
    if (options.centerId) {
      // 外部带入团队Id,赋值团队信息
      app.globalData.selectCenter = {
        id: options.centerId,
      }
      loginService.getCenterList().then((res) => {
        res.map(item => {
          if (item.id == options.centerId) {
            app.globalData.selectCenter = item
            wx.setStorageSync('selectCenterKey', item)
            this.setData({
              selectCenter: item
            })
          }
        })
        this.getwxAppSetting()
      })
    }
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          height: res.windowHeight,
        })
      }
    })
    if (typeof(options.q) != 'undefined') {
      this.data.optionsq = options
    }
    // 扫码开门
    if (options.q) {
      console.log("参数")
      console.log(options)
      console.log(options.q)
      app.checkAuthToken(() => {
        unlock.scranQrCodeFromWexin(options, function(res) {
          app.globalData.selectCenter = res;
          that.setData({
            selectCenter: res
          });
          systemMessage.showToast('扫码成功\n若5秒内未开门请重新扫码', 'none', 3000);
        });
      });
    }


    // 监听
    notificationCenter.addNotification(notifConstant.refreshMainPageNotif, this.updateData, this);

    buyCardService.getTicketList().then((res) => {
      that.setData({
        ticketList: res.activeCoupons
      })
    })

  },
  tochangepeople() {
    wx.navigateTo({
      url: '/pages/changepeople/changepeople',
    })
  },
  toInvite(){
    wx.navigateTo({
      url: '/pages/couponOrder/pages/invite/invite',
    })
  },
  // 获取小程序的pc配置信息
  getwxAppSetting() {
    var url = config.getwxAppSetting()
    requestUtil.getRequest(url).then(res => {
      this.getClassArr()
      this.setData({
        featureSetting: res.featureSetting,
        wxAppSetting: res.wxAppSetting,
        isTrial: res.isTrial ? res.isTrial : false,
        supportInviteFriends: res.supportInviteFriends
      })
      if (res.wxAppSetting.showOtherOpenDoorViaQr) {
        wx.getSystemInfo({
          success(res) {
            if (!res.locationEnabled) {
              unlock.checkUserLocationAuthorized();
            }
          }
        })

      }

    })
  },
  changeData() {
    if (this.data.enableParent) {
      wx.navigateTo({
        url: '/pages/headOffice/pages/personalData/personalData',
      })
    }
  },
  toNext(e) {
    if (this.data.account != null) {
      if (e.currentTarget.dataset.number == 1) {
        wx.navigateTo({
          url: '/pages/index/Cards',
        })
      } else if (e.currentTarget.dataset.number == 2) {
        wx.navigateTo({
          url: '/pages/myReservations/reservationList/reservationList',
        })

      } else if (e.currentTarget.dataset.number == 3) {
        wx.navigateTo({
          url: '/pages/headOffice/pages/consumeRecord/consumeRecord',
        })
      } else if (e.currentTarget.dataset.number == 4) {
        wx.navigateTo({
          url: '/pages/headOffice/pages/nullPage/nullPage',
        })
      } else if (e.currentTarget.dataset.number == 5) {
        wx.navigateTo({
          url: '/pages/distribution/pages/distributionCenter/distributionCenter',
        })
      }
    } else {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      app.checkAuthToken()
    }

  },
  toCouponOrder: function() {
    this.routeTo('/pages/couponOrder/pages/orderList/orderList');
  },
  getClassArr: function() {
    if (this.data.clubType == 4) {
      var classArr = [{
          img: "../../images/myCard.png",
          title: "会员卡"
        }, 
        {
          img: "../../images/yuyue.png",
          title: "课程预约",
          path: '/pages/myReservations/reservationList/reservationList'
        }, {
          img: "../../images/coupon.png",
          title: "场地票券",
          path: '/pages/couponOrder/pages/orderList/orderList',
          showname: "allowTicket"
        }, {
          img: "../../images/userOrders.png",
          title: "我的订单",
          path: '/pages/myOrders/orderList/orderList'
        },
        {
          img: "../../images/goodsOrders.png",
          title: "商品订单",
          path: '/pages/shop/orderList'
        }, {
          img: "../../images/collage.png",
          title: "我的拼团",
          path: '/pages/collage/collageList/collageList'
        }, {
          img: "../../images/distributionCenter.png",
          title: "分销中心",
          path: '/pages/distribution/pages/distributionCenter/distributionCenter',
          showname: "isDistributor"
        }
      ];
    } else {
      var classArr = [{
          img: "../../images/myCard.png",
          title: "会员卡",
          showname:"showMyCards"
        },
        {
          img: "../../images/myCourse.png",
          title: "私教课",
          showname:"showMyCourses"
        }, {
          img: "../../images/yuyue.png",
          title: "课程预约",
          path: '/pages/myReservations/reservationList/reservationList',
        },
        {
          img: "../../images/siteyuyue.png",
          title: "场地预订",
          path: '/pages/space/myreservation',
          showname:"showReservationGround"
        }, 
        {
          img: "../../images/coupon.png",
          title: "场地票券",
          path: '/pages/couponOrder/pages/orderList/orderList',
          showname:"allowTicket"
        }, {
          img: "../../images/userOrders.png",
          title: "我的订单",
          path: '/pages/myOrders/orderList/orderList',
        },
        {
          img: "../../images/goodsOrders.png",
          title: "商品订单",
          path: '/pages/shop/orderList',
        }, {
          img: "../../images/collage.png",
          title: "我的拼团",
          path: '/pages/collage/collageList/collageList',
        }, {
          img: "../../images/distributionCenter.png",
          title: "分销中心",
          path: '/pages/distribution/pages/distributionCenter/distributionCenter',
          showname: "isDistributor"
        }
      ];
    }

    var towClassArr = []
    this.setData({
      classArr: classArr,
      towClassArr: towClassArr
    })
  },

  unLoad: function() {
    notificationCenter.removeNotification(notifConstant.refreshMainPageNotif, this);
  },
  getIsdistributor: function() {
    centerService.getIsDistributor().then((res) => {
      this.setData({
        isDistributor: res
      })
    })

  },
  recognitionEvent: function() {
    wx.navigateTo({
      url: '/pages/faceRecognition/uploadImg',
    })
  },
  updateData: function() {
    var account = wx.getStorageSync('account') || app.globalData.account
    if (account && (!account.photo || account.photo == 'null' || account.photo == 'static/images/default_user.png' || account.photo.indexOf('wx.qlogo.cn') > 0)) {
      this.setData({
        showPop: true
      })
    } else {
      this.setData({
        showPop: false
      })
    }
    // console.log(account)
    if (account && account.photo) {
      var headerImg = imgUrl.getDefaultAvatar(account.photo)
    }
    this.setData({
      account: account || wx.getStorageSync('account'),
      headerImg: headerImg,
      selectCenter: app.globalData.selectCenter,
    });

  },

  userInforViewTap: function() {
    console.log(this.data.account)
    if (this.data.account == null || !this.data.account) {
      if (!this.data.buttonClicked) {
        btnClickUtil.buttonClicked(this);
        app.globalData.receive = true
        app.checkAuthToken();
      }
    } else {
      this.routeTo('/pages/centers/centerList?needBack=false');
    }
  },
  qrCode: function() {
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
  },


  setSelectCenter: function(res) {
    app.globalData.selectCenter = res;
    this.setData({
      selectCenter: res
    });
    systemMessage.showToast('扫码成功\n若5秒内未开门请重新扫码', 'none', 3000);
  },

  // 点击scrollView
  scrollViewTap: function(event) {
    var path = event.currentTarget.id;
    console.log(path)
    this.routeTo(path)
  },

  //我的优惠券
  myCup: function() {
    this.routeTo('/pages/tickets/tickets');
  },

  //我的积分
  myIntegral: function() {
    this.routeTo('/pages/integral/integral')
  },

  selectClass: function(e) {
    console.log(e)
    var idx = e.currentTarget.dataset.idx
    var path = e.currentTarget.id;
    console.log(path)
    console.log(idx)
    if (idx == '0') {
      this.toCards() //会员卡
    } else if (idx == '1' && this.data.clubType != 4) {
      this.toOrders() //私教课
    } else {
      this.routeTo(path)
    }

  },

  // 我的预约
  toMyReservations: function() {
    this.routeTo('/pages/myReservations/reservationList/reservationList');
  },

  // 我的私教课
  toOrders: function() { //迈健身不开放
    // if (app.globalData.selectCenter.id == 676 || app.globalData.selectCenter.id == 677 || app.globalData.selectCenter.id == 678 || app.globalData.selectCenter.id == 679) {
    //   systemMessage.showToast('场馆暂未开放', 'none', 1500);
    //   return
    // }
    this.routeTo('/pages/index/course');
  },
  changetoown(){
    var url=config.getownermsg()
    let s = wx.getExtConfigSync()
    var thirdParty = false
    if (JSON.stringify(s) != '{}') {
      thirdParty = true
    } else {
      thirdParty = false
    }
    var data={
      openId: wx.getStorageSync("openIdKey"),
      thirdParty: thirdParty
    }
    requestUtil.postRequest(url,data).then(res=>{
      wx.setStorageSync("isother", false)
      wx.setStorageSync("tokenKey", res['WXAPPCHATID'])
      wx.setStorageSync("account", res.account)
      app.globalData.account = res['account']
      app.globalData.token = res['WXAPPCHATID']

      if (!res.ownerExists) {
        wx.navigateTo({
          url: '/pages/centers/centerList',
        })
      }else{
        wx.setStorageSync("isother", false)
        centerService.getCenterInfo().then((res) => {
          this.setData({
            allowTicket: res.allowTicket,
            isother:false
          })
        });
        this.updateData();
        this.getIsdistributor();
        this.getwxAppSetting()
        var url = config.getpiontnum()
        requestUtil.getRequest(url).then(res => {
          this.setData({
            // 获取数据
            totalScore: res
          })
        })
      }
    })
  },

  // 会员卡
  toCards: function() { //迈健身不开放
    // if (app.globalData.selectCenter.id == 676 || app.globalData.selectCenter.id == 677 || app.globalData.selectCenter.id == 678 || app.globalData.selectCenter.id == 679) {
    //   systemMessage.showToast('场馆暂未开放', 'none', 1500);
    //   return
    // }
    this.routeTo('/pages/index/Cards');
  },

  routeTo: function(url) {
    if (!this.data.buttonClicked) {
      btnClickUtil.buttonClicked(this);
      if (this.data.account != null) {
        this.$route(url);
      } else {
        wx.showToast({
          title: '请先登录',
          icon: 'none'
        })
        app.checkAuthToken()
      }
    }
  },

  goAccount: function(e) {
    wx.navigateTo({
      url: '/pages/setup/setup',
    })
  },


  onShow: function() {
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {
      this.getTabBar().setData({
        selected: 2
      })
    }
    // 获取是不是衢州版本
    wx.getExtConfig({
      success: res => {
        if (res.extConfig.enableParent) {
          this.setData({
            enableParent: res.extConfig.enableParent,
            array: [{
              img: "../../images/next.png",
                title: "健身记录",
                path: '/pages/sign/sign',
    
              },
              {
                img: "../../images/next.png",
                title: "消费记录",
                path: '/pages/headOffice/pages/consumeRecord/consumeRecord',
           
              },
              {
                img: "../../images/next.png",
                title: "评价与反馈",
                // path: '/pages/traineeCenter/centerEvaluation'
                path: '/pages/traineeCenter/evaluationList',
         
              }
            ],
          })
        } else {
          this.setData({
            array: [{
              img: "../../images/signpersonal.png",
                title: "健身记录",
                path: '/pages/sign/sign',
              },
              {
                img: "../../images/leaverecord.png",
                title: "请假记录",
                path: '/pages/leaverecord/leaverecord',
                 show: true
              },
              {
                img: "../../images/depositpersonal.png",
                title: "定金记录",
                path: '/pages/deposit/deposit',
              },
              {
                img: "../../images/evaluationList.png",
                title: "评价与反馈",
                path: '/pages/traineeCenter/evaluationList',
              }
            ]
          })
        }

      }
    })
    centerService.getCenterInfo().then((res) => {
      this.setData({
        allowTicket: res.allowTicket,
        account: wx.getStorageSync("account"),
        isother: wx.getStorageSync("isother") || false
      })
    });
    this.updateData();
    this.getIsdistributor();
    if (app.globalData.isAppOnShow) {
      var that = this
      app.globalData.isAppOnShow = false;
      app.checkAuthToken(that.data.optionsq != null ? function() {
        unlock.scranQrCodeFromWexin(that.data.optionsq, function(res) {
          app.globalData.selectCenter = res;
          that.setData({
            selectCenter: res
          });
          systemMessage.showToast('扫码成功\n若5秒内未开门请重新扫码', 'none', 3000);
          that.data.optionsq = null
        });
      } : null);
    } else {
      this.updateData();
    }
    this.setData({
      clubType: wx.getStorageSync('selectCenterKey').clubType || app.globalData.selectCenter.clubType.updateData,
      account:wx.getStorageSync("account"),
      isother: wx.getStorageSync("isother") || false
    })
    this.getwxAppSetting()
    var wxGetExtConfig = promiseUtil.wxPromisify(wx.getExtConfig);
    wxGetExtConfig().then((res) => {
      if (JSON.stringify(res.extConfig) != '{}') {
        wx.setNavigationBarTitle({
          title: res.extConfig.centerName
        });
      }
    })
    // 积分详情
    if (app.globalData.token) {
      var url = config.getpiontnum()
      requestUtil.getRequest(url).then(res => {
        this.setData({
          // 获取数据
          totalScore: res
        })
      })
    }

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})