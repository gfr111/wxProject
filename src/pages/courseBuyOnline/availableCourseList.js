// pages/courseBuyOnline/availableCourseList.js
var P = require('../../lib/wxpage.js');
var app = getApp();
var buyCardService = require("../../service/buyCardService.js");
P("courseBuyOnline/availableCourseList",{

  /**
   * 页面的初始数据
   */
  data: {
    courses:[],
    centerName: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('--------------')
    this.setData({
      centerName: app.globalData.selectCenter.name
    });
    this.refresh();
  },

  onNavigate: function(){
    this.preDataRequest();
  },

  preDataRequest: function () {
    var that = this;
    buyCardService.getSellCourses().then((res) => {
      that.$put('courseList', res.courses);
    })
  },
  refresh: function () {
    var res = this.$take('courseList');
    if (res) {
      this.setData({
        courses: res
      })
    }
    else {
      this.getData();
    }
  },
  getData: function () {
    if (app.globalData.token) {
      var that = this;
      buyCardService.getSellCourses().then((res) => {
        console.log('-'+JSON.stringify(res))
        that.setData({
          courses: res.courses
        })
      })
    }
  },
  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {

  }
})