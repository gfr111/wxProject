// pages/agreement/agreement.js
var buyCardService = require("../../service/buyCardService.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    descrip:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that=this
    
    if (options.tp == 1) {
      buyCardService.lookForAgreementR(options.protocolId).then((res)=>{
        this.setData({
          descrip: res.replace(/\n|\r/g, '<br>')
        })
      })
    }else{
      buyCardService.getAgreement(options.type ? options.type : null).then((res) => {
        // var article = res;
        this.setData({
          descrip: res.replace(/\n|\r/g, '<br>')
        })
      })
    }
  },

})