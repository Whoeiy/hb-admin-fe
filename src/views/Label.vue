<template>
  <el-card class="label-container">
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
          width="55"
      >
      </el-table-column>
      <el-table-column
          prop="labelname"
          label="标签名称"
          width="200"
      >
      </el-table-column>
      <el-table-column
          label="标签图"
          width="200">
        <template #default="scope">
          <img style="width: 200px;height: 200px" :src="scope.row.labelicon" alt="标签图">
        </template>
      </el-table-column>
      <el-table-column
          prop="labelrank"
          label="排序值"
          width="100"
      >
      </el-table-column>
      <el-table-column
          prop="createtime"
          label="添加时间"
          width="300"
          :formatter="dateFormat"
      >

      </el-table-column>
      <el-table-column
          label="操作"
          width="220"
      >
        <template #default="scope">
          <a style="cursor: pointer; margin-right: 10px" @click="handleEdit(scope.row.labelid)">修改</a>
          <a style="cursor: pointer; margin-right: 10px" @click="handleNext(scope.row)">下级标签</a>
          <el-popconfirm
              title="确定删除吗？"
              @confirm="handleDeleteOne(scope.row.labelid)"
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
 <DialogAddLabel ref='addGood' :reload="getLabels" :type="type" :labelLevel="labelLevel" :parentId="parentId" />
</template>

<script>
import { onMounted, onUnmounted, reactive, ref, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import DialogAddLabel from '@/components/DialogAddLabel.vue'
import axios from '@/utils/axios'
import moment from 'moment'
import 'moment/locale/zh-cn'
export default {
  name: 'Label',
  components: {
    DialogAddLabel
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
    const router = useRouter()
    const route = useRoute()
    const state = reactive({
      loading: false,
      tableData: [], // 数据列表
      multipleSelection: [], // 选中项
      total: 0, // 总条数
      currentPage: 1, // 当前页
      pageSize: 10, // 分页大小
      type: 'add', // 操作类型
      labelLevel: 1,
      parentId: 0
    })
    onMounted(() => {
      getLabels()
    })
    onUnmounted(() => {
      unwatch()
    })
    const unwatch = router.afterEach((to) => {
      if (['label', 'labelLevel2', 'labelLevel3'].includes(to.name)) {
        getLabels()
      }
    })

    // 获取分类列表
    const getLabels = () => {
      const { labelLevel = 1, parentId = 0 } = route.query
      console.log(route.query)
      state.loading = true
      axios.get(`/admin/label/labelLevel`, {
        params: {
          currentPage: state.currentPage,
          pageSize: state.pageSize,
          labelLevel:  labelLevel,
          parentId: parentId,
        }
      }).then(res => { console.log(res)
        state.tableData = res.list
        state.total = res.totalCount
        state.currentPage = res.currPage
        state.loading = false
        state.labellevel = labelLevel
        state.parentid = parentId
      })
    }
    // 添加分类
    const handleAdd = () => {
      state.type = 'add'
      addGood.value.open()
    }
    // 修改分类
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
      axios.delete(`/admin/label/${id}`, {
        data: {
          ids: [id]
        }
      }).then(() => {
        ElMessage.success('删除成功')
        getLabels()
      })
    }
    const changePage = (val) => {
      state.currentPage = val
      getLabels()
    }
    const handleNext = (item) => {
      const levelNumber = item.labellevel + 1
      if (levelNumber == 4) {
        ElMessage.error('没有下一级')
        return
      }
      router.push({
        name: `labelLevel${levelNumber}`,
        query: {
          labelLevel: levelNumber,
          parentId: item.labelid
        }
      })
    }


    return {
      ...toRefs(state),
      multipleTable,
      handleSelectionChange,
      addGood,
      handleAdd,
      handleEdit,

      handleDeleteOne,
      getLabels,
      changePage,
      handleNext,

    }
  }
}
</script>

<style scoped>
.label-container {
  min-height: 100%;
}
.el-card.is-always-shadow {
  min-height: 100%!important;
}
</style>