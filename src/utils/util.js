function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}



const formatdate = date => {
  date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return month + '月' + day + '日 ' + hour + ':' + minute
}
const getdates = date => {
  date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return year+'.' +month + '.' + day
}

function timestampToTimeStr(tmstp) {
  if (tmstp) {
    var date = new Date(tmstp);
    return formatTime(date);
  }
  return "";
}

function intervalSinceNow(dateStr) {
  let temp = dateStr.replace(/-/g, "/")
  let date = new Date(temp);
  console.log("courseTime------" + date);
  let dateStamp = Math.round(date / 1000);
  let currentStamp = Math.round(new Date() / 1000);
  console.log("currentTime------" + new Date());
  let interval = dateStamp - currentStamp;
  console.log("timeInterval------" + interval);
  return interval;

}
function get_time_diff(time) {
  var diff = '';
  var time_diff = time - new Date().getTime();
  // 计算相差天数  
  var days = Math.floor(time_diff / (24 * 3600 * 1000));
  if (days > 0) {
    diff += days + '天';
  }
  // 计算相差小时数  
  var leave1 = time_diff % (24 * 3600 * 1000);
  var hours = Math.floor(leave1 / (3600 * 1000));
  if (hours > 0) {
    diff += hours + '时';
  } else {
    if (diff !== '') {
      diff += hours + '时';
    }
  }
  // 计算相差分钟数  
  var leave2 = leave1 % (3600 * 1000);
  var minutes = Math.floor(leave2 / (60 * 1000));
  if (minutes > 0) {
    diff += minutes + '分';
  } else {
    if (diff !== '') {
      diff += minutes + '分';
    }
  }
  // 计算相差秒数  
  var leave3 = leave2 % (60 * 1000);
  var seconds = Math.round(leave3 / 1000);
  if (seconds > 0) {
    diff += seconds + '秒';
  } else {
    if (diff !== '') {
      diff += seconds + '秒';
    }
  }
  return diff;
};
function currentTimeStamp() {
  return Math.round(new Date() / 1000);
}

// 获取指定月份的天数
function getDaysWithYearAndMonth(year, month) {
  var d = new Date(year, month, 0);
  return d.getDate();
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function getWeekendStr(day) {
  if (day == 1) {
    return '周一'
  } else if (day == 2) {
    return '周二'
  } else if (day == 3) {
    return '周三'
  } else if (day == 4) {
    return '周四'
  } else if (day == 5) {
    return '周五'
  } else if (day == 6) {
    return '周六'
  } else if (day == 0) {
    return '周日'
  }
}

// 比较传入时间与现在时间的大小 传入时间大则返true 否则返回false
function compareWithCurrentTime(time) {
  var timeArr = time.split(":")
  var date = new Date()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var timeHour = timeArr[0]
  var timeMinute = timeArr[1]
  if (hour < timeHour) {
    return true
  } else if (hour == timeHour) {
    if (minute < timeMinute) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

// 传入开始时间 开始前多久可以预约 返回距离开始多久
function getCountDonwSeconds(startTime, canReserveHoursBeforeStart) {
  var timeArr = startTime.split(":")
  var startHour = parseInt(timeArr[0])
  var startMinute = parseInt(timeArr[1])
  var startSecond = (startHour * 60 + startMinute) * 60 // 开始的时间
  var date = new Date()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  var currentSecond = (hour * 60 + minute) * 60 + second
  return startSecond - canReserveHoursBeforeStart * 3600 - currentSecond
}

function getMinuteStr(seconds) {
  var secondStr = seconds % 60
  var minuteStr = parseInt(seconds / 60)
  if (secondStr < 10) {
    return minuteStr + ':0' + secondStr
  } else {
    return minuteStr + ':' + secondStr
  }
}

function canReserveGroupCourse(dateItem, startTime, canReserveHoursBeforeStart) {
 // console.log('//////////' + JSON.stringify(dateItem) + '-' + startTime + '-' + canReserveHoursBeforeStart)
  var currentSecond = Date.parse(new Date());
  currentSecond = parseInt(currentSecond / 1000 / 60);
  //console.log(currentSecond)
  var timeArr = startTime.split(":")
  var date = new Date("2000-0-1")
  date.setFullYear(dateItem.year)
  date.setMonth(dateItem.month-1)
  date.setDate(dateItem.date)
  date.setHours(parseInt(timeArr[0]))
  date.setMinutes(parseInt(timeArr[1]))
  // console.log(date.getMonth())
  var startSecond = Date.parse(date)
  // console.log(startSecond)
  startSecond = parseInt(startSecond / 1000 / 60)

  var seconds = startSecond - currentSecond
  var canReserveSeconds = canReserveHoursBeforeStart * 60
  if (seconds <=canReserveSeconds) {
    // 可以预约了
    return true
  } else {
    //console.log('////--' + date + '-' + seconds + '-' + canReserveSeconds)
    // 还未开放预约
    return false
  }
}

/**
 * 时间戳转化为年 月 日 时 分 秒
 * number: 传入时间戳
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致
*/
function formatTimec(number, format) {

  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];

 // var date = new Date(number * 1000);
  var date = new Date(number);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));
  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}
