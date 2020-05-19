// pages/integral/integralChange.js
const centerServices = require("../../service/centerService.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentData: 0,
    run:null,
    list:[],
    myRank:null,
    loading:true,
    isShowTip:false,
    restrictMinWxSportCondition: null,
    missSteps:0,
    showRule:false,
    canGet:0,
    contect:null
  },
  /** * 生命周期函数--监听页面加载 */
  onLoad: function (options) {
    var that = this
    // 授权
    wx.authorize({ scope: "scope.werun" })

   
    wx.login({
      success:function(loginRes){
        console.log(loginRes+"登录成功");
         wx.getWeRunData({
          success: function (res) {
           
            centerServices.submitStepRequests({
              code: loginRes.code,
              openId: app.globalData.openId,
              encryptedData: res.encryptedData,
              iv: res.iv

            }).then((runData) => {
              runData=JSON.parse(runData);
              var steps= runData.stepInfoList;
              var step = steps[steps.length-1].step;
              console.log(steps)
              that.setData({
                  run:step
              })
              centerServices.stepExchangeIntegralRequest().then((res) => {
                console.log(res)
                if (res.restrictMinWxSport) {
                  if (that.data.run < res.restrictMinWxSportCondition || that.data.run < res.wxSportExchangeCondition){
                   
                    that.setData({
                      isShowTip:true,
                      missSteps: res.restrictMinWxSportCondition-that.data.run
                    })
                  }
                 
                } else {
                  if (that.data.run < res.wxSportExchangeCondition) {
                    that.setData({
                      isShowTip: true,
                      missSteps: res.wxSportExchangeCondition - that.data.run
                    })
                  }
                }
                that.setData({
                  list: res.rankList,
                  myRank: res.myRank,
                  wxSportExchangeCondition: res.wxSportExchangeCondition,
                  restrictMinWxSportCondition: res.restrictMinWxSportCondition,
                  wxSportUnitScore: res.wxSportUnitScore,
                  canGet: parseInt(that.data.run / res.wxSportExchangeCondition) * res.wxSportUnitScore,
                  hasExchanged: res.hasExchanged
                })
                if (res.wxSportExchangeCondition&&res.wxSportUnitScore){
                    that.setData({
                         loading:false
                    })
                }

              })



            })
          },
          fail: function(res){
            wx.getSetting({
              success(res) {
                if (!res.authSetting["scope.werun"]) {
                  wx.showModal({
                    content:'您未授权，请在小程序右上角打开微信运动授权',
                    showCancel:false
                  })
                }
              }
            })
          }
        })
        },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  openRule:function(){
    this.setData({
      showRule:true
    })
  },
  closeRule:function(){
    this.setData({
      showRule:false
    })
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
  join:function(e){
   if(!this.data.contect){
     this.data.contect=true;
     var that = this
     var total = parseInt(this.data.run / this.data.wxSportExchangeCondition) * this.data.wxSportUnitScore
     console.log(this.data.run)
     console.log(this.data.wxSportExchangeCondition)
     console.log(parseInt(this.data.run / this.data.wxSportExchangeCondition))
     centerServices.exchangeRequest(total).then((res) => {
       that.setData({
         list: res.rankList,
         myRank: res.myRank,
         hasExchanged: res.hasExchanged
       })
       this.data.contect = false
     }).catch(err=>{
       this.data.contect = false
     })
     
   }
  }
})