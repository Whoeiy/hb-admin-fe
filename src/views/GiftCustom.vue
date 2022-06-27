<template>
  <el-card class="service-container">
    <template #header>
      <div class="header">
        
        <!-- <el-button type="primary" size="small" icon="el-icon-edit">修改订单</el-button> -->
        <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd()">新增服务</el-button>
      </div>
    </template>

    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      >
      <el-table-column align="center"
        prop="serviceid"
        label="编号"
      >
      </el-table-column>

      <el-table-column align="center"
        prop="servicename"
        label="服务名称"
      >
      </el-table-column>

      <el-table-column
        label="服务样图"
        width="150px"
        align="center"
      >
        <template #default="scope">
          <img style="width: 100px; height: 100px;" :key="scope.row.serviceid" :src="$filters.prefix(scope.row.sampleimg)" alt="服务样图">
        </template>
      </el-table-column>

      <el-table-column align="center"
        prop="servicetype"
        label="服务类型"
      >
      </el-table-column>

      <el-table-column align="center"
        prop="showrank"
        label="排序"
      >
      </el-table-column>
      
      <el-table-column align="center" label="是否显示">
      <template #default="scope">
        <a style="cursor: pointer; margin-right: 10px" v-if="scope.row.isshown == 0" @click="handleStatus(scope.row.serviceid, 1)">不显示</a>
        <a style="cursor: pointer; margin-right: 10px" v-else @click="handleStatus(scope.row.serviceid, 0)">显示</a>
      </template>
      </el-table-column>

      <el-table-column label="操作" width="200" align="center">
        <template #default="scope">  
        <el-button
            size="mini"
            @click="handleEdit(scope.row.serviceid)">编辑
        </el-button>
        <el-popconfirm
            title="确定删除吗？"
            @confirm="handleDeleteOne(scope.row.serviceid)">
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
      vendorId: ''
      //nameEn: ''
    })
    onMounted(() => {
      getServiceList()
    })
    // 获取服务列表
    const getServiceList = async () => {
      const username = window.sessionStorage.getItem('username')
      //console.log(username)
      if(username == 'admin'){
        await axios.get('/admin/profile').then(res => {
        state.vendorId = res.adminID
        //console.log(state.vendorId)
      })
      }else{
        await axios.get('/admin/vendor/profile').then(res => {
          state.vendorId = res.vendorId
          //console.log(state.vendorId)
        })
      }
      state.loading = true 
      axios.get('/admin/custom-service'
      ,{
        params: {
          currentPage: state.currentPage,
          pageSize: state.pageSize,
          vendorId : state.vendorId
        }
      }).then(res => {
        state.tableData = res.list
        state.total = res.totalCount
        state.currentPage = res.currPage
        state.loading = false
      })
    }

    const handleAdd = () =>{
        router.push({path: '/addGiftCustom'})
    }

    const handleUpdate = () =>{
        router.push({path: '/addGiftCustom'})
    }
    const handleStatus = (id, status) => {
      axios.put(`admin/custom-service/showStatus?serviceId=${id}&showStatus=${status}`, {
        ids: id ? [id] : []
      }).then(() => {
        ElMessage.success('修改成功')
        getServiceList()
      })
    }
    const changePage = (val) => {
      state.currentPage = val
      getServiceList()
    }
    const handleDeleteOne = (id) => {
      axios.delete(`/admin/custom-service/${id}`, {
        data: {
          ids: [id]
        }
      }).then(() => {
        ElMessage.success('删除成功')
        getServiceList()
      })
    }

    const handleEdit = (id) => {
      router.push({ path: '/addGiftCustom', query: { id } })
    }
    
    return {
      ...toRefs(state),
      getServiceList,
      handleAdd,
      handleUpdate,
      handleStatus,
      changePage,
      handleDeleteOne,
      handleEdit
      
    }
  }
  }
</script>
<style scoped>
  .service-container {
    min-height: 100%;
  }
  .el-card.is-always-shadow {
    min-height: 100%!important;
  }
</style>