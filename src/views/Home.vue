<template>
  <div id="home" :class="{moon: this.$store.state.isMoon}"> 
     <el-carousel :interval="3500" height="380px" indicator-position="none" :arrow="howShowButton">
      <el-carousel-item v-for="(item, index) in topicArticles" 
                        :key="index"
                        @click.native="findArticle(item)">
        <el-image :src="item.topicImage" :alt="item.title" fit="cover"></el-image>
        <div class="swiperArticle-info">
          <h3 class="medium">{{item.title}}</h3>
          <div class="tags">
            <el-tag v-for="(tag, index) in item.selectTags" :key="index" :disable-transitions="true">{{tag.tagName}}</el-tag>
          </div>
          <p>{{item.time}}</p>
        </div>
      </el-carousel-item>
    </el-carousel>
    <articles-list :articles="articles"></articles-list>
    <!-- total以后是从后端获取的 -->
    <el-pagination
      background
      :hide-on-single-page="true"
      layout="total, prev, pager, next"
      :current-page="currentPage"
      :total="total"
      @current-change = "changePage"
      @prev-text="changePage"
      @next-text="changePage">
    </el-pagination>
  </div>
</template>

<script>
import ArticlesList from 'components/content/ArticlesList'

export default {
  name: 'Home',
  data() {
    return {
      topicArticles: [],  //真实的轮播图文章
      howShowButton: 'always', //轮播图按钮
      total: 0,  //文章总数
      currentPage: 1,  //当前所在页
      articles: []
    }
  },
  components: {
    ArticlesList
  },
  methods: {
    getData() {  //获取文章列表数据
      this.$http.get('articles', {
        params: {
          page: 1
        }
      }).then(res => { 
        this.topicArticles = res.data.pop()
        const totalLength = res.data.pop()  //拿到博客总数
        this.total = totalLength  
        this.articles = res.data
      })
    },
    changePage(currentPage) {  //改变page重新请求数据
      this.$http.get('articles', {
        params: {
          page: currentPage
        }
      }).then(res => {
        const length = res.data.length
        let currentArticles = res.data.slice(0, length-2)
        this.articles = currentArticles
      })
    },
    findArticle(article) {  
      this.$router.push(`/detail/${article._id}`)
    }
  },
  created() {
    this.getData()
    if(window.innerWidth <= 800) {  //决定btn的显示与否
      this.howShowButton = 'never'
    }else {
      this.howShowButton = 'always'
    }
  },
  mounted() {
    this.$bus.$on('closeBtn', () => {  //动态关闭btn
      this.howShowButton = 'never'
    })
    this.$bus.$on('openBtn', () => {  //动态开启btn
      this.howShowButton = 'always'
    })
  }
}
</script>

<style lang="less" scoped>
  @import "~less/moon/home.less";
  #home {
    @import "~less/mobile/home.less";
    .el-carousel {
      .el-carousel__item {
        display: flex;
        .el-image {
          width: 53%;
          border-top-right-radius: 8px;
        }
        .swiperArticle-info {
          width: 30%;
          height: 50%;
          margin: auto;
          position: relative;
          bottom: 35px;
          h3 {
            font-size: 35px;
            margin-bottom: 10px;
          }
          .el-tag {
            margin: 0 10px 5px 0;
            color: black;
            background-color: @tagColor;  
            border: 0;
          }
          p {
            margin-top: 10px;
            font-size: 15px;
          }
        }
      }
      /deep/ .el-carousel__arrow {
        background-color: rgba(31,45,61,0);  //去掉按钮背景色
        i {
          color: rgb(255, 255, 255);
          font-size: 35px;
          transition: 0.8s;
          &:hover {
            color: tomato;
            transform: scale(1.7);  //放大
            transition: 0.8s;
          }
        }
      }
    }
    .el-pagination {
      text-align: center;
    }
  }
</style>