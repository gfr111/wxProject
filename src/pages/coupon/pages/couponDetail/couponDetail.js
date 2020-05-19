// pages/coupon/pages/couponDetail/couponDetail.js
var util = require('../../../../utils/util.js');
var groupCourse = require('../../../../service/groupCourse.js');
var centerService = require("../../../../service/centerService.js");
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentData: 0,
    defaultHeight: '',
    days: [], // 总天数
    currentShowDays: [], // 当前一周内的天数
    currentShowDaysIndex: 0, // 当前显示第几周的日期
    daysScrollViewCurrentIndex: 0, // 当前显示一周内第几天的数据
    divisor: null,//计算有多少周,
    cartsNum:0,
    scenceList:[],
    showShoppingCart:false ,
    descrip:'',
    notice:'',
    ticketId: '',
    planDate:'',
    weekDay:'',
    couponName:'',
    type:'',
    saleDayLimit:'',
    singleCount:'',
    nowHours: '',
    setInter:'',
    todayDate:'',
    couponImg:'',
    shoppingCart:[],
    allPrice:0,
    allPrice: 0,
    tipsTxt:'',
    usageType:'',
    closingDay:'',
    openingDay:'',
    effectiveDays:'',
    couponDetailMess:'',
    weekDayList:[],
    closingDays: '',
    openingDays: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var that = this;
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            defaultHeight: res.screenHeight - 110,
            ticketId: options.id,
            nowHours: that.getHours()
          })
        }
      })
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
    //开放天数
    var num=null;
    if (options.closingDay != null && options.closingDay != '' && options.closingDay != null!=undefined){
        var closeDiff = that.datedifference(nowDate, options.closingDay)+1;
        if (options.saleDayLimit > closeDiff){
          num = Math.ceil(closeDiff / 5)
        } else{
          num = Math.ceil(options.saleDayLimit / 5)
        } 
      }else{
        num = Math.ceil(options.saleDayLimit / 5)
      }
      var divisor=0;
      that.setData({
        divisor: num-1
      })
    var days = groupCourse.getDaysWithDayCount(num*5);
    that.setData({
      days: days,
      currentShowDays: days[0],
      today: new Date().getMonth() + 1 + '.' + new Date().getDate(),
      todayDate: days[0][0].dateStr,
      planDate: days[0][0].dateStr
    });
    that.getDetail(that.data.ticketId, days[0][0].dateStr, days[0][0].day);

    that.data.setInter=setInterval(that.getHour, 6000);  
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
  getDetail(ticketId, planDate, weekDays){
    var that=this;
    var weekDay='';
    if(weekDays=='周一'){
       weekDay=1
    } else if (weekDays == '周二') {
      weekDay = 2
    } else if (weekDays == '周三') {
      weekDay = 3
    } else if (weekDays== '周四') {
      weekDay = 4
    } else if (weekDays == '周五') {
      weekDay = 5
    } else if (weekDays == '周六') {
      weekDay = 6
    }else{
      weekDay = 7
    }
    var checkedDay = planDate.substring(0, 4) + '-' + planDate.substring(4, 6) + '-' + planDate.substring(6, 8);
    var close = new Date(that.closeDay(that.data.saleDayLimit));

    if (new Date(checkedDay).getTime() < close.getTime() ) {
      that.couponDetailNet(ticketId, planDate, weekDay)
    } else {
      that.setData({
        scenceList: null
      })
    }
  },
  couponDetailNet: function (ticketId, planDate, weekDay){
    var that=this;
    var arr=[];
    centerService.getCouponDetail(ticketId, planDate, weekDay).then((res) => {
      if (res.times){
        for (var i = 0, len = res.times.length; i < len; i++) {
           res.times[i].buyCount = 0;
          if (that.data.planDate == that.data.todayDate) {
            if (res.times[i].endTime > that.data.nowHours) {
              arr.push(res.times[i])
            }
          } else {
            arr = res.times;
          }  
             
        }
      }
      var arrList=[];
      if (res.weekDay.indexOf(1)!=-1){
        arrList.push('周一 ')
      }
      if (res.weekDay.indexOf(2) != -1) {
        arrList.push('周二 ')
      }
      if (res.weekDay.indexOf(3) != -1) {
        arrList.push('周三 ')
      }
      if (res.weekDay.indexOf(4) != -1) {
        arrList.push('周四 ')
      }
      if (res.weekDay.indexOf(5) != -1) {
        arrList.push('周五 ')
      }
      if (res.weekDay.indexOf(6) != -1) {
        arrList.push('周六 ')
      }
      if (res.weekDay.indexOf(7) != -1) {
        arrList.push('周日')
      }
      that.setData({
        descrip: res.introduction,
        notice: res.notice,
        couponName: res.name,
        type: res.type,
        saleDayLimit: res.usageType == 1 ? res.saleDayLimit : res.effectiveDays,
        singleCount: res.singleCount,
        scenceList: arr,
        couponImg:res.img,
        tipsTxt:res.tips,
        closingDays: res.closingDay,
        openingDays: res.openingDay,
        closingDay: (res.closingDay + '').substring(0, 4) + '.' + (res.closingDay + '').substring(4, 6) + '.' + (res.closingDay + '').substring(6, 8),
        openingDay: (res.openingDay + '').substring(0, 4) + '.' + (res.openingDay + '').substring(4, 6) + '.' + (res.openingDay + '').substring(6, 8),
        usageType:res.usageType,
        effectiveDays: res.effectiveDays,
        couponDetailMess:res,
        weekDayList:arrList
      })    
    })
  },
  //得到最后一天的开放日期
  closeDay:function (days) {
    //日期，在原有日期基础上，增加days天数，默认增加1天
    if (days == undefined || days == '') {
      days = 1;
    }
    var date = new Date();
    date.setDate(date.getDate() + days);
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var mm = "'" + month + "'";
    var dd = "'" + day + "'";

    //单位数前面加0
    if (mm.length == 3) {
      month = "0" + month;
    }
    if (dd.length == 3) {
      day = "0" + day;
    }

    var time = date.getFullYear() + "-" + month + "-" + day
    return time;
  },
  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    const that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current
      })
    }
  },
  //获取当前滑块的index
  bindchange: function (e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },
  // 改变当前显示周
  changeCurrentWeek: function (event) {
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
      planDate: this.data.days[index][0].dateStr,
      cartsNum:0,
      allPrice: 0
    });
    this.getDetail(this.data.ticketId, this.data.days[index][0].dateStr, this.data.days[index][0].day);
  },
  // 点击选择日期
  dayBindTap: function (event) {
    var index = event.currentTarget.id.substring(3);
    this.setData({
      daysScrollViewCurrentIndex: index,
      planDate: this.data.currentShowDays[index].dateStr,
      cartsNum: 0,
      allPrice: 0
    });

    var closingDay = this.data.closingDays + '';
    var closeDay = new Date(closingDay.substring(0, 4) + '-' + closingDay.substring(4, 6) + '-' + closingDay.substring(6, 8));
    var click = this.data.currentShowDays[this.data.daysScrollViewCurrentIndex].dateStr;
    var clickData = new Date(click.substring(0, 4) + '-' + click.substring(4, 6) + '-' + click.substring(6, 8));
   
    if (new Date(closeDay).getTime() < new Date(clickData).getTime()){
      this.setData({
        scenceList: []
      })
    }else{
      this.getDetail(this.data.ticketId, this.data.currentShowDays[this.data.daysScrollViewCurrentIndex].dateStr, this.data.currentShowDays[this.data.daysScrollViewCurrentIndex].day);
    }
    
   
  },
  //获取当前时间
  getHours:function () {
    var hours=null;
    var minutes=null;
    hours = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours();
    minutes = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
    return hours + ':' + minutes;
  },
  getHour: function () {
    var hours = null;
    var minutes = null;
    hours = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours();
    minutes = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes();
    this.setData({
      nowHours:hours + ':' + minutes
    })
  },
  preventTouchMove:function(){

  },
  showShoppingCartEvent:function(){
    // console.log(this.data.shoppingCart)
   this.setData({
     showShoppingCart:true
   })
  },
  hideShoppingCartEvent: function () {
    this.setData({
      showShoppingCart: false
    })
  },
  toOrder:function(){
    var that = this;
    var list = that.data.scenceList;
    var arr=[];
    for (var i = 0, len = list.length; i < len; i++) {
       if(list[i].buyCount>0){
         arr.push(list[i])
       }
    }

console.log(app.globalData.token)


    if (app.globalData.token || wx.getStorageSync("tokenKey")){
      var data = {
        date: that.data.planDate,
        instances: arr,
        cartsNum: that.data.cartsNum,
        allPrice: that.data.allPrice,
        name: that.data.couponName,
        img: that.data.couponImg,
        ticketId: that.data.ticketId,
        type: that.data.type,
        openingDay: that.data.couponDetailMess.openingDay,
        closingDay: that.data.couponDetailMess.closingDay,
        notice: that.data.notice,
        saleDayLimit: that.data.saleDayLimit,
        usageType: that.data.usageType
      }
      wx.setStorage({
        key: 'couponMess',
        data: JSON.stringify(data),
      })
    wx.navigateTo({
      url: '/pages/coupon/pages/orderPage/orderPage',
    })
    }else{
      wx.showToast({
        title: '请先登录',
        icon:'none'
      })
      app.checkAuthToken()
    }


   
  },
  addCouponNum:function(e){
    var that=this;
    var list = that.data.scenceList;
    var allPrice=that.data.allPrice;
    var item = e.currentTarget.dataset.item;
    item.data = that.data.planDate.substring(4, 6) + '月' + that.data.planDate.substring(6, 8) + '日';
    var id=e.currentTarget.dataset.item.id;
    for (var i = 0, len = list.length; i < len; i++) {
      if (id == list[i].id){
        list[i].buyCount++;
      }
    }
    that.data.cartsNum = that.data.cartsNum+1;
    that.setData({
      scenceList:list,
      cartsNum: that.data.cartsNum 
    })
    allPrice = util.floatAdd(allPrice, item.price);
    that.setData({
      allPrice:allPrice
    })
  },
  reduceCouponNum:function(e){
    var that = this;
    var allPrice = that.data.allPrice;
    var list = that.data.scenceList;
    var id = e.currentTarget.dataset.item.id;
    for (var i = 0, len = list.length; i < len; i++) {
      if (id == list[i].id) {
         if (list[i].buyCount>0){
          list[i].buyCount--;
        }
      }
    }
    if (that.data.cartsNum>0){
      that.data.cartsNum = that.data.cartsNum - 1;
    }
    that.setData({
      scenceList: list,
      cartsNum: that.data.cartsNum
    })
    allPrice = util.floatSub(allPrice , e.currentTarget.dataset.item.price);
    that.setData({
      allPrice: allPrice
    })
    if(allPrice==0){
      that.setData({
        showShoppingCart:false
      })
    }
  },
  clearCart:function(){
    var that=this;
    var list = that.data.scenceList;
    for (var i = 0, len = list.length; i < len; i++) {
          list[i].buyCount=0;
    }
    that.setData({
      showShoppingCart: false,
      cartsNum:0,
      scenceList: list,
      allPrice:0
    })

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
    var that=this;
    clearInterval(that.data.setInter)
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

  }
})