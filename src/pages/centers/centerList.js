var loginService = require('../../service/loginService.js');
var storageUtil = require('../../utils/storageUtil.js');
var authenticationUtil = require('../../utils/authenticationUtil.js');
var notificationCenter = require('../../WxNotificationCenter.js');
var notifConstant = require('../../utils/notifConstant.js');
var app = getApp();
var P = require('../../lib/wxpage');
var storageUtil = require('../../utils/storageUtil.js');

P("centers/centerList", {

  /**
   * 页面的初始数据
   */
  data: {
    centers: [{}],
    selectedId: "",
    needBack: 'true',
    tappedNum: 0, //防止多次点击popback
  },

  onNavigate: function(res) {
    this.preDataRequest();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (typeof(options.needBack) != 'undefined') {
      this.data.needBack = options.needBack;
    }
    let center = app.globalData.selectCenter;
    if (center) {
      this.setData({
        selectedId: center.id
      });
    }
    this.refresh();

    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];

    if (prevPage.route == 'pages/index/index') {
      prevPage.setData({
        current: 0
      })
    }
    if (prevPage.route == 'pages/groupCourse/groupCourseList') {
      prevPage.setData({
        showGroup: 1
      })
    }




  },

  refresh: function() {
    var res = this.$take('centerList');
    if (res) {
      this.handleData(res);
    } else {
      this.getData();
    }
  },


  getData: function() {
    var that = this;
    that.dataRequest(function(res) {
      that.handleData(res);
    })
  },

  preDataRequest: function() {
    var that = this;
    that.dataRequest(function(res) {
      that.$put('centerList', res);
    })
  },

  dataRequest: function(callBack) {
    loginService.getCenterList().then((res) => {
      callBack(res);
    })
  },


  handleData: function(res) {
    var that = this;
    function setFirstCenter(res, compareSelectId) {
      let firstCenter = res[0];
      var isSelectedIdNotAvailbale = compareSelectId ? that.data.selectedId != firstCenter.id : !that.data.selectedId;
      if (isSelectedIdNotAvailbale) {
        that.setData({
          centers: res,
          selectedId: firstCenter.id
        });
        that.saveCenterInfo(firstCenter);
      } else {
        that.setData({
          centers: res,
        });
      }
    }

    if (res.length == 1) {
      setFirstCenter(res, true);
      if (that.data.needBack == 'true') {
        that.data.tappedNum = 1;
        that.popBack();
      }
    } else if (res.length > 1) {
      setFirstCenter(res, false);
    }
  },
  selectCenter: function(e) {
    this.data.tappedNum += 1;
    let index = parseInt(e.currentTarget.id);
    let center = this.data.centers[index];
    if (center.id != this.data.selectedId) {
      this.saveCenterInfo(center);
      this.setData({
        selectedId: center.id
      });
    }
    this.popBack();
  },
  saveCenterInfo: function(center) {
    
    let info = {
      id: center.id,
      name: center.name,
      address: center.address,
      phone: center.phone,
      clubType: center.clubType,
      photo: center.photo,
      fullNumber: center.fullNumber ? center.fullNumber : '',
      mainCenter: center.mainCenter
    }
    app.globalData.selectCenter = info;
    storageUtil.saveSelectCenter(info);

    if (this.data.centers.length > 1) {
      loginService.getUserAccount().then((res) => {
        wx.setStorageSync('account', res.account);
      });
    }
  },
  getwxAppSetting() {
    var url = config.getwxAppSetting();
    requestUtil.getRequest(url).then(res => {
      console.log(res)
      // res.wxAppSetting.showOtherMerchandise = false
      var list = this.data.list
      if (!res.wxAppSetting.showOtherMerchandise) {
        list.splice(3, 1)
      }
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
      console.log(prevPage.route)
      list.map(item => {
        if (item.pagePath.indexOf(prevPage.route) > 0) {
          console.log(item.pagePath)
          prevPage.getTabBar().setData({
            list: list
          })
        }
      })
      this.popBack();
    })
  },

  popBack: function() {
    if (this.data.tappedNum == 1) {
      wx.navigateBack();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    this.$take('centerList');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    this.$take('centerList');
    if (!app.globalData.selectCenter) {
      app.globalData.account = null;
      app.globalData.token = null;
      app.globalData.openId = null;
      storageUtil.removeToken();
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})