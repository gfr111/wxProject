var rateLevel = (function () {
  function getStr(index) {
    switch (index) {
      case 1: return "非常不满意";
      case 2: return "不满意";
      case 3: return "一般";
      case 4: return "比较满意";
      case 5: return "非常满意";
    }
  }
  return {
    getStr: getStr
  }
})()

module.exports = rateLevel;