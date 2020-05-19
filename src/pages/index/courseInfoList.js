// pages/index/courseInfoList.js

var util = require('../../utils/util.js')
var centerService = require("../../service/centerService.js");
var imgUrl = require("../../utils/uiUtils/imgUrl.js")


Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: null,
    depositId: null,
    teachList: [],//教练数据
    centerList: [],//场馆数据
    ismodel:false,
  },
  showModel(){
    this.setData({
      ismodel:true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var type = options.type
    var depositId = options.depositId
    this.setData({ type: type, depositId: depositId})
    if (type == 11){
      wx.setNavigationBarTitle({
        title: '适用场馆',
      })
      this.getCenter(depositId)//适用场馆
    }else{
      wx.setNavigationBarTitle({
        title: '授课教练',
      })
      this.getTeaching(depositId)//授课教练
    }
  },

  /******页面点击事件******/

  //适用场馆
  getCenter: function (depositId){
    centerService.getUsableCenterDetails(depositId).then((res) => {
      if (res.length > 0) {
        for (var i = 0; i < res.length; i++) {
          var photo = imgUrl.getDefaultSpace(res[i].photo)
          res[i].photo = photo
        }
      }
      this.setData({ centerList: res})
    })
  },

  //授课教练
  getTeaching: function (depositId){
    centerService.getCourseTrainerDetails(depositId).then((res) => {
      if (res.length>0){
        for (var i = 0; i < res.length; i++){
          var photo = imgUrl.getDefaultAvatar(res[i].photo)
          res[i].photo = photo
        }
      }
      this.setData({ teachList: res })
    })
  },

  callSome: function (e) {
    console.log(e.target.dataset.phone)
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.phone,
    })

  },

})