//浮点数加法运算
function floatAdd(a, b) {
  var c, d, e;
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  return e = Math.pow(10, Math.max(c, d)), (mul(a, e) + mul(b, e)) / e;
}

//浮点数减法运算
function floatSub(a, b) {
  var c, d, e;
  try {
    c = a.toString().split(".")[1].length;
  } catch (f) {
    c = 0;
  }
  try {
    d = b.toString().split(".")[1].length;
  } catch (f) {
    d = 0;
  }
  return e = Math.pow(10, Math.max(c, d)), (mul(a, e) - mul(b, e)) / e;
}
function mul(a, b) {
  var c = 0,
    d = a.toString(),
    e = b.toString();
  try {
    c += d.split(".")[1].length;
  } catch (f) { }
  try {
    c += e.split(".")[1].length;
  } catch (f) { }
  return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
}
function div(a, b) {
  var c, d, e = 0,
    f = 0;
  try {
    e = a.toString().split(".")[1].length;
  } catch (g) { }
  try {
    f = b.toString().split(".")[1].length;
  } catch (g) { }
  return c = Number(a.toString().replace(".", "")), d = Number(b.toString().replace(".", "")), mul(c / d, Math.pow(10, f - e));
}



/**
 * 将富文本格式的数据处理为文本数据
 */
function html2Text(content) {
  var text = "" + content;
  text = text.replace(/<\/div>/ig, '\r\n');
  text = text.replace(/<\/li>/ig, '\r\n');
  text = text.replace(/<li>/ig, '  *  ');
  text = text.replace(/<\/ul>/ig, '\r\n');

  //-- remove BR tags and replace them with line break
  text = text.replace(/<br\s*[\/]?>/gi, "\r\n");

  //-- remove P and A tags but preserve what's inside of them
  text = text.replace(/<p.*?>/gi, "\r\n");
  text = text.replace(/<a.*href="(.*?)".*>(.*?)<\/a>/gi, " $2 ($1)");

  //-- remove all inside SCRIPT and STYLE tags
  text = text.replace(/<script.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/script>/gi, "");
  text = text.replace(/<style.*>[\w\W]{1,}(.*?)[\w\W]{1,}<\/style>/gi, "");
  //-- remove all else
  text = text.replace(/<(?:.|\s)*?>/g, "");

  //-- get rid of more than 2 multiple line breaks:
  text = text.replace(/(?:(?:\r\n|\r|\n)\s*){2,}/gim, "\r\n\r\n");

  //-- get rid of more than 2 spaces:
  text = text.replace(/ +(?= )/g, '');

  //-- get rid of html-encoded characters:
  text = text.replace(/ /gi, " ");
  text = text.replace(/&/gi, "&");
  text = text.replace(/"/gi, '"');
  text = text.replace(/</gi, '<');
  text = text.replace(/>/gi, '>');
  text = text.replace(/\s+/gi, '');

  return text;
}

module.exports = {
  formatTime: formatTime,
  getDaysWithYearAndMonth: getDaysWithYearAndMonth,
  getWeekendStr: getWeekendStr,
  compareWithCurrentTime: compareWithCurrentTime,
  timestampToTimeStr: timestampToTimeStr,
  getCountDonwSeconds: getCountDonwSeconds,
  getMinuteStr: getMinuteStr,
  formatTimec: formatTimec,
  canReserveGroupCourse: canReserveGroupCourse,
  floatAdd: floatAdd,
  floatSub: floatSub,
  intervalSinceNow: intervalSinceNow,
  mul:mul,
  div:div,
  getdates,
  get_time_diff,
  html2Text
};
