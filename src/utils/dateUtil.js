
var dateUtil = (function() {
    function chineseDateStr(dateStr) {
      return dateStr.replace(".", "月") + "日"
    }
    return {
      chineseDateStr:chineseDateStr
    }
})()


module.exports = dateUtil;
