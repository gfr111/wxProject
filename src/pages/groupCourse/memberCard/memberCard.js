// pages/groupCourse/memberCard/memberCard.js

var appointment = require('../../../service/groupCourseAppoint.js')
var systemMessage = require('../../../SystemMessage.js');
var util = require('../../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    header: 0,
    item: [],
    showcardData: [],
    cardData: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      item: options
    })
    this.getCourseDetail(options.centerId,options.instanceId, options.courseId)
  },

  // 获取课程详情
  getCourseDetail(centerId,instanceId, courseId) {
    console.log(centerId)
    appointment.getGroupCourseDetail(centerId,instanceId, courseId).then((res) => {
      if(!res.cards){
        res.cards=[]
      }
      if (!res.disableCards){
        res.disableCards=[]
      }
      var len =res.cards.length+res.disableCards.length
      this.setData({
        cardData: res,
        showcardData: res.cards,
        len:len
      })
    })
  },
  changeheader(e) {
    var cardData = this.data.cardData
    var id = e.currentTarget.id
    var card = id == 1 ? cardData.disableCards : cardData.cards
    this.setData({
      header: id,
      showcardData: card
    })
  },
  tocardType() {
    var item = this.data.item
    wx.navigateTo({
      url: '../cardType/cardType?instanceId=' + item.instanceId + '&courseId=' + item.courseId + '&centerId=' + item.centerId,
    })
  },


  getonecard(e) {
    var id = e.currentTarget.id
    var name = id == -1 ? "无卡" : id == -2?'普通会员': e.currentTarget.dataset.name
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      memberCardStr: name,
      memberCardSelectIndex: id,
    })
    wx.navigateBack({})
  },
})