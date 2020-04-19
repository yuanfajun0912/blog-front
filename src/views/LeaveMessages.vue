<template>
  <div id="leave-messages" :class="{moon: this.$store.state.isMoon}">
    <el-divider content-position="left"><i class="el-icon-edit"></i><span>欢迎留言</span></el-divider>
    <!--
        messages: 传给comments的评论/留言（可能不是所有评论/留言）
        total: 文章/留言板的所有评论/留言
        changeMessages：添加评论会触发该事件
        showMore：点击显示更多按钮触发该事件
      -->
    <comments :messages="messages"
              class="messages-list" 
              :total="allComments.length"
              @changeMessages="changeComments"
              @showMore="showMoreMessages"
              >
    </comments>
  </div>
</template>

<script>
import Comments from 'components/content/Comments'

export default {
  name: 'LeaveMessages',
  components: {
    Comments
  },
  data() {
    return {
      messages: [],
      allComments: [],
    }
  },
  methods: {
    getMessages() {
      this.$http.get('leaveMessages').then(res => {
        this.allComments = Array.from(res.data)
        this.messages = this.allComments.slice(0, 10)  //分页处理，只拿前10个
      })
    },
    changeComments(data) {  //Comments中添加评论改变Detail中的article.comments
      this.allComments = data
      this.messages = this.allComments.slice(0, 10)  //分页处理，只拿前10个
    },
    showMoreMessages(page) {  //显示更多的评论/留言
      this.messages = this.allComments.slice(0, 10*page)
    }
  },
  created() {
    this.getMessages()
  }
}
</script>

<style lang="less" scoped>
  @import "~less/moon/leavemessages.less";
  #leave-messages {
    @media screen and (max-width: 800px){
      .el-divider {
        margin-bottom: 5vh !important;
      }  
    }
    margin-top: 20px;
    .el-divider {
      width: 75%;
      margin: 0 auto 60px auto;
      /deep/ .is-left {
        background-color: @sunnyBgColor;
      }
      i {
        font-size: 18px;
      }
      span {
        font-size: 18px;
        font-weight: bold;
      }
    }
    .messages-list {
      width: 75%;
      margin: 0 auto;
    }
  }
</style>