<template>
  <el-card class="Label-container">
    <template #header>
      <div class="header">
        <el-button type="primary" size="small" icon="el-icon-plus" @click="handleAdd">增加</el-button>
        <el-popconfirm
            title="确定删除吗？"
            @confirm="handleDelete"
        >
          <template #reference>
            <el-button type="danger" size="small" icon="el-icon-delete">批量删除</el-button>
          </template>
        </el-popconfirm>
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
                       prop="labelid"
                       label="编号"
                       width="50"
      >
      </el-table-column>
      <el-table-column
          label="标签名称"
          width="110"
          prop="labelname"
      >

      </el-table-column>

      <el-table-column
          prop="labelrank"
          label="排序值"
          width="50"
      >
      </el-table-column>
      <el-table-column
          prop="createtime"
          label="添加时间"
          width="100"
      >
      </el-table-column>

      <el-table-column
          prop="createuser"
          label="添加用户"
          width="100"
      >
      </el-table-column>
      <el-table-column
          prop="updateuser"
          label="更新时间"
          width="100"
      >
      </el-table-column>
      <el-table-column
          label="操作"
          width="100"
      >
        <el-button
            size="mini"
            @click="handleEdit()">编辑
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
import {useRouter} from 'vue-router'
import DialogAddLabel from '@/components/DialogAddLabel.vue'

export default {
  name: 'LabelManagement',
  components: {
    DialogAddLabel
  },
  setup() {
    const router = useRouter()

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
      getLabels()
    })
    // 获取轮播图列表
    const getLabels = () => {
      state.loading = true
      console.log(res)
      axios.get('/admin/label', {
        params: {
          pageNumber: state.currentPage,
          pageSize: state.pageSize
        }
      }).then(res => {
        state.tableData = res.list
        state.total = res.totalCount
        state.currentPage = res.currPage
        state.loading = false
        console.log(res)
      })
    }
    // 添加轮播项
    const handleAdd = () =>{
      router.push({path: '/addLabel'})
    }

    // 修改轮播图
    const handleEdit = () =>{
      router.push({path: '/addLabel'})
    }


    // 选择项
    const handleSelectionChange = (val) => {
      state.multipleSelection = val
    }
    // 批量删除
    const handleDelete = () => {
      if (!state.multipleSelection.length) {
        ElMessage.error('请选择项')
        return
      }
      axios.delete('/admin/label', {
        data: {
          ids: state.multipleSelection.map(i => i.carouselId)
        }
      }).then(() => {
        ElMessage.success('删除成功')
        getCarousels()
      })
    }
    // 单个删除
    const handleDeleteOne = (id) => {
      axios.delete('/admin/label', {
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
      handleDelete,
      handleDeleteOne,
      getLabels,
      changePage
    }
  }
}
</script>

<style scoped>
.Label-container {
  min-height: 100%;
}
.el-card.is-always-shadow {
  min-height: 100%!important;
}
</style>