<template>
  <div id="nav-bar" ref="nav" :class="{moon: this.$store.state.isMoon}">
    <!-- logo -->
    <div class="logo" @click="changeTheme">
      <i class="el-icon-moon" v-show="this.$store.state.isSunny"></i>
      <i class="el-icon-sunny" v-show="this.$store.state.isMoon"></i>
      <span v-show="this.$store.state.isSunny">Dream</span>
      <span v-show="this.$store.state.isMoon">Fighting</span>
    </div>
    <!-- 导航 -->
    <ul class="nav">
      <li v-for="(item, index) in links" :key="index" 
          @click="to(item.route, index)" :class="{current: index === currentIndex}">{{item.name}}</li>
    </ul>
    <!-- 移动端 -->
    <el-button type="text" @click="openDrawer">
      <i class="el-icon-s-unfold"></i>
    </el-button>
    <el-drawer
      :visible="$store.state.drawer" direction="rtl" :modal="false"
      size="200px" style="height: 50vh" ref="drawer" @open="openDrawer" @close="closeDrawer">
      <ul class="mobile-nav">
        <li v-for="(item, index) in links" :key="index" @click="to(item.route, index)"
           :class="{current: index === currentIndex}" style="color: black">{{item.name}}</li>
      </ul>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      links: [
        { route: '/home', name: '首页' },
        { route: '/tags', name: '标签' },
        { route: '/timeline', name: '时间线' },
        { route: '/leavemessages', name: '历史留言板' },
        { route: '/about', name: '关于' },
      ],
      currentIndex: 0,  //选中的 li 的索引值
    }
  },
  watch: {
    $route(to) {  //监听路由
      if(to.path != '/home' && to.path != '/tags' && to.path != '/timeline' && to.path != '/leavemessages' && to.path != '/about') {
        this.currentIndex = -1
      }
      // if(to.path === '/home' && window.innerWidth <= 800) {
      //   this.$refs.nav.style.backgroundColor = "rgb(48, 45, 45, 0)"
      // }else {
      //   this.$refs.nav.style.backgroundColor = "rgb(48, 45, 45)"
      // }
    },
  },
  methods: {
    to(path, index) {  //页面跳转
      this.$router.push(path)
      this.currentIndex = index
      this.$refs.drawer.closeDrawer()  //关闭drawer
    },
    openDrawer() {
      this.$store.commit('openDrawer')
    },
    closeDrawer() {  //关掉抽屉
      this.$store.commit('closeDrawer')
    },
    pcCloseDrawer() {  //pc端关掉抽屉
      if(window.innerWidth > 800) {
        this.$store.commit('closeDrawer')
      }
    },
    changeTheme() {
      this.$store.commit('changeIconTheme')
    }
  },
  created() {
    switch (this.$route.path) {  //初始化currentIndex,保证能和路由对上号
      case '/home':
        this.currentIndex = 0
        break;
      case '/tags':
        this.currentIndex = 1
        break;
      case '/timeline':
        this.currentIndex = 2
        break;
      case '/leavemessages':
        this.currentIndex = 3
        break;
      case '/about':
        this.currentIndex = 4
        break;
    }
  },
  mounted() { 
    window.addEventListener('resize', this.pcCloseDrawer, false)
    if(this.$route.path !== '/home' && this.$route.path !== '/tags' && this.$route.path !== '/timeline' && this.$route.path !== '/leavemessages' && this.$route.path !== '/about') {
      this.currentIndex = -1
    }
  },
  destroy() {
    window.removeEventListener('resize', this.pcCloseDrawer)
  }
}
</script>

<style lang="less" scoped>
  @import "~less/moon/navbar.less";
  #nav-bar {
    @import "~less/mobile/navbar.less";
    height: 160px;
    padding: 0 170px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    div.logo {
      cursor: pointer;
      i {
        font-size: 32px;
      }
      span {
        font-size: 30px;
        display: inline-block;
        margin-left: 10px;
      }
    }
    ul.nav {
      font-size: 18px;
      li {
        float: left;
        list-style: none;
        font-weight: bold;
        margin-right: 18px;
        &:hover {
          cursor: pointer;
        }
      }
      li.current {  //被选中的样式
        padding-bottom: 5px;
        border-bottom: 2px solid rgb(164, 182, 223);
      }
      &::after {  //清除浮动
        display: block;
        content: ' ';
        clear: both;
      }
    }
    .el-button {
      display: none;
    }
  }
</style>