// pages/movies/movies.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hotMoviesData: {},
    topMoviesData: {},
    willMoviesData: {},
    searchData: {},
    showSearch:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var hotMovies = 'http://t.yushu.im/v2/movie/in_theaters?start=1&count=3';
    var topMovies = 'http://t.yushu.im/v2/movie/top250?start=6&count=3';
    var willMovies = 'http://t.yushu.im/v2/movie/coming_soon?start=1&count=3';
    this.getMoviesData(hotMovies, "hotMoviesData", "正在热映");
    this.getMoviesData(topMovies, "topMoviesData", "电影TOP250");
    this.getMoviesData(willMovies, "willMoviesData", "即将上映");
  },
  //传入URL获取数据
  getMoviesData(url, dataName, title) {
    var self = this;
    wx.request({
      url: url, 
      method: 'GET',
      header: {
        'content-type': 'json'
      },
      success (res) {
        console.log(res);
        self.getNeedData(res.data, dataName, title);
      }
    });
  },
  //处理http数据，只要我们需要的数据
  getNeedData(data, dataName, title){
    var movies = [];
    var subjects = data.subjects;
    for(let i = 0; i < subjects.length; i++){
      let temp = {
        movieTitle:subjects[i].title,
        average:subjects[i].rating.average,
        coverUrl:subjects[i].images.large,
        movieId:subjects[i].id
      }
      movies.push(temp);
    }
    this.setData({
      [dataName]:{
        title:title,
        //这一步很关键，为了让不同的数据在同一个模板中绑定数据
        moviesData:movies
      }
    })
    console.log(this.data.hotMoviesData);
  },
  //更多按钮点击事件
  onMovieTap(event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category='+category,
    })
  },
  //关闭搜索页面
  iconHideSearch() {
    this.setData({
      showSearch: false,
      searchData:{}//将搜索结果清空
    })
  },
  //input获取焦点触发
  onFocus(){
    console.log('focus');
    this.setData({
      showSearch: true
    })
  },
  //input输入内容后按enter键触发
  onConfirm(event){
    var inputValue = event.detail.value;
    var searchUrl = 'http://t.yushu.im/v2/movie/search?q='+inputValue;
    this.getMoviesData(searchUrl, 'searchData', '');
  },
  //电影海报点击跳转到电影详情页面
  onMovieDetail(event){
    var movieId = event.currentTarget.dataset.movieId;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId,
    })
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