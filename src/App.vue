<template>
  <div id="app" ref="app" :class="{moon: this.$store.state.isMoon}">
    <nav-bar v-if="isShowNav" ref="nav" :style="{ position: pos, color: navColor }"></nav-bar>
    <transition name="fade" mode="in-out">
      <keep-alive include="Home">
        <router-view></router-view>
      </keep-alive>
    </transition>
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
    $route(to) { //动态监听路由变化
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
    .fade-enter {
      opacity:0;
    }
    .fade-leave{
      opacity:1;
    }
    .fade-enter-active{
      transition:opacity .5s;
    }
    .fade-leave-active{
      opacity:0;
      transition:opacity .5s;
    }
  }
  div.moon {
    background-color: @moonBgColor !important;
  }
</style>

