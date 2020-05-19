var btnClickUtil = (function(){
  
   function buttonClicked(self) {
     self.setData({
       buttonClicked : true
     });
     setTimeout(function () {
       self.setData({
         buttonClicked: false
       });
     }, 500);
   }


  return {
    buttonClicked: buttonClicked
  }
   

})();

module.exports = btnClickUtil;