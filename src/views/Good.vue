<template>
  <el-card class="good-container">
    <template #header>
      <div class="header">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">新增礼物</el-button>
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
        prop="giftId"
        label="礼物编号"
      >
      </el-table-column>

      <el-table-column
        prop="giftName"
        label="礼物名"
      >
      </el-table-column>

      <el-table-column
        prop="giftIntro"
        label="礼物简介"
      >
      </el-table-column>
      
      <el-table-column
        label="礼物图片"
        width="150px"
      >
        <template #default="scope">
          <img style="width: 100px; height: 100px;" :key="scope.row.giftId" :src="$filters.prefix(scope.row.imgUrl)" alt="商品主图">
        </template>
      </el-table-column>
      <el-table-column
        prop="stockNum"
        label="礼物库存"
      >
      </el-table-column>

      <el-table-column
        prop="originalPrice"
        label="礼物原价"
      >
      </el-table-column>

      <el-table-column
        prop="vipPrice"
        label="礼物售价"
      >
      </el-table-column>

      <el-table-column
        label="上架状态"
      >
        <template #default="scope">
          <span style="color: green;" v-if="scope.row.isShown == 0">销售中</span>
          <span style="color: red;" v-else>已下架</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="100"
      >

        <template #default="scope">
          <a style="cursor: pointer; margin-right: 10px" @click="handleEdit(scope.row.giftId)">修改</a>
          <a style="cursor: pointer; margin-right: 10px"  v-if="scope.row.isShown == 0" @click="handleStatus(scope.row.giftId, 1)">下架</a>
          <a style="cursor: pointer; margin-right: 10px"  v-else @click="handleStatus(scope.row.giftId, 0)">上架</a>
        </template>
    </el-table-column>
    </el-table>
    <!--总数超过一页，再展示分页器-->
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
import { onBeforeMount, onMounted, reactive, ref, toRefs } from 'vue'
import axios from '@/utils/axios'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
export default {
  name: 'Good',
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
    })
    
    // onBeforeMount(() => {
    //   getVendorId()
    // })
    onMounted(() => {
      //getVendorId()
      getGoodList()
    })

    // const getVendorId = () =>{
    //   axios.get('/admin/vendor/profile').then(res => {
    //     state.vendorId = res.vendorId
    //     //console.log(state.vendorId)
    //   })
    // }

    // 获取礼物列表
    const getGoodList = async () => {
      await axios.get('/admin/vendor/profile').then(res => {
        state.vendorId = res.vendorId
        console.log(state.vendorId)
      })
      state.loading = true 
      axios.get('/admin/gift'
      ,{
        params: {
          pageNum: state.currentPage,
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

    const handleAdd = () => {
      router.push({ path: '/add' })
    }
    const handleEdit = (id) => {
      router.push({ path: '/add', query: { id } })
    }
    // 选择项
    const handleSelectionChange = (val) => {
      state.multipleSelection = val
    }
    const changePage = (val) => {
      state.currentPage = val
      getGoodList()
    }
    const handleStatus = (id, status) => {
      //修改
      axios.put(`admin/gift/showStatus?giftId=${id}&showStatus=${status}`, {
        ids: id ? [id] : []
      }).then(() => {
        ElMessage.success('修改成功')
        getGoodList()
      })
    }
    return {
      ...toRefs(state),
      multipleTable,
      handleSelectionChange,
      handleAdd,
      handleEdit,
      getGoodList,
      changePage,
      handleStatus,
      // getVendorId
    }
  }
}
</script>

<style scoped>
  .good-container {
    min-height: 100%;
  }
  .el-card.is-always-shadow {
    min-height: 100%!important;
  }
</style>
