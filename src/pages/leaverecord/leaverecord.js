// pages/leaverecord/leaverecord.js

var centerService = require('../../service/centerService.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    swpPic: [],
    currentItemId: 0,
    card: [],
    listData: [],
    shoeMore: false,
    type: 0, //0:没有请假机会；1:还有请假机会。
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.getData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },



  /***********页面事件***********/
  
  swiperChange: function (e) {
    var currentItemId = e.detail.currentItemId;
    this.setData({
      currentItemId: currentItemId,
      card: this.data.swpPic[currentItemId]
    })
    if (this.data.card.remainFreeLeaveDays != 0 && this.data.card.remainFreeLeaveCount != 0) {
      this.setData({ type: 1 })
    } else { this.setData({ type: 0 }) }
    var swpPic = this.data.swpPic
    this.getListData(swpPic[currentItemId].contractId)
  },
  clickChange: function (e) {
    var itemId = e.currentTarget.dataset.itemId;
    this.setData({
      currentItemId: itemId,
      card: this.data.swpPic[itemId]
    })
    if (this.data.card.remainFreeLeaveDays != 0 && this.data.card.remainFreeLeaveCount != 0) {
      this.setData({ type: 1 })
    } else { this.setData({ type: 0 }) }
  },

  getData: function () {
    var that = this
    centerService.getLeaveRecord().then((res) => {
      console.log( '---结果---', res);
      that.setData({
        swpPic: res.cards,
        card: res.card
      })
      if (that.data.swpPic.length>0){
        if (that.data.card.remainFreeLeaveDays != 0 && that.data.card.remainFreeLeaveCount != 0){
          that.setData({type:1})
        } else { that.setData({ type: 0 })}
        this.getListData(res.card.contractId)
      }
    })
  },

  getListData: function (contractId){
    console.log('---参数---', contractId);
    var that = this
    centerService.chooseCardLeaveRecord(contractId).then((res) => {
      console.log('---结果---', res);
      if (res.length>3){
        that.setData({
          listData: res.slice(0, 3)
        })
      }else{
        that.setData({
          listData: res
        })
      }
      
      if (that.data.listData.length > 3) {
        that.setData({ shoeMore: true })
      }
    })
  },

  showMore: function () {
    this.getList();
  },

  getList: function(){
    var that = this;
    centerService.chooseCardLeaveRecord(contractId).then((res) => {
      that.setData({
        listData: res,
        shoeMore: false
      })
    })
  },

  applyClick: function(){
    wx.navigateTo({
      url: '/pages/leaverecord/applyleave?contractId=' + this.data.card.contractId,
    })
  },

  changeData: function (contractId, remainFreeLeaveDays){
    var that = this;
    var card = that.data.card
    card.remainFreeLeaveDays = remainFreeLeaveDays
    card.remainFreeLeaveCount = card.remainFreeLeaveCount-1
    centerService.chooseCardLeaveRecord(contractId).then((res) => {
      that.setData({
        listData: res,
        shoeMore: false,
        card: card
      })
    })
  }


})