// pages/integral/integral.js
const centerServices = require("../../service/centerService.js");
var app = getApp();
var config = require("../../config.js")
var requestUtil = require('../../utils/requestUtil.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalScore: null, //总分
    list: [],
    active: false,
    centerName: '',
    type: ['全部', '签到', '消费', '其他'],
    typeIndex: 0,
    showmodel: false,
    rulesModel: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getscoreRule()
    this.getyear()
    this.reqpoint()
  },
  // 获取现在的年月
  getyear(time) {
 
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    month = month > 9 ? month : '0' + month
    var s = []
    if (time) {
      time = time.split('/')


      s.push(time[1], time[2])
      return s
    } else {
      s.push(year, month)
      this.setData({
        year: s,
        now:s
      })
    }
  },


  reqpoint() {
    var data = {
      month:this.data.year.join(''),
      scoreTypeId: this.data.typeIndex==0?-1:this.data.typeIndex,
      pageIndex: 0,
      pageSize: 500,
    }
    centerServices.pointRequest(data).then((res) => {
      res.scoreList.map(item=>{
        item.createTime = this.getyear(item.timeStr).join('月')+'日'
        item.isadd = item.changeValue>0?true:false
        item.changeValue = Math.abs(item.changeValue) 
      })
      this.setData({
        // 获取数据
        totalScore: res.totalScore,
        list: res.scoreList,
        active: res.active
      })
    })
  },
  showrules() {
    this.setData({
      rulesModel: true
    })

  },
  getscoreRule() {
    var url = config.getscoreRule()
    requestUtil.getRequest(url).then(res => {
      this.setData({
        rules: res
      })
    })

  },
  model(e) {
    console.log(e)
    var index = e.currentTarget.id
    this.setData({
      showmodel: index == 1 ? true : false,
      rulesModel: false
    })
  },
  choosetype(e) {
    this.setData({
      typeIndex: e.currentTarget.id,
      showmodel: false
    })
    this.reqpoint()
  },
  year(e) {
    this.setData({
      year: e.detail.value.split('-')
    })
    this.reqpoint()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  intoNow: function() {
    wx.navigateTo({
      url: '/pages/integral/integralChange',
    })
  },
  intoshop(){
    wx.navigateTo({
      url: '/pages/shop/merchandiseList',
    })
  }
})