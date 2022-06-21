<template>
  <el-card class="account-container">

    <ul>
      <li></li>
      <li></li>
    </ul>
  </el-card>
</template>

<script>
export default {
  name: 'Introduce',
  setup() {
    const goJuejin = () => {
      console.log('goJuejin')
      window.open('https://juejin.cn/book/6933939264455442444', 'target')
    }

    return {
      goJuejin
    }
  }
}
</script>
<style scoped>
  .course {
    font-weight: bold;
    display: inline-block;
  }
  .course li {
    line-height: 36px;

    cursor: pointer;
  }
</style>