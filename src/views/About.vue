<template>
  <div id="about" :class="{moon: this.$store.state.isMoon}">
    <!-- 介绍 -->
    <el-card class="body">
      <div v-html="about.body" class="markdown-body"></div>
    </el-card>
    <!-- 个人信息 -->
    <el-card class="info">
      <el-avatar :src="about.avatar" :size="120"></el-avatar>
      <h3>{{about.nickName}}</h3>
      <p>{{about.motto}}</p>
      <div class="link-container" v-if="about.contactWays">
        <!-- github -->
        <a :href="about.contactWays[0]" target="_blank" style="margin: 0;color: black">
          <i class="iconfont icon-github"></i>
        </a>
        <!-- CSDN -->
        <a :href="about.contactWays[1]" target="_blank" style="margin: 0;color: black">
          <i class="iconfont icon-csdnlogo"></i>
        </a>
        <!-- email -->
        <el-popover
          placement="bottom"
          width="150"
          trigger="click"
          :content="about.contactWays[2]">
          <el-button type="text" slot="reference" style="color: black">
            <i class="iconfont icon-icon-email"></i>
          </el-button>
        </el-popover>
        <!-- wechat -->
        <el-popover
          placement="bottom"
          width="150"
          trigger="click"
          :content="about.contactWays[3]">
          <el-button type="text" slot="reference" style="color: black">
            <i class="iconfont icon-weixin"></i>
          </el-button>
        </el-popover>
      </div>
    </el-card>
  </div>
</template>

<script>
import marked from 'marked'
import hljs from "highlight.js";
import 'highlight.js/styles/a11y-light.css';
import 'github-markdown-css';

export default {
  name: 'About',
  data() {
    return {
      about: {}
    }
  },
  methods: {
    getAbout() {
      this.$http.get('about').then(res => {
        this.about = res.data[0]
      })
    }
  },
  created() {
    this.getAbout()
  },
  mounted(){
    marked.setOptions({  //marked配置
      renderer: new marked.Renderer(),
      highlight: function(code) {
        return hljs.highlightAuto(code).value;
      },
      pedantic: false,
      gfm: true,
      tables: true,
      breaks: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      xhtml: false
    })
  }
}
</script>

<style lang="less" scoped>
  #about {
    @import "~less/mobile/about.less";
    display: flex;
    justify-content: center;
    .body {
      width: 50%;
      margin-right: 2%;
    }
    .info {
      text-align: center;
      height: 300px;
      h3 {
        font-size: 28px;
        margin: 15px 0;
      }
      a {
        color: inherit;
        margin-right: 10px !important;
        text-decoration: none;
        &:hover {
          color: black;
        }
      }
      i {
        font-size: 17px;
      }
      .icon-csdnlogo {
        font-size: 14px;
      }
      .icon-icon-email {
        margin-right: 10px
      }
    }
  }
  div.moon {
    background-color: @moonBgColor;
  }
</style>