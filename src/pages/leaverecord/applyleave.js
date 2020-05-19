// pages/leaverecord/applyleave.js

var centerService = require('../../service/centerService.js');

const date = new Date();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    contractId: null,//卡的id
    remark: "",//请假理由
    timeBegin: '',//开始时间
    timeEnd: '',//结束时间
    pickerStart: '',//时间开始区间
    pickerEnd: '',//时间结束区间
    idx: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var year = date.getFullYear()
    var month = date.getMonth()
    var day = date.getDate()

    console.log('----66---', year, month, day);
    //设置默认的年份
    this.setData({
      pickerStart: '' + year + '-' + parseInt(month+1) + '-' + day,
      pickerEnd: '' + parseInt(year + 2) + parseInt(month + 1) + '-' + day,
      contractId: options.contractId
    })
    console.log('----日期---', this.data.pickerStart);
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



  /*********时间选择器*********/
  bindDateChange: function(e){
    var that = this
    console.log('---选择的---', e);
    var idx = e.currentTarget.dataset.idx
    if (idx == '1'){
      that.setData({
        timeBegin: e.detail.value
      })
    }else{
      that.setData({
        timeEnd: e.detail.value
      })
    }
  },


  /********页面事件********/

  remarkChange: function(e){
    var that = this
    that.setData({ remark: e.detail.value })
  },

  commit: function(){
    var that = this;
    var time3 = Date.parse(that.data.timeBegin)
    var time4 = Date.parse(that.data.timeEnd)
    if (parseInt(time3) > parseInt(time4)){
      wx.showToast({
        title: '结束时间不能小于开始时间',
        icon: 'none'
      })
      return
    }
    var data = { 
      "endDate": that.data.timeEnd,
      "startDate": that.data.timeBegin,
      "remark": that.data.remark
    }
    var pages = getCurrentPages();
    
    centerService.cardPause(that.data.contractId, data).then((res) => {
      console.log('---结果---', res);
      wx.showToast({
        title: '提交成功',
        icon: 'none'
      })
      setTimeout(function () {
        if (pages.length > 1) {
          var prePage = pages[pages.length - 2];
          prePage.changeData(that.data.contractId, res.remainFreeLeaveDays);
          wx.navigateBack({});
        }
      }, 300)
    })
  },


})