<template>
  <el-card class="vendor-container">
    <template #header>
      <div class="header">
        <el-input
          style="width: 200px; margin-right: 10px"
          placeholder="请输入商家英文名称"
          v-model="nameEn"
          @change="handleOption"
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
      
      <el-table-column align="center" label="是否显示">
      <template #default="scope">
        <a style="cursor: pointer; margin-right: 10px" v-if="scope.row.isShown == 0" @click="handleStatus(scope.row.vendorId, 1)">不显示</a>
        <a style="cursor: pointer; margin-right: 10px" v-else @click="handleStatus(scope.row.vendorId, 0)">显示</a>
      </template>
      </el-table-column>

      <el-table-column label="操作" width="200" align="center">
        <template #default="scope">  
        <el-button
            size="mini"
            @click="handleEdit(scope.row.vendorId)">编辑
        </el-button>
        <el-popconfirm
            title="确定删除吗？"
            @confirm="handleDeleteOne(scope.row.vendorId)">
            <template #reference>
              <el-button size="mini" type="danger">删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
      
      
    </el-table>
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
      pageSize: 10, // 分页大小
      nameEn: ''
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
          pageSize: state.pageSize,
          nameEn: state.nameEn,
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
    const handleStatus = (id, status) => {
      axios.put(`admin/vendor/showStatus?vendorId=${id}&showStatus=${status}`, {
        ids: id ? [id] : []
      }).then(() => {
        ElMessage.success('修改成功')
        getVendorList()
      })
    }
    const changePage = (val) => {
      state.currentPage = val
      getVendorList()
    }
    const handleDeleteOne = (id) => {
      axios.delete(`/admin/vendor/${id}`, {
        data: {
          ids: [id]
        }
      }).then(() => {
        ElMessage.success('删除成功')
        getVendorList()
      })
    }

    const handleOption = () => {
      state.currentPage = 1
      state.nameEn = nameEn
      getVendorList()
    }

    const handleConfig = () => {
      console.log('nameEn', state.nameEn)
      //let params
      axios.put(`/admin/vendor?pageNum=${state.pageNum}&pageSize=${state.pageSize}&keyword=${state.nameEn}`, {
        //ids: params
      }).then(() => {
        getVendorList()
      })
    }

    const handleEdit = (id) => {
      router.push({ path: '/addVendor', query: { id } })
    }
    
    return {
      ...toRefs(state),
      getVendorList,
      handleAdd,
      handleUpdate,
      handleStatus,
      changePage,
      handleDeleteOne,
      handleOption,
      handleConfig,
      handleEdit
      
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