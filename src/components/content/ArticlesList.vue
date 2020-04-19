<template>
  <div id="articles-list">
    <articles-list-item v-for="(article, index) in articles" :key="index"
                        :article="article" @click.native="toDetail(article)">
    </articles-list-item>
  </div>
</template>

<script>
import ArticlesListItem from './ArticlesListItem'

export default {
  name: 'ArticlesList',
  components: {
    ArticlesListItem
  },
  props: {
    articles: {
      type: Array,
    }
  },
  data() {
    return {
      
    }
  },
  methods: {
    toDetail(article) {  
      this.$router.push(`/detail/${article._id}`)
    }
  }
}
</script>

<style lang="less" scoped>
  #articles-list {
    @media screen and (max-width: 800px){
      width: 85vw;
    }
    border-radius: @radius;
    background-color: #fff;
    width: 75%;
    margin: 0 auto;
    position: relative;
    bottom: 70px;
    z-index: 1500;
  }
</style>