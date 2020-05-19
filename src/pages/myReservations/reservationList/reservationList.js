var reservService = require('../../../service/reservationService.js');
var notificationCenter = require('../../../WxNotificationCenter.js');
var notifConstant = require('../../../utils/notifConstant.js');
var orderService = require('../../../service/orderService.js');
var app = getApp();
var util = require('../../../utils/util.js');
var btnUtil = require('../../../utils/uiUtils/btnUtil.js');
var P = require('../../../lib/wxpage');
var requestUtil = require('../../../utils/requestUtil.js');
var config = require('../../../config.js');
P('myReservations/reservationList/reservationList', {

  /**
   * 页面的初始数据
   */
  data: {
    isLoadingMore: false,
    year: "",
    totalPages: 0,
    currentPage: 0,
    list: [],
    currentData: 0,
    listHeight: "",
    clubType:'',
    courseType: 1,
    center:''
  },

  onNavigate: function (res) {
     this.preDataRequest();
  },

  catchTouchMove(){
    // return;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.pageType == '' || options.pageType == null || options.pageType==undefined){
      this.setData({
        currentData: 0
      })
      this.preRefresh();
    }else{
      this.setData({
        currentData: 1
      })
      var e = { target: { dataset: { current: 1 } } }
      this.checkCurrent(e)
    }
    this.isLoaded = true;
    notificationCenter.addNotification(notifConstant.refreshReservationListNotif, this.handleStatusUpdate, this);
    var that=this;
    that.setData({
      clubType: getApp().globalData.selectCenter.clubType,
      center: getApp().globalData.selectCenter
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          listHeight: res.windowHeight - 40
        })
      }
    })
    this.getwxAppSetting()

  },
  // 获取小程序的配置信息
  getwxAppSetting() {
    var url = config.getwxAppSetting()
    requestUtil.getRequest(url).then(res => {
      this.setData({
        featureSetting: res.featureSetting
      })
    })
  },


  //获取当前滑块的index
  bindchange: function (e) {
    console.log(e)
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
    var e = { target: { dataset: { current: e.detail.current } } }
    this.checkCurrent(e)

  },


  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    const that = this;
    wx.showLoading({
      title: '加载中',
    })
    //清空上一页的list数组
    that.$put('reservationList', null);
    that.setData({
      currentData: e.target.dataset.current
    })
    if (that.data.currentData == 0) {
      that.setData({
        courseType: 1
      })
    } else if (that.data.currentData == 1 && getApp().globalData.selectCenter.clubType != 4 && getApp().globalData.selectCenter.clubType != 8) {
      that.setData({
        courseType: 2
      })
    } else if (that.data.currentData == 1 && getApp().globalData.selectCenter.clubType == 4) {
      that.setData({
        courseType: 4
      })
    } else if (that.data.currentData == 2) {
      that.setData({
        courseType: 3
      })
    }else if(that.data.currentData==3){
      that.setData({
        courseType: 8
      })
    };
    that.preRefresh();
  }, 

   checkSit(e){
     var photo = []
     photo.push(e.currentTarget.dataset.photo)
     wx.previewImage({
       urls: photo // 需要预览的图片http链接列表
     })
   },


  preRefresh: function() {
    var res = this.$take('reservationList');
    if (res)
    {
    this.handleData(res)
    }
    else
    {
    this.refresh();
    }
  },
  // 截获竖向滑动
  catchTouchMove: function (res) {
    // return false
  },
  refresh: function () {
    this.hideLoading();
    this.data.currentPage = 0;
    this.setCurrentYear();
    this.data.list = [];
    this.getData(this.data.currentPage, this.data.year);

  },


  getData: function (page, year) {
    // console.log(app.globalData.token)
    if (app.globalData.token) {
      // wx.showLoading({
      //   title: '加载中',
      // })
      var that = this;
      that.dataRequest(page, year, (res) => {
        // console.log(res)
        that.handleData(res);

      })
    }
  },
  preDataRequest:function() {
    var that = this;
    that.data.currentPage = 0;
    that.setCurrentYear();
    that.data.list = [];
    that.dataRequest(this.data.currentPage, this.data.year, (res) => {
      that.$put('reservationList', res);
    })
  },

  dataRequest: function(page, year, callBack) {
    reservService.getReservationList(this.data.courseType,page, year).then((res) => {
      wx.hideLoading();
      callBack(res);
    })
  },

  loadMore: function () {
    var that = this;
    let current = that.data.currentPage;
    let total = that.data.totalPages;
    that.showLoadingMore();
    // console.log(current,total)
    if (current < total) {
      that.getData(current, that.data.year);
    }
    else {
      wx.showToast({
        title: '暂无更多数据',
        icon: "none"
      })
    }
    that.hideLoading();
  },

  handleData: function (res) {
    var that = this;
    that.data.totalPages = res.totalPages;
    var arr = res.data;
    for (var i = 0; i < arr.length; i++) {
      arr[i].btnStyle = btnUtil.btnStyle(arr[i]);
    }

    that.data.currentPage += 1;
    that.$setData({
      list: that.data.list.concat(arr)
    });
    // console.log(that.data.list)
    // this.drawLevels(that.data.list);
    var arrCount = arr.length - 1;
    if (arrCount > 0) {
      that.data.year = arr[arrCount].plannedDateStr.slice(0, 4);
    }
  },
  showLoadingMore: function () {
    this.setData({
      isLoadingMore: true
    })
  },

  hideLoading: function () {
    this.setData({
      isLoadingMore: false
    })
    wx.stopPullDownRefresh();
  },

  setCurrentYear: function () {
    var d = new Date();
    this.data.year = String(d.getFullYear());
  },




  handleStatusUpdate: function (e) {
    // console.log(e);
    var that = this;
    let name = e.name;
    let index = e.index;
    var key = "list[" + index + "]";
    if (name == "rate")  //在列表中顺序不变，所以只更新对应数据
    {

      var param = {
        [key + ".rated"]: true,
        [key + ".statusStr"]: "已完成",
        [key + ".btnStyle"]: {
          showSelf: false
        }
      }
      that.setData(param);
    }
    else //cancel或pay或再次从小程序外面直接进入本页面(顺序变了，所以更新整个列表)
    {
      console.log("app did show can ready to call refresh");
      that.refresh();
    }
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
    this.$take('reservationList');
    notificationCenter.removeNotification(notifConstant.refreshReservationListNotif, this);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.refresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.totalPages > 1) {
      this.loadMore();
    }
  },
  upper: function () {
    var that=this;
    wx.showLoading({
      title: '加载中',
      mask: true
    }) 
    setTimeout(function () {
      wx.showToast({
        title: '已是最新数据',
        icon: "none"
      })
      that.refresh();
    }, 1000)
  },
  lower: function (e) {
    var that=this;
    if (that.data.totalPages > 1) {
      wx.showLoading({
        title: '加载中',
        mask: true
      }) 
      setTimeout(function () {
        that.loadMore();
      }, 1000)
    }else{
      wx.showToast({
        title: '暂无更多数据',
        icon: "none"
      })
    }
  },
  isOverReservEndTime: function (plannedDateStr, endTime) {
    let dateStr = plannedDateStr.replace(/-/g, "/")
    let dateTime = new Date(dateStr + " " + endTime);
    let currentDate = new Date();
    let interval = currentDate - dateTime;
    if (interval > 0) {
      return true;
    }
    else {
      return false;
    }

  },
  checkPayAvailable: function (orderId) {
    wx.showLoading({
      title: '',
    })
    var that = this;
    orderService.checkPayAvailable(orderId).then((res) => {
      wx.navigateTo({
        url: "../reservationDetail/reservationPayment/createPayment/createPayment?orderId=" + orderId,
      })

    }, () => {

      that.refresh();
    })
  },

  //右边第一个button
  didTappedFirst: function (e) {
    let target = e.currentTarget;
    this.diffBtnTapped(target.dataset.btntype, parseInt(target.id));
  },


  diffBtnTapped: function (btnType, index) {
    let item = this.data.list[index];
    console.log(this.data.list[index]);
    let id = item.id;
    let orderId = item.courseOnlineorderId;
    let instanceId = item.instanceId;
    switch (btnType) {
      case 'evaluateBtn':
        this.goNextPage("../reservationDetail/reservationEvaluation/evaluateCourse", id, index);
        break;
      case 'payBtn':
        this.checkPayAvailable(orderId);
        break;
      case 'cancelBtn':
        let startTime = item.plannedDateStr + " " + item.startTime;
        let maxMinutes = item.minutesForCancelCourseBeforeStart;
        if (item.courseType!=4){
          if (util.intervalSinceNow(startTime) > maxMinutes) {
            // console.log('---'+JSON.stringify(item))
            this.goNextPage("../reservationDetail/reservationCancellation/cancelReservation", instanceId, orderId, item.courseInstanceType == 2 ? item.id : null);
          }
          else {
            wx.showModal({
              content: "对不起，课程开始前" + maxMinutes + "分钟内不能取消",
            })
          }
        }else{
          this.goNextPage("../reservationDetail/reservationCancellation/cancelReservation", instanceId, orderId, item.courseInstanceType == 2 ? item.id : null);
        }
        break;
      case 'deleteBtn':
        break;
    }
  },


  checkReserveCancellable: function (item) {

  },

  //右边第二个btn，第一个为去支付时，这个显示为取消
  didTappedSecond: function (e) {
    let index = parseInt(e.currentTarget.id);
    let item = this.data.list[index];
    this.goNextPage("../reservationDetail/reservationCancellation/cancelReservation", item.instanceId, item.courseOnlineorderId);
  },

  goNextPage: function (path, id, orderId, reserveId = null) {

    let suffix = {
      id: id,
      index: orderId,
      reserveId: reserveId
    };
    let json = JSON.stringify(suffix);
    let temp = path + "?data=" + json
    wx.navigateTo({
      url: temp,
    })
  },

  onShareAppMessage: function () {
    return {
      path: "/pages/index/index"
    }
  },
})