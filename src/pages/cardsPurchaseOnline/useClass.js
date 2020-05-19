// pages/cardsPurchaseOnline/useClass.js
var centerService = require("../../service/centerService.js");
var requestUtil = require('../../utils/requestUtil.js');
var buyCardService = require("../../service/buyCardService.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,//控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: [],//下拉列表的数据
    index: 0,//选择的下拉列表下标
    course:[],
    carId:"",
    selectFirst:"",
    centerId:'',
    buy:''
  },
  // 点击下拉显示框
  selectTap() {
    // this.setData({
    //   show: !this.data.show
    // });

    wx.navigateTo({
      url: '/pages/cardsPurchaseOnline/changeclub/changeclub?id='+this.data.carId+'&center='+this.data.centerId+'&buy='+this.data.buy,
    })
  },
  // 点击下拉列表
  optionTap(e) {
    var that=this;
    let Index = e.currentTarget.dataset.index;//获取点击的下拉列表的下标
    let id = e.currentTarget.dataset.id
    that.setData({
      index: Index,
      show: !that.data.show
    });
    var carId = that.data.carId;
    if (that.data.buy=='true') {
      var func = buyCardService.getusefulCourseV2;
    } else {
      var func = buyCardService.getusefulCourse;
    }
    func(id, carId).then((res) => {
      that.setData({
        course: res.courses,
        selectData: res.centers,
        selectFirst: e.currentTarget.dataset.name
      })
    })
   
    // console.log(e)
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var centerId = app.globalData.selectCenter.id
    that.setData({
      carId: options.id,
      centerId:centerId,
      buy: options.buy
    })
    if (options.buy=='true'){
      var func = buyCardService.getusefulCourseV2;
    }else{
      var func = buyCardService.getusefulCourse;
    }

    func(centerId,options.id).then((res) => {
      that.setData({
         course:res.courses,
         selectData:res.centers
      })
      var selectFirst=""
      for (var i = 0; i < res.centers.length;i++){
        if (res.centers[i].id == centerId){
          that.setData({
            selectFirst: res.centers[i].name
          })
        }
      }
    })
  },

})