// pages/index/courseConsume.js

var app = getApp();
var util = require('../../utils/util.js')
var centerService = require("../../service/centerService.js");
var imgUrl = require("../../utils/uiUtils/imgUrl.js")


Page({

  /**
   * 页面的初始数据
   */
  data: {
    seleInfo: null,
    signList: [],
    num: null,
    height: null,
    centerId: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var centerId = app.globalData.selectCenter.id;
    that.setData({
       seleInfo: JSON.parse(options.seleinfo), 
       centerId: centerId
       })
    centerService.getCourseConsume(centerId, that.data.seleInfo.depositId).then((res) => {
      if (res.histories.length > 0) {
        res.histories.map(item=>{
          item.completedTime = this.getdate(item.completedTime)
        })
      }
      that.setData({
        signList: res.histories,
        num: res.total
      })
    })
  },
  getdate(time){
    console.log(new Date(time))
    var date=new Date(time),
    year=date.getFullYear(),
      month = this.addzero(date.getMonth() + 1),
      day = date.getDate(),
      hour = date.getHours(),
      minute = this.addzero(date.getMinutes())
      console.log(year,month,day,hour,minute)
    return  year+'.'+ month+'.' + day+'&nbsp;&nbsp;'+hour+':'+minute
  },
  addzero(time) {
    return time = time > 10 ? time : "0" + time
  },
})