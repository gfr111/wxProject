var requestUtil = require('../utils/requestUtil.js');
var config = require('../config.js');

function getCourseInfor(item) {
  // ios不兼容2019-7-12，修改成为2019/7/12，添加星期几信息
  var date = item.date
  let system = '',
    s = date
  wx.getSystemInfo({
    success: function(res) {
      system = res.system
    },
  })
  if (system.indexOf("iOS") == 0) {
    s = date.replace(/\-/g, '/')
  }
  var weks = new Date(s);
  console.log(weks)
  let wek = "星期" + "日一二三四五六".charAt(weks.getDay());
  // -----------
  var arr = [{
      title: '课程日期',
      detail: item.date + '          ' + wek
    },
    {
      title: '课程时间',
      detail: item.startTime + "~" + item.endTime
    },
    {
      title: '上课教练',
      detail: item.trainerName
    },
  ]
  return arr;
}

function getSeatDetailStr(item) {
  if (item.seatEnabled) {
    return ""
  } else {
    return "1人"
  }
}

function getSeatViewHeight(item) {
  var seatCount = item.seatCount
  var lineCount = 0
  if (seatCount % 8 == 0) {
    lineCount = parseInt(seatCount / 8)
  } else {
    lineCount = parseInt(seatCount / 8) + 1
  }
  // console.log(lineCount)
  return 88 * lineCount + 582
}

function getGroupCourseDetail(centerId = null, instanceId, courseId) {
  var url = config.getGroupCourseDetailUrl(centerId, instanceId, courseId)
  return requestUtil.getRequest(url, true)
}



function getPayPrice(card, seatCount) {
  if (card.payPrice == null) {
    return 0;
  } else {
    return card.payPrice * seatCount
  }
}

function getSeatInforArray(seatCount, selectedArray) {
  var seatArray = []
  for (var i = 0; i < seatCount; i++) {
    var location = {
      left: 36 + (i % 8) * 88,
      top: 444 + parseInt(i / 8) * 88,
      selectStatus: 0
    }
    seatArray.push(location)
  }
  if (selectedArray.length > 0) {
    for (var i = 0; i < selectedArray.length; i++) {
      var index = selectedArray[i] - 1
      var location = seatArray[index]
      location["selectStatus"] = 2
      seatArray.splice(index, 1, location)
    }
  }
  return seatArray
}

function getSeatArray(instanceId) {
  var url = config.getGroupCourseAppointmentSeatArrayUrl(instanceId)
  return requestUtil.getRequest(url)
}

function seatSelect(seatArray, maxSelectCount, event, currentSeatSelectArray, callBack) {
  var index = event.currentTarget.id
  var item = seatArray[index]
  if (item.selectStatus == 1) {
    item["selectStatus"] = 0
    seatArray.splice(index, 1, item)
    for (var i = 0; i < currentSeatSelectArray.length; i++) {
      if (currentSeatSelectArray[i] == index) {
        currentSeatSelectArray.splice(i, 1)
      }
    }
    callBack(seatArray, currentSeatSelectArray)
  } else if (currentSeatSelectArray.length < maxSelectCount) {
    item["selectStatus"] = 1
    seatArray.splice(index, 1, item)
    currentSeatSelectArray.push(index)
    callBack(seatArray, currentSeatSelectArray)
  }
}

function getCurrentSeatSelectArray(seatArray, callBack) {
  var currentSeatSelectArray = []
  var seatTitle = ''
  for (var i = 0; i < seatArray.length; i++) {
    var item = seatArray[i]
    if (item.selectStatus == 1) {
      currentSeatSelectArray.push(i)
      if (seatTitle == '') {
        seatTitle = (i + 1)
      } else {
        seatTitle = seatTitle + ',' + (i + 1)
      }
    }
  }
  callBack(currentSeatSelectArray, seatTitle)
}

function appointmentConfirm(courseDetail, selectedCard, currentSeatSelectArray, payPrice, couponInstanceId) {
  var data = {
    cardContractId: selectedCard.contractId,
    cardType: selectedCard.cardType,
    couponInstanceId: couponInstanceId
  }
  if (courseDetail.seatEnabled) {
    var currentSeatSelectArrayCopy = []
    for (var i = 0; i < currentSeatSelectArray.length; i++) {
      currentSeatSelectArrayCopy.push(currentSeatSelectArray[i] + 1)
    }
    data["seatNums"] = currentSeatSelectArrayCopy,
      data["reservedNum"] = currentSeatSelectArray.length
  } else {
    data["reservedNum"] = currentSeatSelectArray.length
  }
  if (selectedCard.isPay) {
    data.isPay = selectedCard.isPay;
    data.payAmount = payPrice;
    data.payPrice = selectedCard.payPrice;
    data.cardName = selectedCard.cardName;
    data.startTime = courseDetail.startTime;
    data.endTime = courseDetail.endTime;
    data.courseName = courseDetail.name;

    if (selectedCard.cardId == -1 && courseDetail.isNoCard) {
      data.isNoCard = true;
    } else {
      data.isNoCard = false;
    }
    if (selectedCard.cardId == -2 && courseDetail.isNoEffectiveCard) {
      data.isNoEffectiveCard = true
    } else {
      data.isNoEffectiveCard = false
    }
    if (selectedCard.payPrice === 0) {
      data.isPay = false
    }
  }
  let url = config.appointmentConfirmUrl(courseDetail.instanceId)

  return requestUtil.postRequest(url, data)

}

function allSeatSelectedCancel(seatArray) {
  var seatArrayCopy = seatArray
  for (var i = 0; i < seatArrayCopy.length; i++) {
    var item = seatArrayCopy[i]
    if (item.selectStatus == 1) {
      item["selectStatus"] = 0
      seatArray.splice(i, 1, item)
    }
  }
  return seatArray
}

module.exports = {
  getCourseInfor: getCourseInfor,
  getSeatDetailStr: getSeatDetailStr,
  getSeatViewHeight: getSeatViewHeight,
  getGroupCourseDetail: getGroupCourseDetail,
  getPayPrice: getPayPrice,
  getSeatInforArray: getSeatInforArray,
  getSeatArray: getSeatArray,
  seatSelect: seatSelect,
  getCurrentSeatSelectArray: getCurrentSeatSelectArray,
  appointmentConfirm: appointmentConfirm,
  allSeatSelectedCancel: allSeatSelectedCancel
}