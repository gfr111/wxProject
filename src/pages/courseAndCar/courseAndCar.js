
// pages/cardsPurchaseOnline/availableCardsList.js
var app = getApp();
var systemMessage = require("../../SystemMessage.js");
var buyCardService = require("../../service/buyCardService.js");
var authenticationUtil = require("../../utils/authenticationUtil.js");
var P = require('../../lib/wxpage.js');
var loginService = require('../../service/loginService.js');
P("courseAndCar/courseAndCar", {

  /**
   * 页面的初始数据
   */
  data: {
    cards: [],
    course:[],
    centerName: "",
    currentData: 0,
    listHeight: "",
    clubType:''
  },
  //页面间跳转开始时调用，此时本页面并未被加载
  onNavigate: function (res) {
    this.preDataRequest();
  },
  preDataRequest: function () {
    var that = this;
    that.dataRequest(function (res) {
      that.$put('cardsList', res);
    })
    buyCardService.getSellCourses().then((res) => {
      that.$put('courseList', res.courses);
    })
  },
  dataRequest: function (callBack) {
    buyCardService.getSellCards().then((res) => {
      // console.log(res)
      callBack(res.cards);
    })
  },
  //获取当前滑块的index
  bindchange: function (e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    const that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {

      that.setData({
        currentData: e.target.dataset.current
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    authenticationUtil.checkAuth(res=>{
      if (options.centerId) {
        app.globalData.selectCenter = {
          id: options.centerId
        }
        loginService.getCenterList().then((res) => {
          res.map(item => {
            if (item.id == options.centerId) {
              app.globalData.selectCenter = item
              console.log(app.globalData.selectCenter)
              wx.setStorageSync('selectCenterKey', item)
              this.setData({
                selectCenter: item
              })
            }
          })
     
          this.refresh();
        })
      }else{
        this.refresh();
      }
      this.setData({
        currentData: options.a,
        centerName: app.globalData.selectCenter.name
      });
     
    })
    var that=this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          listHeight: res.windowHeight-50
        })
      }
    })
  },
  refresh: function () {
    var res = this.$take('cardsList');
    if (res) {
      this.setData({
        cards: res
      })
    }
    else {
      this.getData();
    }
    var res = this.$take('courseList');
    if (res) {
      this.setData({
        courses: res
      })
    }
    else {
      this.getDatas();
    }
  },
  getDatas: function () {

      var that = this;
      buyCardService.getSellCourses().then((res) => {
        // console.log(res)
        // console.log('-' + JSON.stringify(res))
        that.setData({
          courses: res.courses
        })
      })

  },
  getData: function () {

      var that = this;
      that.dataRequest(function (res) {
        that.setData({
          cards: res
        })
      })

  },
  onShow: function () {
   this.setData({
     clubType:app.globalData.selectCenter.clubType
   })
    if (app.globalData.selectCenter.clubType==4){
     wx.setNavigationBarTitle({
       title: '购卡'
     })
   }else{
      wx.setNavigationBarTitle({
        title: '购卡购课'
      })
   }
  },
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {

  }
})