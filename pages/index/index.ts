// pages/camera/index.ts
const app = getApp()
import { chooseImg } from '../../utils/globalFunction'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    location:{},
    weather:{}
  },
  goCamera(){
    if(app.globalData.location!=null){
      wx.navigateTo({
        url:'../camera/index'
      })
    }else{
      this.onLoad()
    }
  },
  choseImg(){
    if(app.globalData.location==null){
      this.onLoad()
      return
    }
    chooseImg()
  },
  showMyImg(){
    wx.showToast({
      title:"别急哦，暂未开放"
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.selectComponent("#location").position()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.selectComponent("#location").getUserLocation()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    chooseLocation.setLocation(null);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})