<template>
  <div id="app" ref="app" :class="{moon: this.$store.state.isMoon}">
    <nav-bar v-if="isShowNav" ref="nav" :style="{ position: pos, color: navColor }"></nav-bar>
    <transition name="fade" mode="in-out">  
      <keep-alive include="Home">
        <router-view></router-view>
      </keep-alive>
    </transition>
    <!-- <keep-alive include="Home">
      <router-view></router-view>
    </keep-alive> -->
    <footer-bar v-if="isShowFooter"></footer-bar>
    <el-backtop target="#app" :visibility-height="1200">
      <i class="iconfont icon-backtop-sunny"></i>
    </el-backtop>
  </div>
</template>

<script>
import NavBar from 'components/content/NavBar.vue'
import FooterBar from 'components/content/FooterBar.vue'

export default {
  name: 'app',
  components: {
    NavBar,
    FooterBar
  },
  data() {
    return {
      pos: 'relative',
      navColor: 'black',  //NavBar中元素的颜色
      drawer: this.$store.state.drawer,
    }
  },
  computed: {
    isShowNav() {  //控制Nav显示
      if(this.$route.path === '/') {
        return false
      }else {
        return true
      }
    },
    isShowFooter() {  //控制Footer显示
      if(this.$route.path === '/') {  //获得当前活跃的路由的路径
        return false
      }else {
        return true
      }
    },  
  },
  methods: {
    changePos() {  //改变位置和颜色和轮播图按钮
      if(this.$route.path === '/home' && window.innerWidth <= 800) {
        this.pos = 'absolute'
        this.navColor = 'white'
        this.$bus.$emit('closeBtn')
      }else {
        this.pos = 'relative'
        this.navColor = 'black'
        this.$bus.$emit('openBtn')
      }
    },
    scrollCloseDrawer() {  //滚动关闭closeDrawer
      this.$store.commit('closeDrawer')
    }
  },
  watch: {  
    $route(to, from) { //动态监听路由变化
      let reg = /detail/gm
      let isToDetil = reg.test(to.path)
      if(isToDetil && from.path === '/home') {  //从home页面到detail页面
        let homeHeight = window.getComputedStyle(document.getElementById("home"),null).height  //获取home组件实际高度(px)
        homeHeight = parseInt(homeHeight)
        this.$store.commit('sureHomeToDetail', homeHeight)
      }
      if(isToDetil && from.path === '/tags') {  //从tags页面到detail页面
        let tagsHeight = window.getComputedStyle(document.getElementById("tags"),null).height
        tagsHeight = parseInt(tagsHeight)
        this.$store.commit('sureTagsToDetail', tagsHeight)
      }
      if(reg.test(from.path) || (from.path === '/' && isToDetil)) {  //从detail页面出去或者是detail页面自我刷新
        this.$store.commit('notChangeHeight')
      }
      // navbar的显示相关
      if(to.path !== '/home') {
        this.pos = 'relative'
        this.navColor = 'black'
      }else if(window.innerWidth > 800){
        this.pos = 'relative'
        this.navColor = 'black'
      }else {
        this.pos = 'absolute'
        this.navColor = 'white'
      }
    },
    '$store.state.drawer': function(newVal) {  //监听vuex中drawer的变化
      if(newVal) {
        this.$refs.app.addEventListener('scroll', this.scrollCloseDrawer, false)
      }else {
        this.$refs.app.removeEventListener('scroll', this.scrollCloseDrawer)
      }
    }
  },
  mounted() {
    // 动态监听窗口宽度变化
    window.addEventListener('resize', this.changePos, false);
    if(this.$route.path === '/home' && window.innerWidth <= 800) {
      this.pos = 'absolute'
      this.navColor = 'white'
    }
    this.$store.commit('getIconTheme')  //页面刷新时记住当前的主题颜色
  },
  destroy() {
    window.removeEventListener('resize', this.changePos)
  }
}
</script>

<style lang="less">
  * {
    padding: 0;
    margin: 0;
  }
  html, body {
    margin: 0;
    padding: 0;
    // height: 100vh;   //规定app高度
    // overflow: auto;  //确定能将backtop弄出来
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
  }
  #app {
    height: 100vh;   //规定app高度
    overflow: auto;  //确定能将backtop弄出来
    background-color: @sunnyBgColor;
    scroll-behavior: smooth;  //平滑滚动效果
    .el-backtop {
      z-index: 2000;
      background-color: rgba(248, 245, 245, 0);
      @media screen and (max-width: 800px){
        right: 2vw !important;
        bottom: 2vh !important;
      }
      .icon-backtop-sunny {
        font-size: 50px;
        color: rgba(250, 18, 1, 0.842);
      }
    }
    .fade-enter {  //因为打包后抖动，去掉过渡效果了
      opacity:0;
    }
    .fade-leave{
      opacity:1;
    }
    .fade-enter-active{
      // opacity:1;
      transition:opacity .5s;
    }
    .fade-leave-active{
      opacity:0;
      transition:opacity .5s;
    }
  }
  div.moon {  //黑暗模式
    background-color: @moonBgColor !important;
  }
  #nprogress .bar {  //进度条自定义颜色
    background: rgb(2, 171, 250) !important; //自定义颜色
  }
  .el-popover {  //el-popover很特殊，它不在app里，所以深度选择器也没用，只能放在全局样式
    max-height: 450px;  //设置最大高度,超出时出现滚动条
    overflow-y: auto;
    overflow-x: hidden;
    a {
      color: black; 
      display: block; 
      text-decoration: none;
      font-size: 14.5px;
      margin-bottom: 3px;
      line-height: 22px;
      // font-weight: bold;
      transition: .25s;
      border-radius: 5px;
      &:hover {
        transition: .25s;
        background-color: rgb(255, 187, 0);
        color:rgb(255, 255, 255);
      }
    }
    .current {
      background-color: rgb(255, 187, 0);
      color:rgb(255, 255, 255);
    }
  }
</style>

