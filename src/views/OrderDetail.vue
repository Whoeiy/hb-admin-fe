<template>
  <el-card class="order-container">
    <div class="data">
      <el-card class="data-item" shadow="hover">
        <template #header>
          <div class="card-header">
            <span>订单状态</span>
          </div>
        </template>
        <div>
          {{ data.orderStatusName }}
        </div>
      </el-card>
      <el-card class="data-item" shadow="hover">
        <template #header>
          <div class="card-header">
            <span>创建时间</span>
          </div>
        </template>
        <div>
          {{ formatDate(data.createTime) }}
        </div>
      </el-card>
      <el-card class="data-item" shadow="hover">
        <template #header>
          <div class="card-header">
            <span>订单号</span>
          </div>
        </template>
        <div>
          {{ data.orderNo }}
        </div>
      </el-card>
    </div>
    <el-table :data="tableData" tooltip-effect="dark" style="width: 100%">
      <el-table-column label="商品图片">
        <template #default="scope">
          <img
            style="width: 100px"
            :key="scope.row.orderItemId"
            :src="$filters.prefix(scope.row.giftImg)"
            alt="商品主图"
          />
        </template>
      </el-table-column>
      <el-table-column prop="orderItemId" label="商品编号"> </el-table-column>
      <el-table-column prop="giftName" label="商品名"></el-table-column>
      <el-table-column prop="giftCount" label="商品数量" align="center"> </el-table-column>

      <el-table-column label="定制服务">
        <template #default="scope">
          {{ scope.row.service.serviceChosenTypeName }}:
          <div v-if="scope.row.service.serviceChosenType == 3">
            {{ scope.row.service.serviceNote }}-{{ scope.row.service.phone }}
          </div>
          <div v-if="scope.row.service.serviceChosenType == 2">
            {{ scope.row.service.normalServiceName }}-{{ scope.row.service.normalServiceTypeName }}
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="sellingPrice" label="价格" align="center"> 
        <template #default="scope">
          ¥{{ scope.row.sellingPrice }}
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
import { onMounted, reactive, toRefs } from "vue";
import { useRoute } from "vue-router";
import axios from "@/utils/axios";
export default {
  name: "OrderDetail",
  setup() {
    const route = useRoute();
    const { id } = route.query;
    const state = reactive({
      data: {},
      tableData: [],
    });
    onMounted(() => {
      axios.get(`/admin/order/${id}`).then((res) => {
        console.log(res);
        state.data = res;
        state.tableData = res.orderItemVos;
      });
    });

    const formatDate = (value) => {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
    };

    return {
      ...toRefs(state),
      formatDate,
    };
  },
};
</script>

<style scoped>
.data {
  display: flex;
  margin-bottom: 50px;
}
.data .data-item {
  flex: 1;
  margin: 0 10px;
}
.el-table {
  border: 1px solid #ebeef5;
  border-bottom: none;
}
.has-gutter th {
  border-right: 1px solid #ebeef5;
}

.has-gutter th:last-child {
  border-right: none;
}
.el-table__row td {
  border-right: 1px solid #ebeef5;
}
.el-table__row td:last-child {
  border-right: none;
}
</style>