var util = require('../utils/util.js');
var requestUtil = require('../utils/requestUtil.js');
var config = require('../config.js');
// 获取往后指定天数的数组
function getDaysWithDayCount(count) {
  var allDays = []
  // 1.获取今天零点的时间戳
  var start = new Date();
  start.setHours(0);
  start.setMinutes(0);
  start.setSeconds(0);
  start.setMilliseconds(0);
  var todayStartTime = Date.parse(start) / 1000;

  var days = []
  // 获取后面每一天零点的时间戳
  for (var i = 0; i < count; i++) {
    var time = todayStartTime + 24 * 60 * 60 * i;
    var newDate = new Date();
    newDate.setTime(time * 1000);
    var dateStr = ''
    if ((newDate.getMonth() + 1 < 10) && (newDate.getDate() < 10)) {

      dateStr = newDate.getFullYear() + '0' + (newDate.getMonth() + 1) + '0' + newDate.getDate()
    } else if ((newDate.getMonth() + 1 < 10)) {

      dateStr = newDate.getFullYear() + '0' + (newDate.getMonth() + 1) + '' + newDate.getDate()
    } else if ((newDate.getDate() < 10)) {

      dateStr = newDate.getFullYear() + '' + (newDate.getMonth() + 1) + '0' + newDate.getDate()
    } else {

      dateStr = newDate.getFullYear() + '' + (newDate.getMonth() + 1) + '' + newDate.getDate()
    }
    var dayDate = {
      year: newDate.getFullYear(),
      month: newDate.getMonth() + 1,
      date: newDate.getDate(),
      day: util.getWeekendStr(newDate.getDay()),
      index: 'day' + (i - 5 * allDays.length),
      dateStr: dateStr
    }
    days.push(dayDate)
    if ((i + 1) % 5 == 0) {
      allDays.push(days)
      days = []
    }
  }
  return allDays
}

function getGroupCourseList(date) {
  var url = config.groupCourseList(date)
  return requestUtil.getRequest(url)
}

function getInvaildArrayAndVaildArray(result, index, currentWeekIndex, dateItem, callBack) {
  var vaildArray = []
  var invaildArray = []
  for (var i = 0; i < result.length; i++) {
    var item = result[i]
    if (item.courseStatus == 1 || item.courseStatus == 4 || item.courseStatus == 5 || item.courseStatus == 3) {
      if (index == 0 && currentWeekIndex == 0) {
        // 是当天
        if (util.compareWithCurrentTime(item.startTime)) {
          // 未到上课时间
          if (item.courseStatus == 1 && item.canReserveHoursBeforeStart != null) {
            // 设置了开课前可预约时间
            if (util.canReserveGroupCourse(dateItem, item.startTime, item.canReserveHoursBeforeStart)) {
              item.courseStatus = 1
            } else {
              item.courseStatus = 5
              var startTimeArr = item.startTime.split(":")
              var time = startTimeArr[0] * 60 + (startTimeArr[1] * 1) - item.canReserveMinutesBeforeStart

              var h =parseInt(time/60)
              var m = (time % 60) < 10 ?'0'+ (time % 60) : (time % 60)
              item.courseStatus = 5
              item["countDown"] = h + ':' + m + '开放'
            }
            vaildArray.push(item)
          } else {
            vaildArray.push(item)
          }
        } else {
          // 已过上课时间
          item.courseStatus = 2
          invaildArray.push(item)
        }
      } else {
        // 不是今天
        if (item.courseStatus == 1 && item.canReserveHoursBeforeStart != null) {
          // 设置了开课前可预约时间
          if (util.canReserveGroupCourse(dateItem, item.startTime, item.canReserveHoursBeforeStart)) {
            item.courseStatus = 1
          } else {
            item.courseStatus = 5
          }
        }
        vaildArray.push(item)
      }
    } else {
      // if (item.courseStatus == 1) {
      //   item.courseStatus = 2
      // }
      invaildArray.push(item)
    }
  }

  callBack(vaildArray, invaildArray)
}





function reserveCountDown(list, callBack) {
  var existCountDown = false
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    if (item.courseStatus == 5 && item["countDown"] != null) {
      if (item["countDown"] == '00:00') {
        item.courseStatus == 1
        item["countDown"] == null
      } else {
        var countDown = item["countDown"]
        var countDownArray = countDown.split(":")
        var countDownSecond = parseInt(countDownArray[0]) * 60 + parseInt(countDownArray[1])
        item["countDown"] = util.getMinuteStr(countDownSecond - 1)
        existCountDown = true
      }
      list.splice(i, 1, item)
    }
  }
  callBack(list, existCountDown)
}

module.exports =
  {
    getDaysWithDayCount: getDaysWithDayCount,
    getGroupCourseList: getGroupCourseList,
    getInvaildArrayAndVaildArray: getInvaildArrayAndVaildArray,
    reserveCountDown: reserveCountDown
  }