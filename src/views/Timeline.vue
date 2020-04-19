<template>
  <div>
    <el-timeline :reverse="false">
      <el-timeline-item v-for="(thing, index) in things" :key="index"
                       :timestamp="thing.time" placement="top" size="large">
        <el-card>
          <h4>{{thing.title}}</h4>
          <p>{{thing.body}}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  name: 'Timeline',
  data() {
    return {
      things: []
    }
  },
  methods: {
    getThings() {
      this.$http.get('timeline').then(res => {
        this.things = res.data
      })
    }
  },
  created() {
    this.getThings()
  }
}
</script>

<style lang="less" scoped>
  .el-timeline {
    @media screen and (max-width: 800px){
      margin: 0 auto;
    }
    width: 70%;
    margin-left: 170px;  //和navbar对应
    /deep/ .el-timeline-item__tail {
      border-left-color: rgb(199, 198, 197);
    }
    /deep/ .el-timeline-item__node {
      background-color: rgb(199, 198, 197);
    }
    .el-card {
      h4 {
        font-size: 17px;
        margin-bottom: 10px;
        color: rgb(146, 31, 2);
      }
    }
  }
</style>