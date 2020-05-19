// pages/myOrders/orderList/orderList.js

var orderService = require('../../../service/orderService.js');
var buyCardService = require('../../../service/buyCardService.js')
var filter = require('../../../utils/authFilter.js');
var config = require('../../../config.js')
var requestUtil = require('../../../utils/requestUtil.js')
var systemMessage = require('../../../SystemMessage.js');
var app = getApp();
var P = require('../../../lib/wxpage');
var isPay=false

P("myOrders/orderList/orderList", {

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
    listHeight:"",
    bottomViewStyle: { showSelf: true },
    isShow:false,
    willPay:[],
    finishPay:[],
  },

  onNavigate: function (res) {
    this.preDataRequest();
  },
  //获取当前滑块的index
   bindchange:function(e){ 
     const that = this; 
     that.setData({ 
       currentData: e.detail.current 
       }) 
    }, 
    //点击切换，滑块index赋值 
    checkCurrent:function(e){ 
      const that = this; 
      if (that.data.currentData === e.target.dataset.current){
         return false;
       }else{ 
         that.setData({ 
           currentData: e.target.dataset.current
         }) 
      } 
    }, 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    that.preRefresh();
    wx.getSystemInfo({
      success:function(res){
        // console.log(res.screenHeight)
         that.setData({
           listHeight: res.windowHeight-40
         })
      }
    })
  },
  goDetail:function(e){
    console.log(e.currentTarget.dataset.id)
    wx.navigateTo({
      url: '../orderDetail/orderDetail?id='+e.currentTarget.dataset.id,
    })
  },
  preRefresh: function() {
    var res = this.$take('orderList'); 
    var willPays = []
    var finishPays = []
    if (res) {
      //this.handleData(res)
      for (var i = 0; i < res.length; i++) {
        if (res[i].statusId == 0) {
          willPays.push(res[i])
        } else if (res[i].statusId == 1) {
          finishPays.push(res[i])
        }
      }
      this.setData({
        list:res,
        willPay: willPays,
        finishPay: finishPays
      })
    }
    else {
      this.refresh();
    }
  },

  refresh: function () {
    
    this.hideLoading();
    // this.data.currentPage = 0;
    // this.setCurrentYear();
    this.data.list = [];
    // this.getData(this.data.currentPage, this.data.year);
   this.getData();
  
  },


  goPay: function (evt) {
    //service.setUrl($scope.centerId+'/courseOrder/'+item);
    var that = this;
    var url = config.orderStatus(evt.target.dataset.id)

    requestUtil.getRequest(url).then(res=>{
      
      // if (isPay) {
      //   return
      // }
      // isPay = true;
      var that = this;
      buyCardService.goBuyActivity(evt.target.dataset.id, evt.target.dataset.type, evt.target.dataset.source).then((res) => {
        console.log(res)
        buyCardService.goPay(res, function (tradeNo) {
         wx.showToast({
           title: '购买成功',
         })
          console.log(isPay)
          that.getData()
        })
        console.log(isPay)
        isPay = false;
      }).catch((err) => {
        wx.hideLoading();
        systemMessage.showModal('', err);
        isPay = false;
      })

    }).catch(err=>{
      isPay = false;
      that.getData()
    })
  },
  cancelOrder: function(evt){
    var that = this;
    var url = config.cancelOrder(evt.target.dataset.id)
    requestUtil.putRequest(url,null).then(res => {
      wx.showToast({
        title: '取消成功',
      })
      that.getData()
    }).catch(err => {
    })
  },


  // getData: function (page, year) {
  getData: function () {    
    // console.log(page,year,"page+year")
    if (app.globalData.token) {
      // wx.showLoading({
      //   title: '加载中',
      // })
      var that = this;
      // that.dataRequest(page, year, (res) => {
      //   that.handleData(res);
      // })
      that.dataRequest((res) => {
        // that.handleData(res);
        var willPays = []
        var finishPays = []
        for (var i = 0; i < res.length; i++) {
          if (res[i].statusId == 0) {
            willPays.push(res[i])
          } else if (res[i].statusId == 1) {
            finishPays.push(res[i])
          }
        }
        that.setData({
          list: res,
          willPay: willPays,
          finishPay: finishPays
        })
      })
    }
  },

  preDataRequest: function () {
    var that = this;
    that.data.currentPage = 0;
    that.setCurrentYear();
    that.data.list = [];
    // that.dataRequest(this.data.currentPage, this.data.year, (res) => {
    //   console.log(res,"res")
    //   that.$put('orderList', res);
    // })
    that.dataRequest((res) => {
      that.$put('orderList', res);
    })
  },

  // dataRequest: function (page, year, callBack) {
  //   orderService.orderList(page, year).then((res) => {
  //     console.log(res,"res111")
  //     callBack(res);
  //   })
  // },
  dataRequest: function(callBack) {
    var that=this
    orderService.orderList().then((res) => { 
      callBack(res);
    })
  },
  loadMore: function () {
    var that = this;
    let current = that.data.currentPage;
    let total = that.data.totalPages;
    if (current < total) {
      that.showLoadingMore();
      that.getData(current, that.data.year);
    }
    else {
      that.hideLoading();
    }
  },

  // handleData: function (res) {
  //   var that = this;
  //   that.data.totalPages = res.totalPages;
  //   var arr = res.data;
  //   console.log(res.data,"res.data")
  //   that.data.currentPage += 1;
  //   if (that.data.list.length != arr.length && arr.length > 0)
  //   {
  //     that.setData({
  //       list: that.data.list.concat(arr)
  //     });
  //     var arrCount = arr.length - 1;
  //     if (arrCount > 0) {
  //       that.data.year = arr[arrCount].courseYear;
  //     }
  //   }
  //   // this.drawLevels(that.data.list);
   
  // },

  showLoadingMore: function () {
    this.setData({
      isLoadingMore: true
    })
  },

  hideLoading: function () {
    this.setData({
      isLoadingMore: false
    });
    wx.stopPullDownRefresh();
  },

  setCurrentYear: function () {
    var d = new Date();
    this.data.year = String(d.getFullYear());
  },
  goCouponDetail:function(e){
    wx.navigateTo({
      url: '/pages/couponOrder/pages/orderDetail/orderDetail?onlineOrderId='+e.currentTarget.dataset.id,
    })
  },


  // checkDetail: function (e) {
  //   var that = this;
  //   let index = e.currentTarget.id;
  //   // let selectedId = that.data.list[index].id;
  //   // console.log(selectedId);
  //   // wx.navigateTo({
  //   //   url: "../orderDetail/orderDetail?orderId=" + index,
  //   // })
  // },

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
    this.$take('orderList');
    wx.switchTab({
      url: '/pages/mine/mine',
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      path: "/pages/index/index"
    }
  }
})