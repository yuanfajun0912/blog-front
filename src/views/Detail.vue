<template>
  <div id="detail" :class="{moon: this.$store.state.isMoon}">
    <!-- 文章主体的顶部 -->
    <div class="detail-top">
      <div class="article-info">
        <h3>{{article.title}}</h3>
        <div class="tags">
          <el-tag v-for="(tag, index) in this.article.selectTags" :key="index" :disable-transitions="true">{{tag.tagName}}</el-tag>
        </div>
        <i class="el-icon-edit"></i>
        <span>{{this.article.time}}</span>
      </div>
      <el-image :src="article.topicImage" fit="cover">
        <div slot="error" class="image-slot">
          <!-- 在失败回调中再显示一次图片，解决图片初始化不显示的问题 -->
          <el-image :src="article.topicImage" fit="cover">
          </el-image>
        </div>
      </el-image>
    </div>
    <div class="article-container">  
      <!-- 文章主体 -->
      <div v-html="code" class="markdown-body"></div>
      <!-- 喜欢 -->
      <div :class="{likebtn: true, reallylike: isLike}" @click="likeArticle">
        <!-- <i class="iconfont icon-like-sunny dislike" v-show="!isLike"></i><br> -->
        <i class="iconfont icon-article-like like"></i><br>
        <span>喜欢这篇文章★~★</span>
      </div>
      <!-- 转载 -->
      <el-divider content-position="left"><i class="el-icon-collection"></i><span>转载说明</span></el-divider>
      <p class="statement">欢迎转载，请同时附上本文链接 
        <a :href="getCurrentUrl" style="text-decoration: none; color: blue">{{getCurrentUrl}}</a>，谢谢
      </p>
      <!-- 评论 -->
      <el-divider content-position="left"><i id="comments-divider" class="iconfont icon-comments-sunny"></i><span>评论</span></el-divider>
      <!--
        messages: 传给comments的评论/留言（可能不是所有评论/留言）
        total: 文章/留言板的所有评论/留言
        changeMessages：添加评论会触发该事件
        showMore：点击显示更多按钮触发该事件
      -->
      <comments :messages="messages" 
                :total="allComments.length"
                @changeMessages="changeComments"
                @showMore="showMoreMessages"
                class="comments"
                >
      </comments>
    </div>
    <!-- 右侧控制区 -->
    <div class="control">
      <div :class="{likectn: true, reallylike: isLike}">
        <i class="iconfont icon-article-like like" @click="likeArticle"></i><br>
        <span class="likecounts">{{article.like}}</span>
      </div>
      <div class="commentsctn" @click="toComments">
        <i class="iconfont icon-comments-sunny"></i><br>
        <span>{{allComments.length}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import marked from 'marked'
import hljs from "highlight.js";
import 'highlight.js/styles/a11y-light.css';
import 'github-markdown-css';
import Comments from 'components/content/Comments'

export default {
  name: 'Detail',
  data() {
    return {
      article: {},
      code: '',
      allComments: [],  //一个文章中的所有评论
      messages: [],  //传入Comments的评论
      isLike: false,  //游客是否喜欢这篇文章
      likeArticles: []  //游客喜欢的文章
    }
  },
  components: {
    Comments
  },
  computed: {
    getCurrentUrl() {  //当前页面的url
      return window.location.href  
    }
  },
  methods: {
    getArticle() {  //获取该文章的数据
      this.$http.get(`articlesList/${this.$route.params.id}`).then(res => {
        this.article = res.data
        this.code = marked(this.article.value)
        this.allComments = res.data.comments.reverse()  //获得所有评论
        this.messages = this.allComments.slice(0, 10)  //分页处理，只拿前10个
        this.isLikeArticle()  //放在这儿是为了确保this.article.title能拿到值
        this.$store.commit('changeArticleViews', {  //改变vuex
          _id: this.article._id,
          views: ++this.article.views  //先+1再赋值
        })
      })
    },
    isLikeArticle() {  //判断游客是否喜欢该文章
      //localStorage只能存字符串，想存数组必须用JSON做一次转换
      this.likeArticles = JSON.parse(localStorage.getItem('likeArticles'))
      if(this.likeArticles === null) {
        this.isLike = false
      }else {
        this.isLike = this.likeArticles.some(item => {
          return item === this.article.title
        })
      }
    },
    changeComments(data) {  //Comments中添加评论改变Detail中的article.comments
      this.allComments = data
      this.messages = this.allComments.slice(0, 10)  //分页处理，只拿前10个
      this.$store.commit('changeArticleComments', {  //改变vuex
        _id: this.article._id,
        comments: this.allComments
      })
    },
    showMoreMessages(page) {  //显示更多的评论/留言
      this.messages = this.allComments.slice(0, 10*page)
    },
    likeArticle() {  //喜欢这篇文章
      if(this.isLike) {  
        return
      }else {
        this.isLike = true
        if(this.likeArticles === null) {  //解决新用户报错
          this.likeArticles = []
        }
        this.likeArticles.push(this.article.title)
        localStorage.setItem('likeArticles', JSON.stringify(this.likeArticles))  //存进localStorage
        this.$http.put(`articlesList/${this.$route.params.id}/like`).then(res => {  //发送请求，like+1
          this.article.like = res.data
          this.$store.commit('changeArticleLike', {  //改变vuex
            _id: this.article._id,
            like: this.article.like
          })
        })
        // localStorage.removeItem('likeArticles')
        // console.log(localStorage)
      }
    },
    toComments() {  //页面跳转到评论区
      this.$nextTick(() => {   //操作dom
        document.querySelector('#comments-divider').scrollIntoView()
      }) 
    },
  },
  created() {
    this.getArticle()
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
    }
    );
    this.$nextTick(() => {  //滚动条回到顶部
      document.querySelector("#app").scrollTop = 0
    })
    // localStorage.removeItem('likeArticles')
  },
}
</script>

