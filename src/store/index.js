import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isSunny: true,  //白天
    isMoon: false,  //黑夜
    drawer: false, //抽屉开关
    articleLike: {},  //更新文章喜欢
    articleComments: {}, //更新文章评论
    articleViews: {}, //更新文章浏览量
    isHomeToDetail: false,  //是不是home到detail
    isTagsToDetail: false,  //是不是tags到detail
    fixValue: 0  //元素到页面顶部距离的修正值
  },
  mutations: {
    getIconTheme(state) {  //从sessionStorage中获取状态
      switch (sessionStorage.getItem('theme')) {
        case null:
          state.isSunny = true
          state.isMoon = false
          break;
        case 'suuny':
          state.isSunny = true
          state.isMoon = false
          break;
        case 'moon':
          state.isSunny = false
          state.isMoon = true
          break;
        default:
          break;
      }
    },
    changeIconTheme(state) {  //改变logo图片/github，其他矢量图标改color就行
      state.isSunny =  !state.isSunny
      state.isMoon = !state.isMoon
      if(state.isSunny === true) {
        sessionStorage.setItem('theme', 'sunny')
      }else {
        sessionStorage.setItem('theme', 'moon')
      }
    },
    openDrawer(state) {  //开启抽屉
      state.drawer = true
    },
    closeDrawer(state) {  //关闭抽屉
      state.drawer = false
    },
    changeArticleLike(state, aLike) { //更新文章喜欢
      state.articleLike = aLike
    },
    changeArticleComments(state, aCmLength) { //更新文章评论
      state.articleComments = aCmLength
    },
    changeArticleViews(state, aViews) { //更新文章评论
      state.articleViews = aViews
    },
    sureHomeToDetail(state, height) {  //从home到detail
      state.isHomeToDetail = true
      state.fixValue = height
    },
    sureTagsToDetail(state, height) {  //从tags到detail
      state.isTagsToDetail = true
      state.fixValue = height
    },
    notChangeHeight(state) {  //从detail页面出去或者是detail页面自我刷新
      state.isHomeToDetail = false
      state.isTagsToDetail = false
      state.fixValue = 0
    }
  },
  actions: {
  },
  modules: {
  }
})
