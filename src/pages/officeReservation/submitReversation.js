// pages/groupCourse/groupOrder.js
var config = require('../../config.js')
var requestUtil = require('../../utils/requestUtil.js')
var buyCardService = require("../../service/buyCardService.js");
var systemMessage = require('../../SystemMessage.js');
var util = require('../../utils/util.js')
var loadingCalender = false;
var reserveInProcessing = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    course: null,
    trainer: null,
    time: null,
    dateStr: null,
    grids: null,
    grid: null,
    years: null,
    year: null,
    months: null,
    month: null,
    days: null,
    day: null,
    value: [0, 0, 0],
    showCalender: false,
    gridDate: null,
    isChecked: false,
    oneMonths: null,
    oneDay: null,
    timeEnd: "",
    trainerId:'',
    courseId:'',
    memberCardStr:'',
    memberCardSelectIndex:'',
    cardType:'',
    payPrice:'',
    contractId:'',
    cardItem:null,
    isNeedPay:false,
    needPayPrice:-999,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      dateStr: util.timestampToTimeStr(new Date()).substring(0, 10),
      trainerId: options.trainerId,
      courseId: options.courseId
    })
    let date = new Date()
    this.setData({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    })
    var that = this
    var url = config.officeReservePrivateCourseInfo(options.trainerId, options.courseId);
    requestUtil.getRequest(url).then(res => {
      that.setData({
        trainer:res
      })
      that.loadCalendar()
    })
  },
  toChooseCard:function(){
    wx.navigateTo({
      url: './officeMemberCard?courseId=' + this.data.courseId + '&trainerId=' + this.data.trainerId + '&contractId='+ this.data.contractId,
    })
  
  },
  loadCalendar: function () {
    this.setData({
      grids: null
    })
    var ts = new Date(this.data.dateStr.replace(/-/g, '/') + ' 00:00:00').getTime();
    loadingCalender = true;
    if (getApp().globalData.selectCenter.clubType!=4){
      var url = config.getCalendar(this.data.trainerId, ts)
    }else{
      var url = config.getStudioCalendar(this.data.trainerId, ts)
    }

    var that = this
    requestUtil.postRequest(url, null).then(res => {
      that.setData({
        grids: res
      })
      loadingCalender = false
    }).catch(res => {
      loadingCalender = false
    })
  },
  bindDateChange(e) {
    var date = e.detail.value
    var time = this.gettime(date)
    this.setData({
      year: time[0],
      month: time[1],
      day: time[2],
      dateStr: time[0] + '-' + time[1] + '-' + time[2]
    })
    this.loadCalendar()
  },
  reserve: function () {
    var that=this;
    if (reserveInProcessing) {
      return;
    }

    if (that.data.dateStr < util.timestampToTimeStr(new Date()).substring(0, 10)) {
      wx.showToast({
        title: '预约日期不能小于现在！',
        icon: 'none'
      })
      return
    }

    if (that.data.grid == null) {
      console.log(that.data.grid)
      wx.showToast({
        title: '请选择预约时间！',
        icon: 'none'
      })
      return
    }
    if (that.data.memberCardSelectIndex == '') {
      wx.showToast({
        title: '请选择会员卡！',
        icon: 'none'
      })
      return
    }
    reserveInProcessing = true;
    var endTime = util.formatTimec(that.data.grid.startTs + that.data.trainer.duration * 60000, "h:m");
    var url = config.officePrivateReserve();
    if (that.data.memberCardSelectIndex != -1 && that.data.memberCardSelectIndex != '') {
      that.setData({
        cardItem: that.data.trainer.cards[that.data.memberCardSelectIndex],

      })
    }
    wx.showToast({
      title: '预约中',
      icon: "loading"
    })
    var planData = that.data.grid.day+'';
    if (that.data.memberCardSelectIndex == -1) {
      var data = {
        courseId: that.data.courseId,
        trainerId: that.data.trainerId,
        date: planData.substring(0, 4) + '-' + planData.substring(4, 6) + '-' + planData.substring(6, 8),
        startTime: that.data.grid.display,
        endTime: endTime,
        traineeCards: [
          {
            costAmount: that.data.trainer.noCardFee,
            reserveNum: 1,
            contractId: -1
          }
        ]
      }
    }else{
      var data = {
        courseId: that.data.courseId,
        trainerId: that.data.trainerId,
        date: planData.substring(0, 4) + '-' + planData.substring(4, 6) + '-' + planData.substring(6, 8),
        startTime: that.data.grid.display,
        endTime: endTime,
        traineeCards:[
          {
            costAmount: that.data.cardItem.isPay ? that.data.cardItem.payPrice : (that.data.cardItem.cardType == 4 ? 1 : (that.data.cardItem.cardType == 3 ? 0 : that.data.cardItem.payPrice)),
            reserveNum: 1,
            contractId: that.data.cardItem.contractId
          }
        ]
      }
    }
    requestUtil.postRequest(url, data).then(res => {
      console.log(res)
      wx.hideLoading()
      reserveInProcessing = false;
      if (res == -1) {
        // 不需要支付 直接跳转至预约成功页面
        systemMessage.showToast('预约成功', 'success', 1000);
       setTimeout(function(){
         wx.redirectTo({
           url: '/pages/myReservations/reservationList/reservationList?pageType=2',
         });
       },1000)
      } else {
        // 需要支付 跳转至支付页面
        buyCardService.goBuyActivity(res, 1).then((rep) => {
          console.log(rep)
          buyCardService.goPay(rep, function (tradeNo) {
            systemMessage.showToast('购买成功', 'success', 1000);
            setTimeout(function () {
              wx.redirectTo({
                url: '/pages/myReservations/reservationList/reservationList',
              });
            }, 1000)
            return;
          })         
        }).catch((err) => {
          wx.hideLoading();
          reserveInProcessing = false;
        })
      }
    }).catch((err) => {
      console.log(err)
      wx.hideLoading();
      reserveInProcessing = false;
    })
  },
 
  chooseTime: function (e) {
    var ids = e.currentTarget.dataset.id;
    this.setData({
      grid: e.currentTarget.dataset.item,
      id: ids
    })
  },


  gettime(date) {
    date += ""
    date = new Date(date)
    var year = date.getFullYear()
    var month = this.getzreo(date.getMonth() + 1)
    var day = this.getzreo(date.getDate())

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    return [year, month, day]
  },
  getzreo(time) {
    time += ""
    return time[0] != 0 ? time : time.slice(1)
  },
  onShow(){
    var that=this;
    if (that.data.memberCardSelectIndex != ''){
      if(that.data.memberCardSelectIndex == -1) {
        that.setData({
          isNeedPay: true,
          needPayPrice: that.data.trainer.noCardFee,
          contractId:-1
        });
      }else{
        if(that.data.trainer.cards[that.data.memberCardSelectIndex].isPay) {
          that.setData({
            isNeedPay: true,
            needPayPrice: that.data.trainer.cards[that.data.memberCardSelectIndex].payPrice,
            contractId: that.data.trainer.cards[that.data.memberCardSelectIndex].contractId
          });
        }else{
          that.setData({
            isNeedPay: false,
            contractId: that.data.trainer.cards[that.data.memberCardSelectIndex].contractId
          });
        }
      }
    }else{
      that.setData({
        isNeedPay: false,
        contractId:-999
      });
    }
  }
})