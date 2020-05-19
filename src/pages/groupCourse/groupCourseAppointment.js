// pages/groupCourse/groupCourseAppointment.js
var appointment = require('../../service/groupCourseAppoint.js')
var systemMessage = require('../../SystemMessage.js');
var util = require('../../utils/util.js');
var buyCardService = require("../../service/buyCardService.js");
var requestUtil = require('../../utils/requestUtil.js')
var config = require('../../config.js')
var P = require('../../lib/wxpage.js');
var headOfficeService = require("../../service/headOfficeService.js");
var reserveInProcessing = false;
P("groupCourse/groupCourseAppointment", {

  /**
   * 页面的初始数据
   */
  data: {
    item: {},
    courseDetail: '',
    courseInforArray: [],
    seatTitle: '', // 分配座位内容
    showMemberCardView: false, // 显示会员卡
    memberCardList: [], // 会员卡列表
    memberCardSelectIndex: 0, // 当前选中会员卡的下标
    memberCardScrollViewHeight: 0, // 会员卡view的高度
    memberCardStr: '', // 已选中的会员卡
    showSeatView: false, // 是否显示座位选择
    seatViewHeight: 0,
    seatArray: [],
    maxSelectSeatCount: 0,
    currentSeatSelectArray: [],
    lastSeatArray: [],
    payPrice: 0,
    viewHeight: 0,
    cancelTime: null,
    _num: null,
    brokenSeat: null,
    clubType: '',
    minutes: '',
    courseType: "",
    couponList:[],
    allPricre:'',
    discountPrice:'',
    realPrice:'',
    coupon:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   
    let item = JSON.parse(options.item);
    // console.log(item)
    this.setData({
      item: item,
      courseType: JSON.parse(options.item).courseType
    });
    this.getCourseDetail(item.centerId, item.instanceId, item.courseId);
    this.getCoupon();
    var that = this;
    wx: wx.getSystemInfo({
      success: function(res) {
        that.setData({
          viewHeight: res.windowHeight
        })
      },
    })
  },
  totrainer() {
    wx.navigateTo({
      url: '/pages/trainers/trainerDetail?id=' + this.data.item.trainerId + '&centerId=' + this.data.item.centerId + '&fromPage=league'
    })
  },
  toCourseDetail(e) {
    wx.navigateTo({
      url: '../groupclassDetail/groupclassDetail?instance=' + e.currentTarget.dataset.instanceid,
    })
  },
  // 获取优惠券
  getCoupon() {
    headOfficeService.getUsableCoupon(8).then((res) => {
      var arr = [];
      for (var i = 0, len = res.length; i < len; i++) {
        if (res[i].amountLimit <= this.data.payPrice) {
          arr.push(res[i])
        }
      }
      // console.log(arr)
      this.setData({
        couponList: arr
      })
    })
  },
  // 获取课程详情
  getCourseDetail: function(centerId, instanceId, courseId) {
    var that = this;
    appointment.getGroupCourseDetail(centerId, instanceId, courseId).then((result) => {
      if (result != null) {
        var brokenSeat = result.brokenSeatNums
        if (brokenSeat != null) {
          var dateList = brokenSeat.split(";");
          var arr = []
          for (var i in dateList) {
            arr = arr.concat(dateList[i]);
          }
        } else {
          var arr = []
        }

        var courseInforArr = appointment.getCourseInfor(result);
        var seatArray = [];
        if (result.seatEnabled) {
          that.getSeatArray(instanceId);
        } else {
          seatArray = [0];
        }
        if (!result.cards) {
          result.cards = []
        }
        if (result.isNoEffectiveMember && result.isNoEffectiveCard != null && result.isNoEffectiveCard && result.noEffectiveCardFee != null) {
          result.cards.push({
            "cardId": -2,
            "cardName": '普通会员',
            "cardType": -1,
            "isPay": true,
            "payPrice": result.noEffectiveCardFee,
            "maxGroupCourseReservedCount": 1
          });
        }
        if (result.isNoCard != null && result.isNoCard && result.noCardFee != null) {
          result.cards.push({
            "cardId": -1,
            "cardName": '无卡',
            "cardType": -1,
            "isPay": true,
            "payPrice": result.noCardFee,
            "maxGroupCourseReservedCount": 1
          });
        }

        that.setData({
          courseDetail: result,
          courseInforArray: courseInforArr,
          seatTitle: appointment.getSeatDetailStr(result),
          seatViewHeight: appointment.getSeatViewHeight(result),
          memberCardList: result.cards,
          memberCardStr: result.cards && result.cards[0] ? result.cards[0].cardName : '暂无可用卡',
          maxSelectSeatCount: result.cards && result.cards[0] ? result.cards[0].maxGroupCourseReservedCount : 1,
          payPrice: result.cards && result.cards[0] ? appointment.getPayPrice(result.cards[0], seatArray.length) : null,
          allPricre: result.cards && result.cards[0] ? appointment.getPayPrice(result.cards[0], seatArray.length) : null,
          realPrice: result.cards && result.cards[0] ? appointment.getPayPrice(result.cards[0], seatArray.length) : null,
          currentSeatSelectArray: seatArray,
          brokenSeat: arr
        });
      } else {
        that.setData({
          courseDetail: null
        });
      }
    }, (error) => {

    })

  },


  // 获取座位信息
  getSeatArray: function(instanceId) {
    var that = this;
    appointment.getSeatArray(instanceId).then((result) => {
      var seatArray = appointment.getSeatInforArray(that.data.courseDetail.seatCount, result)
      for (let i = 0; i < that.data.brokenSeat.length; i++) {
        for (let j = 0; j < seatArray.length; j++) {
          if (that.data.brokenSeat[i] == j + 1) {
            seatArray[j].selectStatus = 2
          }
        }
      }
      that.setData({
        seatArray: seatArray
      });
    })
  },

  toPay: function() {
    var that = this;
    if (this.data.courseType != 4) {
      if (this.data.courseType == 8) {
        if (this.data.memberCardList.length <= 0) {
          wx.showToast({
            title: '请选择会员卡',
            icon: "none"
          })
          return
        }
        appointment.appointmentConfirm(this.data.courseDetail, this.data.memberCardList[this.data.memberCardSelectIndex], this.data.currentSeatSelectArray, this.data.payPrice,this.data.coupon == null ? null : this.data.coupon.id).then((result) => {
          if (result == -1) {
            // 不需要支付 直接跳转至预约成功页面
            systemMessage.showToast('预约成功', 'success', 1000);
            this.$redirect('/pages/myReservations/reservationList/reservationList');
          } else {
            // 需要支付 跳转至支付页面
            wx.redirectTo({
              url: '../myReservations/reservationDetail/reservationPayment/createPayment/createPayment?orderId=' + result,
            });
          }
        }, (error) => {
          that.getCourseDetail(null,that.data.item.instanceId, that.data.item.courseId);
          that.getSeatArray(that.data.courseDetail.instanceId);
        })
      } else {
        if (this.data.currentSeatSelectArray.length == 0) {
          systemMessage.showModal('', '还未选择座位');
        } else {
          if (this.data.memberCardList.length <= 0) {
            wx.showToast({
              title: '请选择会员卡',
              icon: "none"
            })
            return
          }
          appointment.appointmentConfirm(this.data.courseDetail, this.data.memberCardList[this.data.memberCardSelectIndex], this.data.currentSeatSelectArray, this.data.payPrice,this.data.coupon == null ? null : this.data.coupon.id).then((result) => {

            if (result == -1) {
              // 不需要支付 直接跳转至预约成功页面
              systemMessage.showToast('预约成功', 'success', 1000);
              this.$redirect('/pages/myReservations/reservationList/reservationList');
            } else {
              // 需要支付 跳转至支付页面
              wx.redirectTo({
                url: '../myReservations/reservationDetail/reservationPayment/createPayment/createPayment?orderId=' + result,
              });
            }
          }, (error) => {
            that.getCourseDetail(null,that.data.item.instanceId, that.data.item.courseId);
            that.getSeatArray(that.data.courseDetail.instanceId);
          })
        }
      }
    } else {
      var cardMess = that.data.memberCardList[that.data.memberCardSelectIndex];
      if (cardMess.cardId == -1) {
        var data = {
          courseId: that.data.item.courseId,
          date: that.data.courseDetail.date,
          endTime: that.data.courseDetail.endTime,
          startTime: that.data.courseDetail.startTime,
          trainerId: that.data.item.trainerId,
          traineeCards: [{
            contractId: -1,
            costAmount: cardMess.payPrice,
            reserveNum: 1,
          }],
          couponInstanceId: that.data.coupon == null ? null : that.data.coupon.id
        }
      } else {
        var data = {
          courseId: that.data.item.courseId,
          date: that.data.courseDetail.date,
          endTime: that.data.courseDetail.endTime,
          startTime: that.data.courseDetail.startTime,
          trainerId: that.data.item.trainerId,
          traineeCards: [{
            contractId: cardMess.contractId,
            costAmount: cardMess.isPay ? cardMess.payPrice : (cardMess.cardType == 4 ? 1 : (cardMess.cardType == 3 ? 0 : cardMess.payPrice)),
            reserveNum: 1,
          }],
          couponInstanceId: that.data.coupon == null ? null : that.data.coupon.id
        }
      }
      var url = config.officePrivateReserve(that.data.item.instanceId);
      if (!reserveInProcessing) {
        reserveInProcessing = true;
        requestUtil.postRequest(url, data).then(res => {
          wx.hideLoading()
          reserveInProcessing = false;
          if (res == -1) {
            // 不需要支付 直接跳转至预约成功页面
            systemMessage.showToast('预约成功', 'success', 1000);
            setTimeout(function() {
              wx.redirectTo({
                url: '/pages/myReservations/reservationList/reservationList',
              });
            }, 1000)
          }
        })
      }
    }
  },
  // 选择可用会员卡 
  selectMemberCard: function() {
    let item = this.data.item
    wx.navigateTo({
      url: './memberCard/memberCard?centerId=' + item.centerId + '&instanceId=' + item.instanceId + '&courseId=' + item.courseId,
    })
  },

  // 选择座位
  showSelectSeat: function() {
    if (this.data.memberCardList.length <= 0) {
      wx.showToast({
        title: '请选择会员卡',
        icon: "none"
      })
      return
    }

    //  判断是否是第一次选择
    if (this.data.currentSeatSelectArray.length == 0) {
      this.setData({
        lastSeatArray: this.data.seatArray,
        showSeatView: true
      });
    } else {
      // 如果不是第一次选择，在目前的座位中寻找已经选择的座位，改变其样式
      for (let i = 0; i < this.data.currentSeatSelectArray.length; i++) {
        for (let j = 0; j < this.data.seatArray.length; j++) {
          if (this.data.currentSeatSelectArray[i] == j) {
            this.data.seatArray[j].selectStatus = 1
          }
        }
      }
      this.setData({
        seatArray: this.data.seatArray,
        showSeatView: true
      });
    }
  },

  selectSeatCancel: function() {
    var that = this;
    appointment.getCurrentSeatSelectArray(that.data.lastSeatArray, function(currentSeatSelectArray, seatTitle) {
      that.setData({
        showSeatView: false,
        seatArray: that.data.lastSeatArray,
        currentSeatSelectArray: currentSeatSelectArray,
        seatTitle: seatTitle
      })
    });
  },

  seatSelectConfirm: function() {
    var that = this;
    appointment.getCurrentSeatSelectArray(this.data.seatArray, function(currentSeatSelectArray, seatTitle) {
      that.setData({
        showSeatView: false,
        currentSeatSelectArray: currentSeatSelectArray,
        payPrice: appointment.getPayPrice(that.data.memberCardList[that.data.memberCardSelectIndex], currentSeatSelectArray.length),
        allPricre: appointment.getPayPrice(that.data.memberCardList[that.data.memberCardSelectIndex], currentSeatSelectArray.length),
        realPrice: appointment.getPayPrice(that.data.memberCardList[that.data.memberCardSelectIndex], currentSeatSelectArray.length),
        seatTitle: seatTitle
      })

    });
  },

  selectSeat: function(event) {
    var that = this;
    appointment.seatSelect(this.data.seatArray, this.data.maxSelectSeatCount, event, this.data.currentSeatSelectArray, function(seatArray) {
      that.setData({
        seatArray: seatArray,
      })
    });
  },
  //自己的选择座位
  selectSeats: function(e) {
    var that = this
    var index = e.currentTarget.dataset.index - 1
    // 当只能选择一个座位的时候
    if (that.data.maxSelectSeatCount == 1) {
      that.setData({
        _num: index,
        seatTitle: e.currentTarget.dataset.index,
        currentSeatSelectArray: [e.currentTarget.dataset.index - 1]
      })
    } else {
      //可以选择多个座位
      var chooseSeat = true
      if (that.data.currentSeatSelectArray.length >= that.data.maxSelectSeatCount) {
        for (let i = 0; i < that.data.currentSeatSelectArray.length; i++) {
          if (index == that.data.currentSeatSelectArray[i]) {
            chooseSeat = false;
            continue;
          }
        }
        if (chooseSeat) {
          return
        }
      }
      if (that.data.seatArray[index].selectStatus == 0) {
        that.data.seatArray[index].selectStatus = 1
      } else if (that.data.seatArray[index].selectStatus == 1) {
        that.data.seatArray[index].selectStatus = 0
      }
      //判断当前选择的页面选中的座位是不是大于可选择的座位
      var oneArray = []
      for (let i = 0; i < that.data.seatArray.length; i++) {
        if (that.data.seatArray[i].selectStatus == 1) {
          oneArray.push(that.data.seatArray[i])
        }
      }
      // 一旦选中项大于可选的座位就直接返回
      if (oneArray.length > that.data.maxSelectSeatCount) {
        return
      } else {
        that.setData({
          seatArray: that.data.seatArray,
        })
        // 在座位列表中查找选中的选项
        var currentSeatSelectArray = []
        var seatTitle = ''
        for (var i = 0; i < that.data.seatArray.length; i++) {
          var item = that.data.seatArray[i]
          if (item.selectStatus == 1) {
            currentSeatSelectArray.push(i)
            if (seatTitle == '') {
              seatTitle = (i + 1)
            } else {
              seatTitle = seatTitle + ',' + (i + 1)
            }
          }
        }
      }
      // 设置最后提交的值
      that.setData({
        currentSeatSelectArray: currentSeatSelectArray,
        seatTitle: seatTitle
      })

    }
  },

  seatSelectConfirms: function() {
    var that = this;
    appointment.getCurrentSeatSelectArray(this.data.seatArray, function(currentSeatSelectArray, seatTitle) {
      that.setData({
        showSeatView: false,
        currentSeatSelectArray: that.data.currentSeatSelectArray,
        payPrice: appointment.getPayPrice(that.data.memberCardList[that.data.memberCardSelectIndex], that.data.currentSeatSelectArray.length),
        allPricre: appointment.getPayPrice(that.data.memberCardList[that.data.memberCardSelectIndex], that.data.currentSeatSelectArray.length),
        realPrice: appointment.getPayPrice(that.data.memberCardList[that.data.memberCardSelectIndex], that.data.currentSeatSelectArray.length),
        seatTitle: that.data.seatTitle,
        seatArray: that.data.lastSeatArray
      })
    });
  },
  // 预约人数减少
  seatSelectNumReduce: function() {
    var seatSelectArray = this.data.currentSeatSelectArray;
    seatSelectArray.splice(0, 1);
    this.setData({
      currentSeatSelectArray: seatSelectArray,
      payPrice: appointment.getPayPrice(this.data.memberCardList[this.data.memberCardSelectIndex], seatSelectArray.length),
      realPrice: appointment.getPayPrice(this.data.memberCardList[this.data.memberCardSelectIndex], seatSelectArray.length),
      allPricre: appointment.getPayPrice(this.data.memberCardList[this.data.memberCardSelectIndex], seatSelectArray.length)
    });
  },

  // 预约人数增加
  seatSelectNumAdd: function() {
    var seatSelectArray = this.data.currentSeatSelectArray;
    seatSelectArray.push(0);
    this.setData({
      currentSeatSelectArray: seatSelectArray,
      payPrice: appointment.getPayPrice(this.data.memberCardList[this.data.memberCardSelectIndex], seatSelectArray.length),
      allPricre: appointment.getPayPrice(this.data.memberCardList[this.data.memberCardSelectIndex], seatSelectArray.length),
      realPrice: appointment.getPayPrice(this.data.memberCardList[this.data.memberCardSelectIndex], seatSelectArray.length)
    });
  },
  toCoupon() {
    var id = this.data.coupon ? this.data.coupon.id : -1;
    wx.navigateTo({
      url: '/pages/tickets/newCouponList?id=' + id + '&type=8' + '&price=' + this.data.payPrice,
    })
  },
  onShow() {
    this.setData({
      clubType: getApp().globalData.selectCenter.clubType
    })
    // 在选择无卡预定的时候，idx=-1
    var len = this.data.memberCardList && this.data.memberCardList.length > 0 ? this.data.memberCardList.length : -1
    if (len < 0) {
      return
    }

    if (this.data.memberCardSelectIndex <= -1) {
      var courseDetail = this.data.courseDetail

      if (courseDetail.isNoEffectiveMember && courseDetail.isNoEffectiveCard && courseDetail.isNoCard) {
        var index = this.data.memberCardSelectIndex == -1 ? 1 : 2
      } else {
        var index = 1
      }

      this.setData({
        memberCardSelectIndex: len - index,
        payPrice: this.data.memberCardList[len - index].payPrice,
        allPricre: this.data.memberCardList[len - index].payPrice,
        realPrice: this.data.memberCardList[len - index].payPrice
      })
    } else if (this.data.memberCardList[this.data.memberCardSelectIndex] && this.data.memberCardList[this.data.memberCardSelectIndex].isPay) {
      this.setData({
        payPrice: this.data.memberCardList[this.data.memberCardSelectIndex].payPrice,
        allPricre: this.data.memberCardList[this.data.memberCardSelectIndex].payPrice,
        realPrice: this.data.memberCardList[this.data.memberCardSelectIndex].payPrice
      })
    }
    if (this.data.memberCardList[this.data.memberCardSelectIndex] && this.data.memberCardList[this.data.memberCardSelectIndex].maxGroupCourseReservedCount) {
      this.setData({
        maxSelectSeatCount: this.data.memberCardList[this.data.memberCardSelectIndex].maxGroupCourseReservedCount,
      })
    }

    if (this.data.coupon) {
      // console.log(this.data.coupon)
      if (this.data.coupon.type == 1) {
        if (this.data.coupon.discount > this.data.allPricre) {
          this.setData({
            discountPrice: this.data.allPricre,
            realPrice: util.floatSub(this.data.allPricre, this.data.coupon.discount) < 0 ? 0 : util.floatSub(this.data.allPricre, this.data.coupon.discount)
          })
        } else {
          this.setData({
            discountPrice: this.data.coupon.discount,
            realPrice: util.floatSub(this.data.allPricre, this.data.coupon.discount) < 0 ? 0 : util.floatSub(this.data.allPricre, this.data.coupon.discount)
          })
        }
      } else {
        if ((this.data.coupon.maxDeductionAmount < util.mul(this.data.allPricre, this.data.coupon.discount) && this.data.coupon.maxDeductionAmount)) {
          // console.log(util.floatSub(this.data.allPricre, this.data.coupon.maxDeductionAmount))
          this.setData({
            discountPrice: this.data.coupon.maxDeductionAmount,
            realPrice: util.floatSub(this.data.allPricre, this.data.coupon.maxDeductionAmount) < 0 ? 0 : util.floatSub(this.data.allPricre, this.data.coupon.maxDeductionAmount)
          })
        } else {
          this.setData({
            realPrice: util.mul(this.data.allPricre, this.data.coupon.discount),
            discountPrice: util.floatSub(this.data.allPricre, util.mul(this.data.allPricre, this.data.coupon.discount)) < 0 ? 0 : util.floatSub(this.data.allPricre, util.mul(this.data.allPricre, this.data.coupon.discount))
          })
        }
      }
    } else {
      this.setData({
        discountPrice: 0,
        realPrice: this.data.payPrice
      })
    }

  }
})