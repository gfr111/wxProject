var btnUtil = (function () {

  function isOverReservEndTime(plannedDateStr, endTime) {
    let dateStr = plannedDateStr.replace(/-/g, "/")
    let dateTime = new Date(dateStr + " " + endTime);
    let currentDate = new Date();
    let interval = currentDate - dateTime;

    if (interval > 0) {
      return true;
    }
    else {
      return false;
    }

  }


  function btnStyle(item) {

    if (item.status == 8) {
      return {
        title: "去支付",
        btnStyle: 'oderActionBtn-greenBack',
        showSecond: true,
        showSelf: true,
        btnType: 'payBtn'
      };
    }
    else if (item.status == 2 && !item.rated) {
      return {
        title: "评价",
        btnStyle: 'oderActionBtn-greenBorder',
        showSecond: false,
        showSelf: true,
        btnType: 'evaluateBtn'
      };
    }
    else if (item.status == 5 && !item.rated) {

      var isOver = isOverReservEndTime(item.plannedDateStr, item.endTime);
      console.log("isOver" + isOver)
      if (isOver) {

        return {
          title: "评价",
          btnStyle: 'oderActionBtn-greenBorder',
          showSecond: false,
          showSelf: true,
          btnType: 'evaluateBtn'
        };

      }
      else {
        return {
          title: "评价",
          btnStyle: 'oderActionBtn-greenBorder',
          showSecond: false,
          showSelf: false,
          btnType: 'evaluateBtn'
        };
      }
    }
    else if (item.cancelable) {
      return {
        title: "取消预约",
        btnStyle: 'oderActionBtn-blackBorder',
        showSecond: false,
        showSelf: true,
        btnType: 'cancelBtn'
      };
    }
    else if (item.num) {
      return {
        showSelf: true,
      }
    } else {
      return {
        showSelf: false,
      }
    }
  }
  return {
    btnStyle: btnStyle
  }

})();

module.exports = btnUtil;