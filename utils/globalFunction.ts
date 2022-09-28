export const chooseImg = () =>{
  wx.chooseMedia({
    count: 1,
    mediaType: ['image'],
    sourceType: ['album'],
    success(res) {
      wx.navigateTo({
        url: '../print/index?src='+res.tempFiles[0].tempFilePath
      })
      // console.log(res.tempFiles[0].tempFilePath)
      // console.log(res.tempFiles[0].size)
    }
  })
}

export const saveImg = (src:string) =>{
  wx.showLoading({
    title:"正在保存中",
    mask:true
  })
  wx.getSetting({
    success(res){
      if(!res.authSetting['scope.writePhotosAlbum']) {
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success() { // 用户同意授权

          },
          fail() { // 用户不同意授权
            wx.showModal({
              title: '提示',
              content: `图片保存失败，请前往设置页面允许保存相册`,
              confirmColor: '#8C5CDD',
              success(res){
                if (res.confirm) {
                  wx.openSetting({
                    success(res){
                       console.log("打开设置界面")
                    }
                  })
                }
              }
            })
          }
        })
      
      }else{
        wx.saveImageToPhotosAlbum({
          filePath: src,
          success(res:any) { 
            wx.hideLoading({})
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 1000
            })
          },
          fail:function(err){
            console.log(err)
          }
        })
      }
    }
  })
}