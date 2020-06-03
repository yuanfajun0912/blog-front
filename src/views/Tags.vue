<template>
  <div id="tags">
    <div class="tags-top">
      <div class="tags-container">
        <el-badge v-for="(tag, index) in tags" :key="index" 
                  :value="tag.selectArticles.length">
          <el-tag @click="getArticles(tag._id, index)" :class="{active: index === currentIndex}"
                  :disable-transitions="true">{{tag.tagName}}
          </el-tag>
        </el-badge>
      </div>
      <el-image class="tags-background" src="https://cdn.pixabay.com/photo/2020/04/11/03/41/china-5028679_960_720.jpg" fit="cover">
        <div slot="error" class="image-slot">
          <!-- 在失败回调中再显示一次图片，解决图片初始化不显示的问题 -->
          <el-image src="https://cdn.pixabay.com/photo/2020/04/11/03/41/china-5028679_960_720.jpg" fit="cover">
          </el-image>
        </div>
      </el-image>
    </div>
    <articles-list :articles="articles"></articles-list>
    <!-- 初始界面或者是没找到文章，记得搞个v-if -->
    <div class="no-article" v-if="articles.length === 0">
      <p>呀，空空如也 (｡•́︿•̀｡)</p>
    </div>
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
  name: 'Tags',
  components: {
    ArticlesList
  },
  data() {
    return {
      tags: [],
      articles: [],
      currentIndex: 0,
      total: 0,  //文章总数
      currentPage: 1,  //当前所在页
    }
  },
  methods: {
    getTags() {
      this.$http.get('/tagsList').then(res => {
        this.tags = res.data
        this.getArticles(this.tags[0]._id, 0)  //拿到第一个标签的数据
      })
    },
    getArticles(id, index) {
      this.$http.get(`/tags/${id}/articles`, {
        params: {
          page: 1
        }
      }).then(res => {
        const totalLength = res.data.pop()  //拿到博客总数
        this.total = totalLength  
        this.articles = res.data
        this.currentIndex = index
      })
    },
    changePage(currentPage) {  //改变page重新请求数据
      this.$http.get('articles', {
        params: {
          page: currentPage
        }
      }).then(res => {
        const length = res.data.length
        let currentArticles = res.data.slice(0, length-1)
        this.articles = currentArticles
      })
    },
  },
  created() {
    this.getTags()
  }
}
</script>

<style lang="less" scoped>
  @media screen and (max-width: 800px){
    .tags-container {
      width: 80vw !important;
      top: 5vh !important;
      left: 10vw !important;
    }
    .no-article {
      width: 85vw !important;
      bottom: 7vh !important;
    }
  }
  .tags-top {
    width: 100%;
    font-weight: bold;
    position: relative;
    .tags-container {
      position: absolute;
      z-index: 1000;
      width: 70%;
      top: 18%;
      left: 15%;  
      .el-badge {
        margin: 0 13px 8px 0;
        .el-tag {
          border-radius: 15px;
          font-size: 14px;
          color: black;
          background-color: @tagColor;  
          border: 0;
          cursor: pointer;
          &:hover {
            color: white;
            background-color: rgba(69, 94, 204, 0.747);
          }
        }
        /deep/ sup {
          background-color:rgba(69, 94, 204, 0);
        }
        .active {
          color: white;
          background-color: rgba(69, 94, 204, 0.747);
        }
      }
    }
    .tags-background {
      width: 100%;
      height: 380px;
      filter: brightness(85%);  //使得图片变暗
    }
  }
  .no-article {
    border-radius: @radius;
    background-color: #fff;
    width: 75%;
    height: 75px;
    margin: 0 auto;
    position: relative;
    bottom: 70px;
    z-index: 1500;
    p {
      font-size: 18px;
      height: 100%;
      line-height: 75px;
      text-align: center;
    }
  }
  .el-pagination {
    text-align: center;
  }
</style>