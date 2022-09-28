// 获取应用实例
const app = getApp()
import { saveImg } from '../../utils/globalFunction'
Page({
  data: {
    flash: 'off',
    position: 'back',
    src: '',
    time: 5,
    showText: false,
    interval: 0,
    camera: false,
    location:app.globalData.location,
    weather:{},
  },
  takePhoto2() {
    var that = this
    if(app.globalData.location==null){
      that.showCheck()
      return
    }
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: async (restp) => {
        await new Promise(function (resolve, reject) {
          that.selectComponent("#myCanvas").direction(restp.tempImagePath)
          that.setData({
            camera: false
          })
        })
      }
    })
  },

  error(e:any) {
    console.log(e.detail)
  },
  changePosition(){
    var that = this
    that.setData({
      position:that.data.position=='back'?'front':'back'
    })
  },
  changeFlash(){
    var that = this
    that.setData({
      flash:that.data.flash=='on'?'off':'on'
    })
  },
  saveImg(){
    var that = this
    saveImg(that.data.src)
    setTimeout(() => {
      that.retake()
    }, 1000);
  },
  timeout(){
    var that = this
    //定时任务，定时几秒钟后进行拍摄
    this.setData({
      showText:true
    })
  
    that.data.interval = setInterval(()=>{
      let time = that.data.time - 1
      if(time==0){
        clearInterval(that.data.interval)
        that.setData({
          time:5,
          showText:false
        })
        this.takePhoto2()
      }else{
        that.setData({
          time:time
        })
      }

    },1000)
  },
  retake(){
    this.setData({
      src: '',
      camera: true
    })
    console.log(this.data.camera)
    this.onLoad()
  },
  onLoad(){
    wx.showLoading({ title: "正在加载中..." })
		const that = this
		wx.getSetting({
			success: res => {
				if (res.authSetting['scope.camera']) {
					// 用户已经授权
					wx.hideLoading()
          that.setData({ camera: true })
				} else {
					// 用户还没有授权，向用户发起授权请求
					wx.authorize({
						scope: 'scope.camera',
						success() { // 用户同意授权
							wx.hideLoading()
							that.setData({ camera: true })
						},
						fail() { // 用户不同意授权
							that.openSetting().then(res => {
								wx.hideLoading()
								that.setData({ camera: true })
							})
						}
					})
				}
			},
			fail: res => {
				wx.hideLoading()
				console.log('获取用户授权信息失败')
			}
		})
  },
  openSetting: function () {
		const that = this
		let promise = new Promise((resolve, reject) => {
		wx.showModal({
		  title: '授权',
		  content: '请先授权获取摄像头权限',
		  success(res) {
			if (res.confirm) {
			  wx.openSetting({
				success(res) {
          if (res.authSetting['scope.camera']) { // 用户打开了授权开关
            that.onLoad()
					  resolve(true)
				  } else { // 用户没有打开授权开关， 继续打开设置页面
					that.openSetting().then(res => { resolve(true) })
				  }
				},
				fail(res) {
				  console.log(res)
				}
			  })
			} else if (res.cancel) {
        //按下了取消按钮
        // that.openSetting().then(res => { resolve(true) })
        wx.navigateBack()
			}
		  }
	  })
	  })
	  return promise;
	},
  onShow(){
    this.selectComponent("#location").getUserLocation()
    this.setData({
      location: app.globalData.location,
      weather:app.globalData.weather
    })
  },
  showCheck(){
    this.selectComponent("#location").position()
  },
  myEvent(e:any){
    console.log(e)
    this.setData({
      src:e.detail.src
    })
  }
})
