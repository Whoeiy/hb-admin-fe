<template>
  <el-card class="vendor-container">
    <template #header>
      <div class="header">
        <!-- <el-button type="primary" size="small" icon="el-icon-edit">修改订单</el-button> -->
        <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd()">新增活动</el-button>
      </div>
    </template>
    <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
    >
      <el-table-column align="center"
                       prop="activityid"
                       label="编号"
      >
      </el-table-column>

      <el-table-column align="center"
                       prop="activityname"
                       label="活动名称"
      >
      </el-table-column>
      <el-table-column
          align="center"
          label="海报图"
         >
        <template #default="scope">
          <img style="width: 200px;height: 200px" :src="scope.row.posterurl" alt="海报图">
        </template>
      </el-table-column>
      <el-table-column align="center"
                       prop="activitytype"
                       label="活动类型"
      >
        <template #default="scope">
          <a style="cursor: pointer; margin-right: 10px" v-if="scope.row.activitytype == 1 ">有奖活动</a>
          <a style="cursor: pointer; margin-right: 10px" v-else>主题活动</a>
        </template>
      </el-table-column>

      <el-table-column align="center"
                       prop="activitydetail"
                       label="活动细节"
      >
      </el-table-column>
      <el-table-column align="center"
                       prop="activitystatus"
                       label="活动状态"
      >
        <template #default="scope">
          <a style="cursor: pointer; margin-right: 10px" v-if="scope.row.activitystatus == 0 ">未开始</a>
          <a style="cursor: pointer; margin-right: 10px" v-if="scope.row.activitystatus == 2 ">已结束</a>
          <a style="cursor: pointer; margin-right: 10px" v-if="scope.row.activitystatus == 1 ">进行中</a>
        </template>
      </el-table-column>
      <el-table-column align="center"
                       prop="starttime"
                       label="开始日期"
                       :formatter="dateFormat"
      >
      </el-table-column>

      <el-table-column align="center"
                       prop="endtime"
                       label="结束日期"
                       :formatter="dateFormat"
      >
      </el-table-column>

      <el-table-column align="center"
                       prop="showrank"
                       label="排序值"
      >
      </el-table-column>

      <el-table-column align="center" label="是否显示">
        <template #default="scope">
          <a style="cursor: pointer; margin-right: 10px" v-if="scope.row.isShown == 0" @click="handleStatus(scope.row.activityid, 1)">不显示</a>
          <a style="cursor: pointer; margin-right: 10px" v-else @click="handleStatus(scope.row.activityid, 0)">显示</a>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="300" align="center">
        <template #default="scope">
          <el-button
              size="mini"
              @click="handleEdit(scope.row.activityid)">编辑
          </el-button>
          <el-button
              size="mini"
              @click="handleEdit(scope.row.activityid)">开始
          </el-button>
          <el-button
              size="mini"
              @click="handleEdit(scope.row.activityid)">结束
          </el-button>
          <el-popconfirm
              title="确定删除吗？"
              @confirm="handleDeleteOne(scope.row.activityid)">
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
import moment from "moment";

export default {
  name: 'Activity',
  methods: {
    //时间格式化
    dateFormat:function(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD");
    },
  },
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
      axios.get('/admin/activity', {
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
      router.push({path: '/addActivity'})
    }

    const handleUpdate = () =>{
      router.push({path: '/addActivity'})
    }
    const handleStatus = (id, status) => {
      axios.put(`admin/activity/showStatus?activityId=${id}&showstatus=${status}`, {
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
      axios.delete(`/admin/activity/${id}`, {
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
      if(activityname == undefined){
        getVendorList()
      }
      state.activityname = activityname
      console.log('activityname', state.activityname)
      getVendorList()
    }

    const handleConfig = () => {
      console.log('activityname', state.activityname)
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
      router.push({ path: '/addActivity', query: { id } })
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