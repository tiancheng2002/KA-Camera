// Componet/Componet.js
const utils = require('../../utils/util')
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
   properties: {
      camera: Boolean
   },
  /**
   * 组件的初始数据
   */
   data: {
    canvasWidth:0,
    canvasHeight:0,
    width:wx.getSystemInfoSync().windowWidth,
    logoImg: 'https://pic1.imgdb.cn/item/6333c45816f2c2beb1d44e3d.png'
   },
  /**
   * 组件的方法列表
   */
   methods: {
    direction(path:string){
      var that = this
      wx.startDeviceMotionListening({
        success:function(e){
          // console.log("获取手机方向")
          // 监听设备方向变化事件
          wx.onDeviceMotionChange(function(resodm){
            // console.log(resodm)
            //创建 canvas 的绘图上下文 CanvasContext 对象
            let canvasContext = wx.createCanvasContext('my-canvas',that)
            // Y 轴转动的夹角（gamma）大于40或者小于-40时认为为横屏拍摄
            wx.getImageInfo({
              src: path,
              success(resgi){
                // console.log("resgi:",resgi)
                if (resodm.gamma < -40 || resodm.gamma > 40){
                  //手机为横屏
                  // 计算宽高比例
                  let rate = resgi.width / resgi.height 
                  //将高度（也就是旋转后的宽度）固定为730（因为小程序宽度为750rpx）
                  let height = that.data.width
                  //通过比例获取旋转后的宽度
                  let width = height*rate
                  //存放旋转后的图片的画布的宽高
                  that.setData({
                    canvasWidth:height,
                    canvasHeight:width,
                  })
                  
                  canvasContext.translate(height / 2, width / 2)
                  if(resodm.gamma < -40){
                    //开始旋转操作，gamma小于-40顺时针旋转90度
                    canvasContext.rotate(-90 * Math.PI / 180)
                  }else{
                    //开始旋转操作，gamma小于40逆时针旋转90度
                    canvasContext.rotate(90 * Math.PI / 180)
                  }
                  canvasContext.drawImage(path, -width / 2, -height / 2, width, height)
                }else{
                  let rate = resgi.height / resgi.width 
                  let width = that.data.width
                  let height = that.data.width * rate
                  that.setData({
                    canvasWidth:width,
                    canvasHeight:height,
                  })
                  if(resgi.orientation=='down'){
                    canvasContext.translate(width / 2, height / 2)
                    canvasContext.rotate(180 * Math.PI / 180)
                    canvasContext.drawImage(path, -width / 2, -height / 2, width, height);
                  }else{
                    // console.log("图片宽度："+width)
                    // console.log("图片高度："+height)
                    canvasContext.drawImage(path, 0, 0, width, height);
                  }
                }
                //取消监听设备方向变化事件
                wx.offDeviceMotionChange()
                
                // console.log("图片宽度："+width)
                // console.log("图片高度："+height)
                canvasContext.draw(false,async() => { // 将之前在绘图上下文中的描述（路径、变形、样式）画到 canvas 中
                  await new Promise(function(resolve,reject){
                    wx.canvasToTempFilePath({ // 把当前画布指定区域的内容导出生成指定大小的图片。在 draw() 回调里调用该方法才能保证图片导出成功。
                      canvasId: 'my-canvas',
                      success(res) {
                        // console.log( "wx.canvasToTempFilePath")
                        // console.log( "横屏信息",res)
                        let filePath = res.tempFilePath
                        that.drawText(canvasContext,filePath)
                      }
                    }, that)
                  })
                  
                })
              }
            })
          })
        },
        fail:function(e){
          //关闭面板
        }
      })
    },
    drawText(ctx:any,path:String){
      let that = this
      const { weekName,nowTime } = utils.formatTime(new Date())
      let { city,name } = app.globalData.location
      let { text,temp } = app.globalData.weather
      //输出图片
      ctx.drawImage(path,0,0,that.data.canvasWidth,that.data.canvasHeight)
      //输出地点
      ctx.shadowOffsetX=-3;//用来设定阴影在 X轴的延伸距
      ctx.shadowOffsetX=-3;//用来设定阴影在 Y轴的延伸距
      ctx.shadowBlur = 2;//设定阴影的模糊程度 默认0
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";//设定阴影颜色效果
      ctx.font = 'normal bold 16px Times New Roman';
      ctx.setFillStyle("rgb(255,255,255)")
      if(name.length>13){
        name = name.substring(0,13)+'...'
      }
      ctx.fillText(city+" · "+name, 10, that.data.canvasHeight-10)
      //输出当前星期以及天气
      ctx.fillText(weekName+' '+text+' '+temp+'℃',10,that.data.canvasHeight-40)
      //输出logo信息
      ctx.drawImage('/images/logo.png',that.data.width-70,that.data.canvasHeight-80,80,80)
      ctx.setFontSize(12)
      ctx.fillText("水印相机",that.data.width-55,that.data.canvasHeight-10)
      //输出当前时间
      ctx.setFontSize(18)
      ctx.fillText(nowTime,10,that.data.canvasHeight-70)
      ctx.draw(false,async() => { // 将之前在绘图上下文中的描述（路径、变形、样式）画到 canvas 中
        await new Promise(function(resolve,reject){
          wx.canvasToTempFilePath({ // 把当前画布指定区域的内容导出生成指定大小的图片。在 draw() 回调里调用该方法才能保证图片导出成功。
            canvasId: 'my-canvas',
            success(res) {
              let src = res.tempFilePath
              that.triggerEvent('myevent',{src:src})
            }
          }, that)
        })
        
      })
    },
   },
 })