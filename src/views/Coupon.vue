<template>
  <el-card class="vendor-container">
    <template #header>
      <div class="header">

        <!-- <el-button type="primary" size="small" icon="el-icon-edit">修改订单</el-button> -->
        <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd()">新增优惠劵</el-button>
      </div>
    </template>

    <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
    >
      <el-table-column align="center"
                       prop="couponid"
                       label="编号"
      >
      </el-table-column>

      <el-table-column align="center"
                       prop="couponname"
                       label="优惠劵名称"
      >
      </el-table-column>

      <el-table-column align="center"
                       prop="coupontype"
                       label="优惠劵类型"
      >
        <template #default="scope">
          <a style="cursor: pointer; margin-right: 10px" v-if="scope.row.coupontype == 1 ">活动优惠券</a>
          <a style="cursor: pointer; margin-right: 10px" v-else>普通优惠劵</a>
        </template>
      </el-table-column>

      <el-table-column align="center"
                       prop="couponprice"
                       label="优惠券价格"
      >
      </el-table-column>
      <el-table-column align="center"
                       prop="starttime"
                       label="生效日期"
      >
      </el-table-column>

      <el-table-column align="center"
                       prop="endtime"
                       label="失效日期"
      >
      </el-table-column>

      <el-table-column align="center"
                       prop="showrank"
                       label="排序值"
      >
      </el-table-column>

      <el-table-column align="center" label="是否显示">
        <template #default="scope">
          <a style="cursor: pointer; margin-right: 10px" v-if="scope.row.isShown == 0" @click="handleStatus(scope.row.couponid, 1)">不显示</a>
          <a style="cursor: pointer; margin-right: 10px" v-else @click="handleStatus(scope.row.couponid, 0)">显示</a>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200" align="center">
        <template #default="scope">
          <el-button
              size="mini"
              @click="handleEdit(scope.row.couponid)">编辑
          </el-button>
          <el-popconfirm
              title="确定删除吗？"
              @confirm="handleDeleteOne(scope.row.couponid)">
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
  name: 'Coupon',
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
      createUser: ''
    })
    onMounted(() => {
      getVendorList()
    })
    // 获取商家列表
    const getVendorList = () => {
      state.loading = true
      axios.get('/admin/coupon', {
        params: {
          currentPage: state.currentPage,
          pageSize: state.pageSize,
        //  createUser: state.createUser,
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
      router.push({path: '/addCoupon'})
    }

    const handleUpdate = () =>{
      router.push({path: '/addCoupon'})
    }
    const handleStatus = (id, status) => {
      axios.put(`admin/coupon/showStatus?couponId=${id}&showStatus=${status}`, {
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
      axios.delete(`/admin/coupon/${id}`, {
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
      if(couponname == undefined){
        getVendorList()
      }
      state.couponname = couponname
      console.log('couponname', state.couponname)
      getVendorList()
    }

    const handleConfig = () => {
      console.log('couponname', state.couponname)
      //let params
      axios.get(`/admin/vendor?pageNum=${state.currentPage}&pageSize=${state.pageSize}&keyword=${state.nameEn}`, {
        //ids: params
      }).then(res => {
        state.tableData = res.list
        state.total = res.totalCount
        state.currentPage = res.currPage
        state.loading = false
        console.log(res)
      })
    }

    const handleEdit = (id) => {
      router.push({ path: '/addCoupon', query: { id } })
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