// pages/checkin/checkin.js
var util = require('../../utils/util.js')
var unlock = require('../../service/unlock.js')
var centerService = require('../../service/centerService.js');
var promiseUtil = require('../../utils/promiseUtil.js');
var storageUtil = require('../../utils/storageUtil.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scene: null,
    info: null,
    cardList: [],
    status: 0,
    centerId: null,
    card: null,
    greet: '',
    indicatorDots: false,
    current: 0,
    showPop: null,
    checkInPoster: [],
    showPops:false
  },

  recognitionEvent: function () {
    wx.navigateTo({
      url: '/pages/faceRecognition/uploadImg',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.data.scene = options.scene

  },
  closePop() {
    this.setData({
      showPop: false
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    var that = this
    if (app.globalData.isAppOnShow) {
      app.globalData.isAppOnShow = false;
      if (!app.globalData.token && that.data.scene != null) {
        let info = {
          id: decodeURIComponent(that.data.scene)
        }
        console.log('---gfgf'+info)
        app.globalData.selectCenter = info;
        storageUtil.saveSelectCenter(info);
      }

    } else {
      if (that.data.scene != null) {
        let info = {
          id: decodeURIComponent(that.data.scene)
        }
        app.globalData.selectCenter = info;
        storageUtil.saveSelectCenter(info);
      }
    }
    this.getData();

    var wxGetExtConfig = promiseUtil.wxPromisify(wx.getExtConfig);
    wxGetExtConfig().then((res) => {
      if (JSON.stringify(res.extConfig) != '{}') {
        wx.setNavigationBarTitle({
          title: res.extConfig.centerName
        });
      }
    })
    if (app.globalData.account&&app.globalData.account.photo == 'static/images/default_user.png') {
      this.setData({
        showPops: true
      })
    } else {
      this.setData({
        showPops: false
      })
    }
  },
  swiperImg(e) {
    //获取当前轮播图片的下标, 可以给当前指示点加样式
    this.setData({
      current: e.detail.current
    })
  },
  toindex() {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },
  getData: function() {
    console.log('eeee')
    var that = this
    if (app.globalData.token == null) {
      app.globalData.receive = true
    }
    that.data.scene == 1
    console.log(that.data.scene)
    app.checkAuthToken(that.data.scene != null ? function() {
 
      centerService.preCheckIn(that.data.scene).then(res => {

        console.log(123)
          that.setData({
            info: res,
            cardList: res.cards,
            checkInPoster: res.checkInPoster
          })
          if (res.checkInPoster.length == 0) {
            that.setData({
              showPop: false
            })
          } else {
            that.setData({
              showPop: true
            })
          }
          app.globalData.selectCenter = res.center;
          storageUtil.saveSelectCenter(res.center);
          if (res.traineeStatus == 2) {
            var hours = new Date().getHours()
            var greet = ''
            if (hours < 12) {
              greet = '早上好！'
            } else if (hours >= 12 && hours < 18) {
              greet = '下午好！'
            } else {
              greet = '晚上好！'
            }
            that.setData({
              greet: greet
            })
          }
          that.data.centerId = that.data.scene;
          that.data.scene = null
          if (res.checkInId != null) {
            that.checkInStatus(res.checkInId, 0)
          }
        }


      )

    } : null);
  },

  checkInStatus: function(checkInId, tryCount) {
    tryCount++;
    var that = this
    centerService.checkInStatus(that.data.centerId, checkInId).then((res) => {
      if (res.confirmed) {
        // $scope.isConfirmed = true;
        that.setData({
          status: 1
        })
        if (res.card) {
          that.setData({
            card: res.card
          })
         // $scope.me = resp.me;
        }
        //$scope.checkinTime = res.checkinTime;
      }else{
        setTimeout(function () {
          that.checkInStatus(checkInId, tryCount);
        }, 3000);
      }
    });
  },


})