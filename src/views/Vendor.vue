<template>
  <el-card class="order-container">
    <template #header>
      <div class="header">
        <el-input
          style="width: 200px; margin-right: 10px"
          placeholder="请输入商家英文名称"
          v-model="orderNo"
          @change="handleOption"
          size="small"
          clearable
        />
        
        <!-- <el-button type="primary" size="small" icon="el-icon-edit">修改订单</el-button> -->
        <el-button type="primary" size="small" icon="el-icon-search" @click="handleConfig()">搜索</el-button>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="handleSend()">新增商家</el-button>
      </div>
    </template>

    <el-table
      v-loading="loading"
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="vendorId"
        label="编号"
      >
      </el-table-column>
      <el-table-column
        prop="vendorName"
        label="商家中文名称"
      >
      </el-table-column>
      <el-table-column
        prop="vendorEnName"
        label="商家英文名称"
      >
      </el-table-column>
      <el-table-column
        prop="sortNum"
        label="排序"
      >
      </el-table-column>
      <el-table-column
        prop="ifShow"
        label="是否显示"
      >
      <el-radio-group v-model="brand.showStatus">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-table-column>


      <el-table-column label="操作" width="100">  
        <el-button
            size="mini"
            @click="handleUpdate(scope.$index, scope.row)">编辑
        </el-button>
        <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除
        </el-button>
        
      </el-table-column>
    </el-table>
    
    <!-- 总数超过一页，再展示分页器 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="changePage"
    />
  </el-card>
</template>

<script>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import axios from '@/utils/axios'

// export default{
//     name: "",
//     data(){
//         return{
//             tableData:[
//                 {
//                     vendorId: 1,
//                     vendorName: '',
//                     vendorEnName: '',
//                     sortNum: 1,

//                 },
//             ]
//         }
//     }
// }

</script>

<style scoped>
  .order-container {
    min-height: 100%;
  }
  .el-card.is-always-shadow {
    min-height: 100%!important;
  }
</style>