<template>
  <div id="footer" :class="{moon: this.$store.state.isMoon}">
    <!-- logo、github -->
    <div class="info-container">
      <div class="logo" @click="changeTheme">
        <i class="el-icon-moon" v-show="this.$store.state.isSunny"></i>
        <i class="el-icon-sunny" v-show="this.$store.state.isMoon"></i>
        <span v-show="this.$store.state.isSunny">Dream</span>
        <span v-show="this.$store.state.isMoon">Fighting</span>
      </div>
      <a href="https://github.com/yuanfajun0912" target="_blank" style="margin: 0">
        <i class="iconfont icon-github" v-show="this.$store.state.isSunny"></i>
        <i class="iconfont icon-st-github" v-show="this.$store.state.isMoon"></i>
      </a>
    </div>
    <!-- 友链 -->
    <p>
      友链：
      <a v-for="(item, index) in friendShipLinks"
         :key="index" :href="item.url" target="_blank">{{item.name}}</a>
    </p>
    <p>© 2020 YFJ. All rights reserved.</p>
    <a href="http://www.beian.miit.gov.cn" target="_blank">渝ICP备20004282号</a>
  </div>
</template>

<script>
export default {
  name: 'FooterBar',
  data() {
    return {
      friendShipLinks: [],  //友链
    }
  },
  methods: {
    changeTheme() {
      this.$store.commit('changeIconTheme')
    },
    getLinks() {
      this.$http.get('friendshiplinks').then(res => {
        if(!res.data) {
          return this.friendShipLinks = []
        }else {
          this.friendShipLinks = res.data
        }
      })
    }
  },
  created() {
    this.getLinks()
  }
}
</script>

<style lang="less" scoped>
  @import "~less/moon/footerbar.less";
  #footer {
    @media screen and (max-width: 800px){
      div.info-container {
        display: block !important; 
        width: 100% !important;
      }
    }
    margin-top: 20px;
    text-align: center;
    color: rgb(133, 132, 131);
    font-size: 14px;
    padding: 10px 0;
    div.info-container {
      width: 23%;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      position: relative;
      right: 1.5%;
      color: black;
      div.logo {
        cursor: pointer;
        i {
          font-size: 25px;
        }
        span {
          font-size: 20px;
          margin-left: 5px;
        }
      }
      .iconfont {
        font-size: 25px;
      }
    }
    p {
      margin: 8px 0;
    }
    p:last-child {  //选中p的父元素的最后一个子元素，消除 margin-bottom 的影响
      margin-bottom: 0;
    }
    a {
      color: inherit;
      font-size: 13px;
      margin-right: 15px;
      text-decoration: none;
      &:hover {
        color: black;
      }
    }
  }
</style>