<template>
  <el-card class="account-container">

    <ul>
      <li>为Heatbeat365服务的管理系统</li>
      <li>为商家提供所属礼物，订单，定制服务管理</li>
      <li>为管理员提供首页，分类，标签，礼物，订单，商家，定制服务，优惠券，活动管理</li>
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