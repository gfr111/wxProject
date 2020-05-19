// Cards.js
var app = getApp();
var login = require('../../service/loginService.js');
var systemMessage = require('../../SystemMessage.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentData: 0,
    swiperHeight:1200,
    effectiveClass: [],//有效课
    failureClass: [],//失效课
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },

  getData: function () {
    if (app.globalData.token) {
      var that = this;
      that.dataRequest(function (res) {
        var effective = []
        var failure = []
        if (res.length > 0) {
          res.map((item,index)=>{
            if (item.status == 1 && item.remainCount>0){
              effective.push(item)
            }else{
              failure.push(item)
            }
          })
        }
        that.setData({
          effectiveClass: effective,
          failureClass: failure,
        })
      })
    }
  },

  dataRequest: function (callBack) {
    login.getUserCourseList().then((res) => {
      callBack(res);
    })
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      path: "/pages/mine/mine"
    }
  },




  /******页面点击事件******/

  //滑动页面切换导航栏
  swiperChange: function (e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },

  //导航栏点击切换
  seledtCurrent: function (e) {
    const that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current
      })
    }
  },

  //私教课详情
  toCourseDeatail: function (e) {
    var seleinfo = e.currentTarget.dataset.seleinfo
    wx.navigateTo({
      url: '/pages/index/courseDetial?deposits=' + JSON.stringify(seleinfo),
    })
  },

})
