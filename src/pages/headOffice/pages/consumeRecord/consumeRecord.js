// pages/expenseDetail/expenseDetail.js
var requestUtil = require('../../../../utils/requestUtil.js')
var config = require("../../../../config.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: ["全部", "消费", "扣卡", "延卡"],
    opentype: false,
    date: "",
    type: "-1",
    typeword: "全部类型",
    pageNum: 0,
    dates: "",
    cardData: [],
    chooseId: 0,
    ismore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      cardId: options.id
    })
    this.getdate()
    this.req()
  },

  gettype() {
    this.setData({
      opentype: !this.data.opentype
    })
  },
  showalls(e) {
    console.log(e)
    var id = e.currentTarget.id
    this.data.cardData.logs.data[id].btn = !this.data.cardData.logs.data[id].btn
    this.setData({
      cardData: this.data.cardData
    })
  },
  aa() {
    console.log(("aa"))
  },
  bindDateChange(e) {
    var value = e.detail.value.replace("-", "年") + "日"
    this.setData({
      date: value,
      dates: e.detail.value,
      pageNum: 0
    })
    this.req()

  },
  getdate() {
    var date = new Date()
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    month = month.toString()
    month = month[1] ? month : '0' + month
    this.setData({
      date: year + "年" + month + "日",
      dates: year + "-" + month
    })
  },
  choosetype(e) {
    var id = e.currentTarget.id,
      typeid = id == 0 ? "-1" : id == 1 ? "16" : id == 2 ? "12" : "2",
      typeword = id == 0 ? "全部类型" : this.data.types[id]
    this.setData({
      typeword: typeword,
      type: typeid,
      pageNum: 0,
      chooseId: id,
      opentype: false
    })
    this.req()
  },
  req() {
    var data = {
      type: this.data.type,
      time: this.data.dates
    }
    var url = config.consumeDetail(this.data.pageNum)
    requestUtil.postRequest(url, data).then(res => {
      if (res.logs && res.logs.data) {
        res.logs.data.map((item, index) => {
          let color = (item.cardChangeAmount + "").indexOf("-") == -1 ? true : false
          let time = this.getTime(item.logTime)
          let {
            bigmoney,
            smallmoney
          } = this.getmoney(item.cardChangeAmount)



          if (item.opDetails) {
            item.opDetails.length > 10 ? item.showall = item.opDetails.slice(0, 10) + "..." : ""
            item.btn = item.opDetails.length > 10 ? true : false

          } else if (item.remarks) {
            item.remarks.length > 10 ? item.showall = item.remarks.slice(0, 10) + "..." : ""
            item.btn = item.remarks.length > 10 ? true : false

          }


          item.time = time
          item.bigmoney = bigmoney
          item.smallmoney = smallmoney
          item.color = color

        })
      }
      var ismore = res.logs.data.length < 20 ? false : true,
        newData = res,
        cardData = this.data.pageNum > 0 ? this.data.cardData.logs.data.concat(res.logs.data) : res.logs.data
      newData.logs.data = cardData
      console.log(cardData, this.data.pageNum)
      this.setData({
        pageNum: ++this.data.pageNum,
        cardData: newData,
        ismore: ismore
      })
    })

  },
  getTime(dates) {
    var date = new Date(dates)
    var month = date.getMonth() + 1,
      day = date.getDate(),
      hour = date.getHours(),
      minute = date.getMinutes(),
      second = date.getSeconds(),
      time
    return time = month + "月" + day + "日  " + hour + ":" + minute
  },
  getmoney(money) {
    money += ''
    money = money.indexOf("-") == -1 ? "+" + money : money
    let index = money.indexOf("."),
      index2 = index + 1
    if (index == -1) {
      return {
        bigmoney: money
      }
    } else {
      return {
        bigmoney: money.slice(0, index),
        smallmoney: money.slice(index2)
      }
    }

  },

  onReachBottom() {
    if (this.data.ismore) {
      this.req()
    }

  }
})