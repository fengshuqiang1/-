// pages/post/post-detail/post-detail.js
var postsData = require("../../../data/posts-data");
//获取App实例
var App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collected:false,
    isPlaying: false
  },
  //收藏按钮事件处理函数
  onCollectionTap() {
    var postsCollection = wx.getStorageSync('postsCollection');
    var postCollection = postsCollection[this.data.curPostId];
    postCollection = !postCollection;
    //改变当前页面的收藏状态
    this.setData({
      collected:postCollection
    })
    //更新缓存
    postsCollection[this.data.curPostId] = postCollection;
    wx.setStorageSync('postsCollection', postsCollection);
    //显示交互信息
    wx.showToast({
      title: this.data.collected?'收藏成功':'取消收藏',
    })
  },
  //分享按钮
  onShareTap() {
    var itemList = [
      "分享到QQ",
      "分享到微信",
      "分享到微博",
      "分享到朋友圈"
    ]
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#405f80",
      success(res) {
        // res.tapIndex  用户点击的是第几个按钮
        wx.showModal({
          content: `确定要${itemList[res.tapIndex]}`,
        })
      }
    })
  },
  onMusicTap() {
    var postData = postsData.postList[this.data.curPostId];
    //获取backgroundAudioManager对象
    const backgroundAudioManager = wx.getBackgroundAudioManager();
    backgroundAudioManager.title = postData.music.title;
    backgroundAudioManager.src = postData.music.url;
    backgroundAudioManager.coverImgUrl = postData.music.coverImg;
    if (this.data.isPlaying) {
      backgroundAudioManager.pause();
      this.setData({
        isPlaying:false
      })
      console.log('暂停播放背景音乐');
    }else{
      backgroundAudioManager.play();
      this.setData({
        isPlaying:true
      })
      console.log('开始播放背景音乐');
    };
    //监听音乐播放控制页面状态
    backgroundAudioManager.onPlay(() => {
      // 播放当前音乐之前将所有页面的全局播放状态变为fale
      for (const key in App.globalData.g_isPlaying) {
        if (App.globalData.g_isPlaying.hasOwnProperty(key)) {
          App.globalData.g_isPlaying[key] = false;
        }
      }
      this.setData({
        isPlaying:true
      })
      App.globalData.g_isPlaying[this.data.curPostId] = true;
    });
    //监听背景音乐暂停
    backgroundAudioManager.onPause(() => {
      this.setData({
        isPlaying:false
      })
      App.globalData.g_isPlaying[this.data.curPostId] = false;
    }); 
    //监听背景音乐自然播放结束
    backgroundAudioManager.onEnded(() => {
      //将当前新闻背景音乐状态设置为false
      this.setData({
        isPlaying:false
      })
      //将全局变量App.globalData.g_isPlaying中所有新闻背景音乐状态设置为false
      for(const index in App.globalData.g_isPlaying){
        App.globalData.g_isPlaying[index] = false;
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.id;
    //获取传递过来的参数
    this.setData({
      postData:postsData.postList[postId],
      curPostId:postId
    });
    //获取storage缓存并设置当前页面收藏的图标
    var postsCollection = wx.getStorageSync('postsCollection');
    if (postsCollection) {
      var postCollection = postsCollection[postId];
      if (postCollection) {
        this.setData({
          collected:postCollection
        })
      }
    }else {
      var postsCollection = {};
      postsCollection[postId] = false;
      wx.setStorageSync('postsCollection', postsCollection);
    };
    //进入详情页面时就判断当前页面是否在播放音乐
    if (App.globalData.g_isPlaying[this.data.curPostId]) {
      this.setData({
        isPlaying:true
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})