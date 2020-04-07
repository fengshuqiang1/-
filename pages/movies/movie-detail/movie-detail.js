// pages/movies/movie-detail/movie-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMovieData(options.id);
  },
  //通过HTTP获取数据
  getMovieData(movieId) {
    var url = 'http://t.yushu.im/v2/movie/subject/' + movieId
    wx.request({
      url: url,
      method: 'GET',
      header:{
        "content-type": "json"
      },
      success: (res) => {
        console.log(res.data);
        this.getNeedData(res.data);
      }
    })
  },
  //整理数据
  getNeedData(data){
    if (!data) {
      return;
    }
    var movie = {
      original_title: data.original_title,
      title: data.title,
      country: data.countries[0],
      year: data.year,
      like: data.wish_count,
      commentCount: data.comments_count,
      image: data.images.large,
      average: data.rating.average,
      director:{
        img: data.directors[0].avatars.large || '',
        name: data.directors[0].name
      },
      castsName: this.getCastsName(data.casts),
      genres: this.getGenres(data.genres),
      summary: data.summary,
      castsInfo: data.casts,
      id:data.id
    }
    this.setData({
      movieData: movie
    })
    console.log(this.data.movieData);
  },
  //整理演员的名字和排版
  getCastsName(array){
    var castsNameArray = [];
    for(let i=0; i<array.length; i++){
      castsNameArray.push(array[i].name);
    }
    return castsNameArray.join(' / ');
  },
  //整理类型的排版
  getGenres(array) {
    return array.join('、');
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