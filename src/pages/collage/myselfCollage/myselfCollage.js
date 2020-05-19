
Page({

  /**

   * 页面的初始数据

   */

  data: {

    timer: '',//定时器名字

    countDownNum: '10'//倒计时初始值

  },



  onShow: function () {

    //什么时候触发倒计时，就在什么地方调用这个函数

    this.countDown();

  },



  countDown: function () {

    let that = this;

    let countDownNum = that.data.countDownNum;//获取倒计时初始值

    //如果将定时器设置在外面，那么用户就看不到countDownNum的数值动态变化，所以要把定时器存进data里面

    that.setData({

      timer: setInterval(function () {//这里把setInterval赋值给变量名为timer的变量

        //每隔一秒countDownNum就减一，实现同步

        countDownNum--;

        //然后把countDownNum存进data，好让用户知道时间在倒计着

        that.setData({

          countDownNum: countDownNum

        })

        //在倒计时还未到0时，这中间可以做其他的事情，按项目需求来

        if (countDownNum == 0) {

          //这里特别要注意，计时器是始终一直在走的，如果你的时间为0，那么就要关掉定时器！不然相当耗性能

          //因为timer是存在data里面的，所以在关掉时，也要在data里取出后再关闭

          clearInterval(that.data.timer);

          //关闭定时器之后，可作其他处理codes go here

        }

      }, 1000)

    })

  }

})
