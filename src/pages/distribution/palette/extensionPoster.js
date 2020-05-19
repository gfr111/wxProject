export default class LastMayday {
  palette(data) {
    console.log(data+'goods')
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
            left: '0',
            mode: 'aspectFill',
            top: '0'
          },
        },
        {
          type: 'image',
          url: data.qrcode,
          css: {
            width: '110rpx',
            height: '110rpx',
            right: '46rpx',
            bottom: '44rpx',
            background: '#ffffff',
          },
        },
        {
          type: 'text',
          text: '扫一扫识别',
          css: {
            fontSize: '16rpx',
            bottom: '60rpx',
            right: '22rpx',
            color: '#FFFFFF',
            width: '16rpx'
          },
        },
      ],
    });
  }
}