// pages/distribution//pages/saleRecord/saleRecord.js
var centerService = require("../../../../service/centerService.js"); 
var imgUrl = require("../../../../utils/uiUtils/imgUrl.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeList:[
      {name:'全部',id:'0'},
      {name: '今日', id: '1'},
      {name: '昨日', id: '2'},
      {name: '近七日', id: '3'}
    ],
    timeIndex:0,
    windowHeight:'',
    startDate:null,
    endDate: new Date().getFullYear() + "-" + (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1) + "-" + (new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()),
    defaultEndDate: new Date().getFullYear() + "-" + (new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : new Date().getMonth() + 1) + "-" + (new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()),
    date:'自定义时间',
    pageSize:20,
    pageNum:0,
    result:'',
    id:'',
    list:[],
    showMore:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id: options.id ? options.id : getApp().globalData.account.id
    })
    this.getlist();
  },
  getlist(){
    console.log(this.data.startDate,this.data.endDate)
    centerService.getSaleRecord(this.data.id,this.data.pageNum,this.data.pageSize,{
      startDate: this.data.startDate,
      endDate: this.data.endDate,
    }).then((res) => {
      if (res.data.length > 0) {
        for (var i = 0; i < res.data.length; i++) {
          var photo = imgUrl.getDefaultSpace(res.data[i].photo)
          res.data[i].photo = photo
        }
      }
      this.setData({
        result:res,
        list:res.data
      })
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value,
      startDate: e.detail.value,
      pageNum:0
    })
    this.getlist();
  },
  selectTime:function(e){
    this.setData({
      timeIndex: e.currentTarget.dataset.id,
      date:'自定义时间',
      pageNum:0
    })
    if (e.currentTarget.dataset.id==0){
      this.setData({
        startDate: null,
        endDate: this.data.defaultEndDate
      })
    } else if (e.currentTarget.dataset.id == 1) {
      this.setData({
        startDate: this.data.defaultEndDate,
        endDate: this.data.defaultEndDate
      })
    } else if (e.currentTarget.dataset.id == 2) {
      this.setData({
        startDate: this.fundate(-1),
        endDate: this.fundate(-1)
      })
    } else if (e.currentTarget.dataset.id == 3) {
      this.setData({
        startDate: this.fundate(-7),
        endDate: this.data.defaultEndDate
      })
    } 
    this.getlist();
  },
   fundate:function(num) {
    var date1 = new Date();
    //今天时间
    var time1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate()
    var date2 = new Date(date1);
    date2.setDate(date1.getDate() + num);
    //num是正数表示之后的时间，num负数表示之前的时间，0表示今天
     var time2 = date2.getFullYear() + "-" + (date2.getMonth() + 1 < 10 ? '0' + (date2.getMonth() + 1) : date2.getMonth() + 1) + "-" + (date2.getDate() < 10 ? '0' + date2.getDate() : date2.getDate());
    return time2;
  },
  showMore(){
    this.data.pageNum++;
    centerService.getSaleRecord(this.data.id, this.data.pageNum, this.data.pageSize, {
      startDate: this.data.startDate,
      endDate: this.data.endDate,
    }).then((res) => {
      if (res.data.length==0){
          wx.showToast({
            title: '暂无更多数据',
            icon:'none'
          })
        this.setData({
          showMore: false
        })
      }else{
        var arr=this.data.list
        res.data.forEach(function(item){
          var photo = imgUrl.getDefaultSpace(item.photo);
          item.photo = photo;
          arr.push(item);
        })
        this.setData({
          list:arr
        })
        console.log(arr)
      }
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
    var that=this;
    wx.getSystemInfo({
      success(res) {
        that.setData({
          windowHeight: res.windowHeight-120
        })
      }
    })
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

  }
})