<template>
  <el-card class="vendor-container">
    <template #header>
      <div class="header">
        <el-input
          style="width: 200px; margin-right: 10px"
          placeholder="请输入商家英文名称"
          size="small"
          clearable
        />
        
        <!-- <el-button type="primary" size="small" icon="el-icon-edit">修改订单</el-button> -->
        <el-button type="primary" size="small" icon="el-icon-search" @click="handleConfig()">搜索</el-button>
        <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd()">新增商家</el-button>
      </div>
    </template>

    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      >
      <el-table-column align="center"
        prop="vendorId"
        label="编号"
      >
      </el-table-column>

      <el-table-column align="center"
        prop="nameCn"
        label="商家中文名称"
      >
      </el-table-column>

      <el-table-column align="center"
        prop="nameEn"
        label="商家英文名称"
      >
      </el-table-column>

      <el-table-column align="center"
        prop="showRank"
        label="排序"
      >
      </el-table-column>
      
      <el-table-column align="center"
        label="是否显示"
      >
      <!-- <template #default="scope">
        <el-switch
          @change="handleShowStatusChange(scope.$index, scope.row)"
          :active-value="1"
          :inactive-value="0"
          v-model="scope.row.isShown"
          active-color="#13ce66"
          inactive-color="#ff4949">
        </el-switch>
      </template> -->
      </el-table-column>

      <el-table-column label="操作" width="200" align="center">  
        <el-button
            size="mini"
            @click="handleUpdate()">编辑
        </el-button>
        <el-button
            size="mini"
            type="danger"
            @click="handleDelete()">删除
        </el-button>
        
      </el-table-column>
      
      
    </el-table>

    
  </el-card>
</template>



<script>
import { onMounted, reactive, ref, toRefs } from 'vue'
import axios from '@/utils/axios'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

export default {
  name: 'Vendor',
  setup() {
    const multipleTable = ref(null)
    const router = useRouter()
    const state = reactive({
      loading: false,
      tableData: [], // 数据列表
      multipleSelection: [], // 选中项
      total: 0, // 总条数
      currentPage: 1, // 当前页
      pageSize: 10 // 分页大小
    })
    onMounted(() => {
      getVendorList()
    })
    // 获取轮播图列表
    const getVendorList = () => {
      state.loading = true
      axios.get('/admin/vendor', {
        params: {
          pageNum: state.currentPage,
          pageSize: state.pageSize
        }
      }).then(res => {
        state.tableData = res.list
        state.total = res.totalCount
        state.currentPage = res.currPage
        state.loading = false
        console.log(res)
      }).catch(res => {
        console.log(res)
      })
    }

    const handleAdd = () =>{
        router.push({path: '/addVendor'})
    }

    const handleUpdate = () =>{
        router.push({path: '/addVendor'})
    }


    // handleShowStatusChange = (index, row) => {
    //     let data = new URLSearchParams();
    //     data.append("ids", row.id);
    //     data.append("showStatus", row.showStatus);
    //     updateShowStatus(data).then(response => {
    //       this.$message({
    //         message: '修改成功',
    //         type: 'success',
    //         duration: 1000
    //       });
    //     }).catch(error => {
    //       if (row.showStatus === 0) {
    //         row.showStatus = 1;
    //       } else {
    //         row.showStatus = 0;
    //       }
    //     });
    //   }

    
    return {
      ...toRefs(state),
      getVendorList,
      handleAdd,
      handleUpdate
      //handleShowStatusChange
      
    }
  }
  }
</script>
<style scoped>
  .vendor-container {
    min-height: 100%;
  }
  .el-card.is-always-shadow {
    min-height: 100%!important;
  }
</style>