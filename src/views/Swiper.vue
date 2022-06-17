<template>
  <el-card class="swiper-container">
    <template #header>
      <div class="header">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">增加</el-button>

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
    label="轮播图"
    width="200">
    <template #default="scope">
      <img style="width: 200px;height: 200px" :src="scope.row.imgUrl" alt="轮播图">
    </template>
 </el-table-column>
 <el-table-column
     label="跳转链接"
     >
     <template #default="scope">
       <a target="_blank" :href="scope.row.redirectUrl">{{ scope.row.jumpUrl }}</a>
     </template>
   </el-table-column>



       <el-table-column align="center"
         prop="showRank"
         label="排序值"
         width="170"
       >
       </el-table-column>
       <el-table-column align="center"
           prop="isDeleted"
           label="是否删除"
           width="120"
       >
       </el-table-column>
       <el-table-column align="center"
         prop="createTime"
         label="添加时间"
         width="200"
         :formatter="dateFormat"
       >
       </el-table-column>
       <el-table-column align="center"
         label="操作"
         width="200"
       >
         <template #default="scope">
           <a style="cursor: pointer; margin-right: 10px" @click="handleEdit(scope.row.carouselId)">修改</a>
           <el-popconfirm
             title="确定删除吗？"
             @confirm="handleDeleteOne(scope.row.carouselId)"
           >
             <template #reference>
               <a style="cursor: pointer">删除</a>
             </template>
           </el-popconfirm>
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
  <DialogAddSwiper ref='addGood' :reload="getCarousels" :type="type" />
</template>

<script>
import { onMounted, reactive, ref, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
import DialogAddSwiper from '@/components/DialogAddSwiper.vue'
import axios from '@/utils/axios'
import moment from 'moment'
import 'moment/locale/zh-cn'
export default {
  name: 'Swiper',
  components: {
    DialogAddSwiper
  },
  methods: {
    //时间格式化
    dateFormat:function(row, column) {
      var date = row[column.property];
      if (date == undefined) {
        return "";
      }
      return moment(date).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  setup() {
    const multipleTable = ref(null)
    const addGood = ref(null)
    const state = reactive({
      loading: false,
      tableData: [], // 数据列表
      multipleSelection: [], // 选中项
      total: 0, // 总条数
      currentPage: 1, // 当前页
      pageSize: 10, // 分页大小
      type: 'add', // 操作类型
    })
    onMounted(() => {
      getCarousels()
    })
    // 获取轮播图列表
    const getCarousels = () => {
      state.loading = true
      axios.get('/admin/carousels', {
        params: {
          pageNumber: state.currentPage,
          pageSize: state.pageSize
        }
      }).then(res => {  console.log(res)
        state.tableData = res
       //state.total = res.totalCount
       // state.currentPage = res.currPage
        state.loading = false
      })

    }
    // 添加轮播项
    const handleAdd = () => {
      state.type = 'add'
      addGood.value.open()
    }
    // 修改轮播图
    const handleEdit = (id) => {
      state.type = 'edit'
      addGood.value.open(id)

    }
    // 选择项
    const handleSelectionChange = (val) => {
      state.multipleSelection = val
    }

    // 单个删除

    const handleDeleteOne = (id) => {
      axios.delete(`/admin/carousel/${id}`, {
        data: {
          ids: [id]
        }
      }).then(() => {
        ElMessage.success('删除成功')
        getCarousels()
      })
    }
    const changePage = (val) => {
      state.currentPage = val
      getCarousels()
    }
    return {
      ...toRefs(state),
      multipleTable,
      handleSelectionChange,
      addGood,
      handleAdd,
      handleEdit,

      handleDeleteOne,
      getCarousels,
      changePage
    }
  }
}
</script>

<style scoped>
  .swiper-container {
    min-height: 100%;
  }
  .el-card.is-always-shadow {
    min-height: 100%!important;
  }
</style>