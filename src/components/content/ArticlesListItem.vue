<template>
  <div id="articles-listitem">
    <!-- 文章信息简介 -->
    <div class="article-info">
      <h3>{{this.article.title}}</h3>
      <div class="tags">
        <el-tag v-for="(tag, index) in this.article.selectTags" :key="index" :disable-transitions="true">{{tag.tagName}}</el-tag>
      </div>
      <p class="discription">{{article.discription}}</p>
      <div class="info-footer">
        <span>{{this.article.time}}</span>
        <ul class="info-detail">
          <li>
            <i class="iconfont icon-views-sunny"></i>
            {{this.article.views}}
          </li>
          <li>
            <i class="iconfont icon-comments-sunny"></i>
            {{this.article.comments.length}}
          </li>
          <li>
            <i class="iconfont icon-like-sunny"></i>
            {{this.article.like}}
          </li>
        </ul>
      </div>
    </div>
    <el-image :src="this.article.topicImage" fit="cover"></el-image>
  </div>
</template>

<script>
export default {
  name: 'ArticlesListItem',
  props: {
    article: {  //文章
      type: Object
    }
  },
  watch: {  //监听like、comments、views
    '$store.state.articleLike': function(newValue) {
      if(newValue._id === this.article._id) {
        return this.article.like = newValue.like
      }
    },
    '$store.state.articleComments': function(newValue) {
      if(newValue._id === this.article._id) {
        return this.article.comments = newValue.comments
      }
    },
    '$store.state.articleViews': function(newValue) {
      if(newValue._id === this.article._id) {
        return this.article.views = newValue.views
      }
    }
  }
}
</script>

<style lang="less" scoped>
  #articles-listitem {
    @import "~less/mobile/articleslistitem";
    display: flex;
    height: 250px;
    padding: 10px;
    border-radius: @radius;
    margin-bottom: 10px;
    transition: 0.8s;
    &:hover {
      transition: 0.8s;
      box-shadow: 0 4px 8px 6px rgba(7,17,27,0.2);
      .el-image {
        transition: 0.8s;
        transform: scale(1.05);  //图片放大1.05倍
      }
    }
    div.article-info {
      flex: 1.3;
      padding: 25px 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      h3 {
        font-size: @articleTitle;  
      }
      .el-tag {
        margin: 0 10px 5px 0;
        color: black;
        background-color: @tagColor;  
        border: 0;
      }
      div.info-footer {
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        ul {
          list-style: none;
          li {
            float: left;
            margin-left: 5px;
            i {
              font-size: 21px;
              position: relative;
              top: 3px;
              left: 5px;
            }
          }
          &::after {
            content: '';
            display: block;
            clear: both;
          }
        }
      }
    }
    .el-image {
      flex: 1;
      border-radius: @radius;
      transition: 0.8s;
    }
  }
</style>