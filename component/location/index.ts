// Componet/Componet.js
const app = getApp()
const chooseLocation = requirePlugin('chooseLocation');
Component({
  /**
   * 组件的属性列表
   */
   properties: {

   },
  /**
   * 组件的初始数据
   */
   data: {
    location:{}
   },
  /**
   * 组件的方法列表
   */
   methods: {
    upLocation(){
      // console.log("修改组件内定位："+app.globalData.location)
      this.setData({
        location:app.globalData.location
      })
    },
    position(){
      //先检测用户是否授权了定位
      wx.getSetting({
        success(res){
          if(!res.authSetting['scope.userLocation']) {
            wx.authorize({
              scope: 'scope.userLocation',
              success() { // 用户同意授权
  
              },
              fail() { // 用户不同意授权
                wx.showModal({
                  title: '提示',
                  content: `需要授权定位后才能使用功能哦！`,
                  confirmColor: '#8C5CDD',
                  success(res){
                    if (res.confirm) {
                      wx.openSetting({
                        success(res){
                          //  console.log("打开设置界面")
                        }
                      })
                    }
                  }
                })
              }
            })
          }else{
            const key = app.globalData.mapKey; //使用在腾讯位置服务申请的key
            const referer = 'camera'; //调用插件的app的名称
            let location = ''
            wx.getLocation({
              success(res){
                // console.log(res)
                location = JSON.stringify({
                  latitude: res.latitude,
                  longitude: res.longitude
                });
              }
            })
            const category = '生活服务,娱乐休闲';
            
            wx.navigateTo({
              url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer + '&location=' + location + '&category=' + category
            });
          }
        }
      })
    },
    async getUserLocation(){
      const location = chooseLocation.getLocation();
      // console.log(location)
      if(location!=null){
        await this.getWeather(location)
      }
      this.setData({
        location:location
      })
      app.globalData.location = location
     },
     getWeather(location:any){
      wx.request({
        url:app.globalData.weatherAPI,
        data:{
          location: parseFloat(location.longitude).toFixed(2) +','+parseFloat(location.latitude).toFixed(2),
          key:app.globalData.weatherKey
        },
        success(res:any){
          // console.log(res)
          let data = res.data.now
          // console.log(data)
          const weather = {
            temp: data.temp,
            text: data.text
          }
          app.globalData.weather = weather
        }
      })
    },
   },
 })