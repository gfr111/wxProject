
// pages/cardsPurchaseOnline/availableCardsList.js
var app = getApp();
var systemMessage = require("../../SystemMessage.js");
var buyCardService = require("../../service/buyCardService.js");
var loginService = require('../../service/loginService.js');
var P = require('../../lib/wxpage.js');
var authenticationUtil = require("../../utils/authenticationUtil.js");
P("courseAndCar/courseAndCar", {

  /**
   * 页面的初始数据
   */
  data: {
    cards: [],
    course: [],
    centerName: "",
    currentData: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoaded(){
console.log(123)
  },
  onLoad: function (options) {
    console.log(789)
    authenticationUtil.checkAuth(res=>{
      if (options.centerId) {
        app.globalData.selectCenter = {
          id: options.centerId
        }
        loginService.getCenterList().then((res) => {
          res.map(item => {
            if (item.id == options.centerId) {
              console.log(item)
              app.globalData.selectCenter = item
              wx.setStorageSync('selectCenterKey', item)
              this.setData({
                selectCenter: item
              })
            }
          })
          console.log(app.globalData.selectCenter)
          this.getData();
        })
      } else {
        this.getData();
      }
    })

  },
  getData() {
    buyCardService.getSellCards().then((res) => {
      this.setData({
        cards: res.cards
      })
    }).catch(err => {
      console.log(err)
    })

  },
  /**
* 用户点击右上角分享
*/
  onShareAppMessage: function () {

  }
})