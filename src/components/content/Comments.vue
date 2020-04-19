<template>
  <div id="comments" :class="{moon: this.$store.state.isMoon}">
    <!-- 新建评论 -->
    <div class="add-comment">
      <el-input
        v-if="addComment.loginNum === 0"
        :class="{nickname: true, 'name-null': isNameNull}"
        clearable
        type="text"
        placeholder="请输入昵称（必填）"
        v-model="addComment.nickName"
        maxlength="10"
        show-word-limit
        @blur="isNameNull = false; isNameRepeat = false"
      >
      </el-input>
      <!-- 游客之前就有昵称的时候显示 -->
      <h5 class="has-nickname" v-else>{{defaultNickName}}</h5>
      <span v-show="isNameRepeat" style="font-size: 14px; color: red">
        <i class="el-icon-circle-close"></i>昵称重复，请重新输入
      </span>
      <br>
      <el-input
        :class="{body: true, 'body-null': isBodyNull}"
        :autosize="{ minRows: 3, maxRows: 5}"
        type="textarea"
        placeholder="请输入评论"
        v-model="addComment.body"
        maxlength="100"
        show-word-limit
        @blur="isBodyNull = false"
      >
      </el-input>
      <div class="btn-container">
        <el-button @click.native="submitComment" icon="el-icon-s-promotion" circle></el-button>
        <el-button @click.native="cancelSubmit" icon="el-icon-delete-solid" circle></el-button>
      </div>
    </div>
    <!-- 评论列表 -->
    <div class="comments-list" v-for="(item, index) in messages" :key="index">
      <el-card shadow="never">
        <h5>{{item.nickName}}</h5>
        <p>{{item.body}}</p>
        <div class="reply" v-show="item.reply.length">
          <h5>博主</h5>
          <p>{{item.reply}}</p>
        </div>
        <p class="time"><span>{{item.time}}</span></p>
      </el-card>
    </div>
    <div v-show="messages.length === 0" style="text-align: center">
      快来抢沙发呀~~~
    </div>
    <!-- 显示更多评论的按钮 -->
    <div class="show-more" @click="showMoreMessages" v-if="isMoreBtnShow">
      <i class="el-icon-arrow-down"></i>
      <p>显示更多评论</p>
    </div>
  </div>
</template>

<script>
import { formatDate } from '@/common/utils.js'

export default {
  name: 'Comments',
  data() {
    return {
      addComment: {  //用户添加的评论/留言
        nickName: '',
        body: '',
        time: '',
        reply: '', //博主回复
        loginNum: 0  //登录次数
      },
      defaultNickName: '',  //用户之前的昵称
      isNameRepeat: false, //输入的昵称是否重复
      isNameNull: false,  //添加的评论的昵称是否为空
      isBodyNull: false,  //添加的评论的内容是否为空
      isShowMore: false, //控制显示更多按钮的显示
      page: 1,  //显示评论的总页数（1页10个）
    }
  },
  props: {
    messages: {  //拿到的评论/留言
      type: Array
    },
    total: {  //这篇文章/留言板总的评论/留言数
      type: Number
    }
  },
  computed: {
    isMoreBtnShow() {  //判断是否显示更多按钮
      if(this.total > this.messages.length) {
        // this.isShowMore = true
        return true
      }else {
        return false
        // this.isShowMore = false
      }
    },
  },
  methods: {
    hasNickName() {  //判断之前是否注册过昵称
      const name = localStorage.getItem('nickName')
      if(name) {
        this.defaultNickName = name
        this.addComment.nickName = name
        this.addComment.loginNum = 1  //1不是登录次数，只要不是0都表示不是第一次登录
      }
    },
    submitComment() {  //提交新建的评论
      if(this.addComment.nickName.length === 0) {
        return this.isNameNull = true
      }else if(this.addComment.body.length === 0){
        return this.isBodyNull = true
      }else {
        const myDate = new Date()
        this.addComment.time = formatDate(myDate, 'yyyy-MM-dd hh:mm:ss') //获取当前时间
        var postUrl = ''                       
        let a = window.location.href  //拿到当前页面的url
        let b = a.substring(a.length-13)  //拿到字符串的后13位
        if(b === 'leavemessages') {  //通过判断区分出此时Comments组件是用于留言还是文章页面的
          postUrl = 'leaveMessages'
        }else {
          postUrl = `articleComments/${this.$route.params.id}`
        }
        this.$http.post(postUrl, this.addComment).then(res => {
          if(res.data.state === 401) {  //第一次登录且昵称重复
            this.isNameRepeat = true
            this.isNameNull = true
            return
          }else {
            this.$emit('changeMessages', res.data)  //更新评论
            this.isNameRepeat = false
            localStorage.setItem('nickName', this.addComment.nickName)  //将昵称加入/更新到localStorage
            this.hasNickName()
            this.addComment.body = ''
          }
        })
      }
    },
    cancelSubmit() {  //取消提交新建评论
      const name = localStorage.getItem('nickName')
      if(!name) { //做一次判断，否则会检测到昵称为空，就不能增加评论了
        this.addComment.nickName = ''
      }
      this.addComment.body = ''
    },
    showMoreMessages() {  //加载更多
      this.page++
      this.$emit('showMore', this.page)
    }
  },
  created() {
    // localStorage.removeItem('nickName')
    this.hasNickName()
  },
}
</script>

<style lang="less" scoped>
  #comments {
    width: 90%;
    margin: 0 auto;
    .add-comment {
      .nickname {
        width: 45%;
        margin: 20px 0 15px 0;
        /deep/ .el-input__inner {  /* /deep/穿透效果，设置了scoped的父组件可对子组件样式进行干扰 */
          border-color: @borderColor;
        }
      }
      .name-null {  //用户提交的评论昵称为空时显示
        /deep/ .el-input__inner {
          border-color: red;
        }
      }
      h5.has-nickname {
        font-size: 17px;
        border-left: 3px solid rgb(164, 182, 223);
        position: relative;
        top: 5px;
      }
      .body {
        width: 100%;
        /deep/ .el-textarea__inner {
          border-color: @borderColor;
        }
      }
      .body-null {  //用户提交的评论内容为空时显示
        /deep/ .el-textarea__inner {
          border-color: red;
        }
      }
      .btn-container {
        width: 100%;
        text-align: right;
        .el-button {
          margin: 10px 0 0 25px;
          font-size: 18px;
        }
      }
    }
    .comments-list {
      margin-top: 10px;
      .el-card {
        border-color: @borderColor;
        margin-bottom: 20px;
        h5 {
          box-shadow: -4px 0 0px -1px rgb(164, 182, 223);
          font-size: 17px;
        }
        p {
          font-size: 15px;
          margin: 15px 0 15px 0;
        }
        .reply {
          margin-left: 10%;
          h5 {
            box-shadow: -4px 0 0px -1px rgb(255, 72, 0);
          }
        }
        .time {
          text-align: right;
          margin: 0;
          font-size: 14px;
        }
      }
    }
    .show-more {
      text-align: center;
      i {
        font-size: 25px;
        color: inherit;
      }
      p {
        font-size: 12px;
        color: inherit;
      }
      &:hover {
        cursor: pointer;
        color: rgb(3, 104, 172);
      }
    }
  }
  div.moon {
    .add-comment h5 {
      color: @moonColor
    }
    .show-more {
      color: @moonColor;
    }
  }
</style>