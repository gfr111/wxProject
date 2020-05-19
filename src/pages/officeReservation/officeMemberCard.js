// pages/groupCourse/memberCard/memberCard.js

var util = require('../../utils/util.js');
var config = require('../../config.js')
var requestUtil = require('../../utils/requestUtil.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    header: 0,
    item: [],
    showcardData: [],
    cardData: [],
    contractId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      item: options,
      contractId: options.contractId
    })
    this.getCourseDetail(options.trainerId, options.courseId)
  },

  // 获取课程详情
  getCourseDetail(trainerId, courseId) {
    var url = config.officeReservePrivateCourseInfo(trainerId, courseId);
    requestUtil.getRequest(url).then(res => {
      if (!res.cards) {
        res.cards = []
      }
      this.setData({
        cardData: res,
        showcardData: res.cards
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
      url: '/pages/groupCourse/cardType/cardType?instanceId=' + item.trainerId + '&courseId=' + item.courseId,
    })
  },


  getonecard(e) {
    var id = e.currentTarget.id
    var name = id == -1 ? "无卡" : e.currentTarget.dataset.name
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      memberCardStr: name,
      memberCardSelectIndex: id
    })
 
    wx.navigateBack({})
  },
})