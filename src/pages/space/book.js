// pages/space/book.js
var groupCourse = require('../../service/groupCourse.js');
var util = require('../../utils/util.js')
var centerService = require("../../service/centerService.js");
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    days: [], // 总天数
    currentShowDays: [], // 当前一周内的天数
    currentShowDaysIndex: 0, // 当前显示第几周的日期
    daysScrollViewCurrentIndex: 0, // 当前显示一周内第几天的数据
    showSiteBox: false,
    spaceMess: null,
    limiyDay: 10,
    divisor: null,
    siteTime: null,
    seatList: [],
    arr: [],
    lastDay: null,
    showMemberList: false,
    allPrice: 0,
    closeday: null,
    chooseDay: null,
    nowData: null,
    isShowRemark: true,
    toView: 'one',
    newDate: null,
    newHour: null,
    newMinute: null,
    showTime:true,
    scrollLeft:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //获取当日日期
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    var nowDate = year + "-" + month + "-" + day;
    that.setData({
      spaceMess: JSON.parse(options.spaceMess),
      nowData: nowDate,
      newDate: date,
      newHour: date.getHours(),
      newMinute: date.getMinutes(),
    })
    var num = 0;
    var l = 0;
    var times = new Date();

    if (!JSON.parse(options.spaceMess).restrictionReservation) {
      that.setData({
        divisor: Math.ceil(that.datedifference(nowDate, JSON.parse(options.spaceMess).closingDay) / 5) - 1
      })
      num = Math.ceil(that.datedifference(nowDate, JSON.parse(options.spaceMess).closingDay) / 5);
      var l = times.getTime(times) + (that.datedifference(nowDate, JSON.parse(options.spaceMess).closingDay)) * 86400000;
    } else {
      that.setData({
        divisor: Math.ceil(JSON.parse(options.spaceMess).withinDays / 5) - 1
      })
      num = Math.ceil(that.data.spaceMess.withinDays / 5);
      var l = times.getTime(times) + (that.data.spaceMess.withinDays - 1) * 86400000;
    }
    var days = groupCourse.getDaysWithDayCount(5 * num);
    that.setData({
      days: days,
      currentShowDays: days[0],
      today: new Date().getMonth() + 1 + '.' + new Date().getDate(),
      closeday: JSON.parse(options.spaceMess).closingDay,
    });

    //是否存在顶部温馨提示
    wx.getSystemInfo({
      success: function(res) {
        if (JSON.parse(options.spaceMess).remark == null) {
          that.setData({
            height: util.mul(res.windowHeight, 0.65)
          })
        } else {
          var height = 0;
          if (res.model == 'iPhone X') {
            height = util.mul(res.windowHeight, 0.77)
          } else {
            height = util.mul(res.windowHeight, 0.67)
          }
          that.setData({
            height: height
          })
        }
      },
    })
    that.setData({
      lastDay: that.timestampToTime(l)
    })

    that.getDetail(that.data.spaceMess.id, days[0][0].dateStr)
  },
  showRemark: function() {
    var that = this;
    that.setData({
      isShowRemark: false,
    })
    wx.getSystemInfo({
      success: function(res) {
        // that.setData({
        //   height: util.mul(res.windowHeight, 0.65)
        // })
        var height = 0;
        if (res.model == 'iPhone X') {
          height = util.mul(res.windowHeight, 0.77)
        } else {
          height = util.mul(res.windowHeight, 0.67)
        }
        that.setData({
          height: height + 24
        })
      },
    })
  },
  scroll(e){
    // console.log(e.detail)
    // this.setData({
    //   showTime: true
    // })
  },
  scroll2(e) {
    // console.log(e.detail)
    this.setData({
      // showTime:false,
      scrollLeft: e.detail.scrollLeft+2
    })
  },
  //时间转换
  timestampToTime(timestamp) {
    var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
    return Y + M + D;
  },
  //计算时间
  datedifference(sDate1, sDate2) { //sDate1和sDate2是2006-12-18格式  
    var dateSpan,
      tempDate,
      iDays;
    sDate1 = Date.parse(sDate1);
    sDate2 = Date.parse(sDate2);
    dateSpan = sDate2 - sDate1;
    dateSpan = Math.abs(dateSpan);
    iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
    return iDays
  },
  getDetail(groundId, planDate) {
    centerService.getOrderSpaceDetail(groundId, planDate).then((res) => {

      if (res == null || !res.reserved) {
        wx.showToast({
          title: '本日不可预约',
          icon: "none"
        })
        this.setData({
          siteTime: ''
        })
      } else {
        var tody = this.data.currentShowDays[this.data.daysScrollViewCurrentIndex].month + '.' + this.data.currentShowDays[this.data.daysScrollViewCurrentIndex].date
        if (res.reserved) {
          for (var i = 0, len = res.reserve.length; i < len; i++) {
            for (var j = 0, jen = res.reserve[i].ins.length; j < jen; j++) {
              res.reserve[i].ins[j].checked = false
            }
            if (tody == this.data.today) {
              for (var z = 0; z < res.reserve[i].ins.length; z++) {
                res.reserve[i].ins[z].isSelect = util.compareWithCurrentTime(res.times[z])
              }
            } else {
              for (var z = 0; z < res.reserve[i].ins.length; z++) {
                res.reserve[i].ins[z].isSelect = true
              }
            }
          }
          console.log(res)
          this.setData({
            siteTime: res
          })
          if (tody == this.data.today) {
            //场地直接定位到可选择的时间段
            this.scrollViewMark()
          }
        }
      }

    })
  },
  toSpaceDetail: function() {
    wx.navigateTo({
      url: '/pages/space/spaceDetail?spaceDetail=' + JSON.stringify(this.data.spaceMess),
    })
  },
  toSubmit: function() {
    if (!app.globalData.token) {
      wx.showToast({
        title: '请先登录',
        icon:'none'
      })
      app.checkAuthToken()
      return
    }
    var data = {};
    var that = this
    var carList = this.data.siteTime.paySettings
    data.planDate = that.data.days[0][0].dateStr;
    data.sites = that.data.seatList;
    data.total = Number(that.data.allPrice);
    var arr1 = [];
    for (var i = 0, len = carList.length; i < len; i++) {
      carList[i].checked = false;
      //循环计算储值卡扣卡余额是否足够
      if (carList[i].cardType == 5 && carList[i].discountType == 1) {
        carList[i].counts = util.mul(carList[i].deductionAmount, data.sites.length)
      } else {
        carList[i].counts = null;
      }
      if (carList[i].objectId > 0) {
        arr1.push(carList[i])
      }
    }
    for (var z = 0; z < arr1.length; z++) {
      if (arr1[z].discountRatio != null) {
        data.realAmount = util.mul(util.mul(that.data.allPrice, arr1[z].discountRatio), 0.1);
      } else {
        data.realAmount = Number(that.data.allPrice);
      }
    }

    for (var i = 0, len = carList.length; i < len; i++) {
      if (that.data.selectedId == carList[i].objectId) {
        data.payType = carList[i].payType;
        data.cardType = carList[i].cardType;
        data.objectId = carList[i].objectId;
        data.name = carList[i].objectName;
        data.discountType = carList[i].discountType;
        if (carList[i].discountType == null) {
          data.discountRatio = 10;
        } else {
          if (carList[i].discountType == 2) {
            data.discountRatio = carList[i].discountRatio;
          } else {
            if (carList[i].cardType == 4) {
              if (carList[i].discountType == 1) {
                data.deductionCount = carList[i].deductionCount * data.sites.length;
              } else {
                data.deductionCount = carList[i].deductionCount;
              }
              console.log(data.deductionCount)
            } else if (carList[i].cardType == 5) {
              if (carList[i].discountType == 1) {
                data.deductionAmount = util.mul(carList[i].deductionAmount, data.sites.length)
              } else {
                data.deductionAmount = carList[i].deductionAmount;
              }
            }
          }
        }

      }
    }

    wx.navigateTo({
      url: '/pages/space/bookingsure?data=' + JSON.stringify(data) + '&spaceMess=' + JSON.stringify(that.data.spaceMess) + '&carList=' + JSON.stringify(this.data.siteTime.paySettings) + '&noUseCard=' + JSON.stringify(this.data.siteTime.noUseCard) + '&list=' + JSON.stringify(this.data.seatList) + '&price=' + this.data.allPrice + '&planDate=' + this.data.currentShowDays[this.data.daysScrollViewCurrentIndex].dateStr + '&groundId=' + this.data.siteTime.paySettings[0].athleticGroundId,
    })

  },
  // 改变当前显示周
  changeCurrentWeek: function(event) {
    var index = 0;
    if (event.currentTarget.id == 'left') {
      index = this.data.currentShowDaysIndex - 1;
    } else {
      index = this.data.currentShowDaysIndex + 1;
    }
    this.setData({
      currentShowDays: this.data.days[index],
      currentShowDaysIndex: index,
      daysScrollViewCurrentIndex: 0,
    });
    console.log(this.data.currentShowDays[0].dateStr, this.data.currentShowDays)
    this.getDetail(this.data.spaceMess.id, this.data.currentShowDays[0].dateStr);
  },

  // 点击选择日期
  dayBindTap: function(event) {
    var that = this;
    var index = event.currentTarget.id.substring(3);
    var nowYear = that.data.currentShowDays[index].year;
    var nowMonth = that.data.currentShowDays[index].month < 10 ? '0' + that.data.currentShowDays[index].month : that.data.currentShowDays[index].month;
    var nowDay = that.data.currentShowDays[index].date < 10 ? '0' + that.data.currentShowDays[index].date : that.data.currentShowDays[index].date;
    var days = nowYear + '-' + nowMonth + '-' + nowDay;
    that.setData({
      daysScrollViewCurrentIndex: index,
      chooseDay: days
    });
    //点击当前日的时间戳
    var date = new Date(that.data.chooseDay).getTime();
    //最大日期的时间戳
    var lastDate = new Date(that.data.lastDay).getTime();
    if (date <= lastDate) {
      that.getDetail(that.data.spaceMess.id, that.data.currentShowDays[index].dateStr);
      that.data.seatList = [];
      that.setData({
        showSiteBox: false
      })
    } else {
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      if (month < 10) {
        month = "0" + month;
      }
      if (day < 10) {
        day = "0" + day;
      }
      console.log(that.data.spaceMess.withinDays)
      if (!that.data.spaceMess.restrictionReservation) {
        wx.showModal({
          content: '当前只可预约' + (that.datedifference(nowDate, that.data.closeday) + 1) + '天内的场地',
          showCancel: false
        });
      } else {
        wx.showModal({
          content: '当前只可预约' + that.data.spaceMess.withinDays + '天内的场地',
          showCancel: false
        });
      }
      that.setData({
        siteTime: ''
      })
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  sum(arr) {
    var s = 0;
    arr.forEach(function (val, idx, arr) {
      s = util.floatAdd(s, val);
    }, 0);
    return s;
  },
  deleteSit: function(e) {
    var that = this
    var arr = {};
    var index = e.currentTarget.dataset.index
    var idx = e.currentTarget.dataset.idx
    var id = e.currentTarget.dataset.id
    var list = that.data.siteTime;
    var sitList = that.data.seatList;

    for (var i = 0, len = list.reserve.length; i < len; i++) {
      if (id == list.reserve[i].id) {
        arr.startTime = list.times[idx];
        arr.planDate = that.data.currentShowDays[that.data.daysScrollViewCurrentIndex].dateStr;
        arr.endTime = list.times[idx + 1];
        arr.price = that.data.spaceMess.unitPrice;
        arr.sitesId = list.reserve[i].id;
        arr.siteName = list.reserve[i].serialNumber;
        arr.idx = idx;
        that.setData({
          arr: arr
        })
        var indexs = -1;
        for (var j = 0, l = sitList.length; j < l; j++) {
          if (JSON.stringify(sitList[j]) == JSON.stringify(that.data.arr)) {
            indexs = j;
            break;
          }
        }
        sitList.splice(indexs, 1);
        list.reserve[i].ins[idx].checked = false;
      }
    }
    if (that.data.seatList.length > 0) {
      that.setData({
        showSiteBox: true
      })
    } else {
      that.setData({
        showSiteBox: false
      })
    }
    var num = [];
    for (var i = 0, len = sitList.length; i < len; i++) {
      num.push(sitList[i].price)
    }
    that.setData({
      siteTime: list,
      seatList: sitList,
      allPrice: that.sum(num)
    })
  },

  chooseSit: function(e) {
    var that = this;
    var arr = {};
    var list = that.data.siteTime;
    var sitList = that.data.seatList;
    var thetime = null;
    if (that.data.chooseDay == null) {
      thetime = that.data.nowData;
    } else {
      thetime = that.data.chooseDay;
    }
    var d = new Date(Date.parse(thetime.replace(/-/g, "/"))); //所选时间
    var curDate = new Date(); //今日时间
    var isChoose = (d <= curDate);
    for (var i = 0, len = list.reserve.length; i < len; i++) {
      if (e.currentTarget.dataset.id == list.reserve[i].id) {
        //当前日期是否为今天 
        if (isChoose) {
          //当前时间手否大于预约时间
          if (util.compareWithCurrentTime(list.times[e.currentTarget.dataset.index])) {
            if (!list.reserve[i].ins[e.currentTarget.dataset.index].checked) {
              if (sitList.length >= 4) {
                wx.showToast({
                  title: '最多选择4个场地',
                  icon: 'none'
                })
                return;
              } else {
                arr.startTime = list.times[e.currentTarget.dataset.index];
                arr.endTime = list.times[e.currentTarget.dataset.index + 1];
                arr.price = list.reserve[i].ins[e.currentTarget.dataset.index].unitPrice;
                arr.planDate = that.data.currentShowDays[that.data.daysScrollViewCurrentIndex].dateStr;
                arr.sitesId = list.reserve[i].id;
                arr.siteName = list.reserve[i].serialNumber;
                arr.idx = e.currentTarget.dataset.index;
                that.setData({
                  arr: arr
                })
                list.reserve[i].ins[e.currentTarget.dataset.index].checked = true;
                sitList.push(arr);
              }
            } else {
              // var index = sitList.indexOf(that.data.arr);
              var index = 0;
              // for (var j = 0, l = sitList.length; j < l; j++) {
              //   if (JSON.stringify(sitList[j]) == JSON.stringify(that.data.arr)) {
              //     index = j;
              //     console.log('---j---', j)
              //     break;
              //   }
              // }
              for (var j = 0, l = sitList.length; j < l; j++) {
                if (sitList[j].idx == e.currentTarget.dataset.index) {
                  index = j;
                  break;
                }
              }
              sitList.splice(index, 1);
              list.reserve[i].ins[e.currentTarget.dataset.index].checked = false;
            }
          } else {
            wx.showToast({
              title: '当前时间不能预约该场地',
              icon: 'none'
            })
          }
        } else {
          if (!list.reserve[i].ins[e.currentTarget.dataset.index].checked) {
            if (sitList.length >= 4) {
              wx.showToast({
                title: '最多选择4个场地',
                icon: 'none'
              })
              return;
            } else {
              arr.startTime = list.times[e.currentTarget.dataset.index];
              arr.endTime = list.times[e.currentTarget.dataset.index + 1];
              arr.planDate = that.data.currentShowDays[that.data.daysScrollViewCurrentIndex].dateStr;
              arr.price = list.reserve[i].ins[e.currentTarget.dataset.index].unitPrice;
              arr.sitesId = list.reserve[i].id;
              arr.siteName = list.reserve[i].serialNumber;
              arr.idx = e.currentTarget.dataset.index;
              that.setData({
                arr: arr
              })
              list.reserve[i].ins[e.currentTarget.dataset.index].checked = true;
              sitList.push(arr);
            }
          } else {
            var index = 0;
            for (var j = 0, l = sitList.length; j < l; j++) {
              if (sitList[j].idx == e.currentTarget.dataset.index) {
                index = j;
                break;
              }
            }
            sitList.splice(index, 1);
            list.reserve[i].ins[e.currentTarget.dataset.index].checked = false;

          }
        }
      }
    }

    if (that.data.seatList.length > 0) {
      that.setData({
        showSiteBox: true
      })
    } else {
      that.setData({
        showSiteBox: false
      })
    }
    var num = [];
    for (var i = 0, len = sitList.length; i < len; i++) {
      num.push(sitList[i].price)
    }
    that.setData({
      siteTime: list,
      seatList: sitList,
      allPrice: that.sum(num)
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },



  /*******页面事件*******/
  scrollViewMark: function() {
    var that = this
    that.setData({
      toView: 'markview'
    })
  },
})