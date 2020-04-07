// pages/movies/more-movie/more-movie.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navigationBarTitle: '',
    moviesData: [],
    url: '',
    dataCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取通过URL传递过来的数据category
    var category = options.category;
    //设置data数据
    this.setData({
      navigationBarTitle: category
    })
    //根据category获取数据
    var url = '';
    if (category === '正在热映') {
      url = 'http://t.yushu.im/v2/movie/in_theaters';
    } else if (category === '即将上映') {
      url = 'http://t.yushu.im/v2/movie/coming_soon';
    } else {
      url = 'http://t.yushu.im/v2/movie/top250';
    }
    this.setData({
      url
    });
    this.getMoviesData(url); //进行HTTP请求
  },
  //http请求获取数据
  getMoviesData(url) {
    var self = this;
    wx.request({
      url: url,
      method: 'GET',
      header: {
        'content-type': 'json'
      },
      success(res) {
        console.log(res);
        self.getNeedData(res.data); //提取需要的数据
      }
    })
    wx.showLoading({
      title: '正在加载...',
    });
  },
  //提取我们需要的HTTP数据
  getNeedData(data) {
    var movies = [];
    var subjects = data.subjects;
    for (let i = 0; i < subjects.length; i++) {
      let temp = {
        movieTitle: subjects[i].title,
        average: subjects[i].rating.average,
        coverUrl: subjects[i].images.large,
        movieId: subjects[i].id
      }
      movies.push(temp);
    }
    this.setData({
      dataCount: this.data.dataCount + movies.length, //数据数量叠加
      moviesData: this.data.moviesData.concat(movies) //使用concat方法合并数组
    });
    console.log(this.data.moviesData);
    wx.hideLoading();
  },
  //电影海报点击跳转到电影详情页面
  onMovieDetail(event) {
    console.log(event);
    var movieId = event.currentTarget.dataset.movieId;
    console.log(movieId);
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.data.navigationBarTitle,
    });
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
  onPullDownRefresh: function () { //实现下拉刷新数据功能
    //清空已获取的电影数据和已叠加的数据数量
    this.setData({
      moviesData: [],
      dataCount: 0
    })
    //重新进行HTTP请求数据
    this.getMoviesData(this.data.url);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //每一次HTTP请求的start参数会不同
    var nextUrl = this.data.url + '?start=' + this.data.dataCount + '&count=20';
    this.getMoviesData(nextUrl); //执行HTTP请求
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})