// pages/setup/setup.js

var loginService = require('../../service/loginService.js');
var config=require('../../config.js')
var requestUtil=require('../../utils/requestUtil.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listArr: [],
    status: 0,//服务密码状态：0：未设置；1：已设置，可修改
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var isother = wx.getStorageSync("isother")
    var listArr = [{
      img: "../../images/next.png",
      title: "服务密码",
      show:true
    },{
        img: "../../images/next.png",
        title: "切换账户",
        show: isother == 'false' || !isother?true:false
      
    },{
        img: "../../images/next.png",
        title: "服务协议",
        show: true
      }]
    that.setData({ listArr: listArr})
    this.getagree()
  },
  getagree() {
    var url = config.loginwxAppProtocol()
    requestUtil.getRequest(url).then(res => {
      this.data.listArr[2].show = res.showWxAppProtocol
      this.setData({
        agreecontent: res,
        listArr:this.data.listArr
      })
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
    // var servicePwd = wx.getStorageSync("servicePwd")
    // if (servicePwd){
    //   this.setData({ status: 1 })
    // }


    loginService.getUserAccount().then((res) => {
      if (res.account && res.account.password&&res.account.password.length>0){
        this.setData({ status: 1})
      }else{
        this.setData({ status: 0 })
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



  /*******页面点击事件*******/
  selectList: function(e){
    var idx = e.currentTarget.dataset.idx
    var path = idx == 0 ? '/pages/servicepassword/servicepassword?status=' + this.data.status : idx == 1 ?'/pages/account/account':'/pages/setup/agreement/agreement'
    wx.navigateTo({
      url: path,
    })
  },


})