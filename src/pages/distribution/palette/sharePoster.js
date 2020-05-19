export default class LastMayday {
  palette(data) {
    console.log(data)
    return ({
      width: '578rpx',
      height: '1000rpx',
      background: '',
      views: [
        {
          type: 'image',
          url: data.background,
          css: {
            width: '578rpx',
            height: '1000rpx',
            left:'0',
            mode: 'aspectFill',
            top:'0'
          },
        }
        , {
          type: 'rect',
          css: {
            color: 'rgba(255, 255, 255, 0.9)',
            left: '32rpx',
            width: '510rpx',
            height: '114rpx',
            bottom: '26rpx',
            borderRadius: '8rpx'
          },
        }, {
          type: 'image',
          url: data.photo,
          css: {
            width: '70rpx',
            height: '70rpx',
            left: '52rpx',
            mode: 'aspectFill',
            bottom: '48rpx',
            borderRadius: '35rpx'
          },
        }, {
          type: 'text',
          text: data.name,
          css: {
            bottom: '90rpx',
            fontSize: '28rpx',
            color: '#303030',
            left: '132rpx'
          },
        }, {
          type: 'text',
          text: '邀请一起加入，邀请赢奖励',
          css: {
            bottom: '52rpx',
            fontSize: '20rpx',
            color: '#686868',
            left: '132rpx'
          },
        }, {
          type: 'image',
          url: data.qrcode,
          css: {
            width: '90rpx',
            height: '90rpx',
            right: '64rpx',
            bottom: '36rpx'
          },
        },
      ],
    });
  }
}