<style lang="less" scoped>
  @import "~less/moon/detail.less";
  #detail {
    @import "~less/mobile/detail.less";
    .detail-top {
      position: relative;
      .article-info {
        color: rgb(255, 255, 255);
        position: absolute;
        z-index: 1000;
        width: 60%;
        top: 25%;
        left: 20%;  //上下居中
        h3 {
          font-size: 35px;
          margin-bottom: 25px;
        }
        .el-tag {
          background-color: @tagColor;
          color: black;
          border: none;
          border-radius: @radius;
          margin-right: 10px;
          margin-bottom: 25px;
          cursor: pointer;
          &:hover {
            color: white;
            background-color: rgba(69, 94, 204, 0.747);
          }
        }
        .el-icon-edit {
          display: inline-block;
          margin-right: 5px;
        }
        span {
          font-size: 15px; 
        }
      }
      .el-image {
        width: 100%;
        height: 380px;
        filter: brightness(85%);  //使得图片变暗
      }
    }
    .article-container {
      border-radius: @radius;
      background-color: rgb(255, 255, 255);
      width: 75%;
      margin: 0 auto;
      position: relative;
      bottom: 70px;
      z-index: 1000;
      .markdown-body{
        padding: 40px 5%;
      }
      .likebtn {
        width: 100%;
        text-align: center;
        cursor: pointer;
        i.like {
          font-size: 35px;
          color: rgb(221, 219, 219);
        }
        span {
          font-size: 15px;
        }
      }
      .reallylike {
        color: rgb(247, 112, 112);
        i.like {
          color: rgb(247, 112, 112);
        }
      }
      .el-divider {
        i {
          font-size: 18px;
          display: inline-block;
          margin-right: 5px;
        }
        span {
          font-size: 18px;
          font-weight: bold;
        }
        i.icon-comments-sunny {
          font-size: 25px;
          position: relative;
          top: 3px;
          margin-right: 0;
        }
      }
      p.statement {
        width: 90%;
        margin: 40px auto 60px auto;
        a {
          width: 100%;
          word-wrap: break-word;  //超出宽度自动换行
        }
      }
    }
    .control {
      background-color: rgb(255, 255, 255);
      position: fixed;
      top: 50%;
      right: 6px;
      display: flex;
      flex-direction: column;
      text-align: center;
      padding: 10px;
      box-shadow: 0 4px 8px 6px rgba(7,17,27,0.08);
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
      i.icon-article-like {
        font-size: 25px;
        cursor: pointer;
      }
      .commentsctn {
        cursor: pointer;
        i.icon-comments-sunny {
          font-size: 30px;
        }
        &:hover {
          color: rgb(105, 107, 228);
        }
      }
    }
    .reallylike {
      color: rgb(247, 112, 112);
    }
  }
</style>