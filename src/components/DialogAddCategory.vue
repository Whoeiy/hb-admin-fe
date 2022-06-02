<template>
  <el-dialog
    :title="type == 'add' ? '添加分类' : '修改分类'"
    v-model="visible"
    width="400px"
    @close="handleClose"
  >
    <el-form :model="ruleForm" :rules="rules" ref="formRef" label-width="100px" class="good-form">
      <el-form-item label="分类名称" prop="name">
        <el-input type="text" v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="排序值" prop="rank">
        <el-input type="number" max='200' v-model="ruleForm.rank"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { reactive, ref, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import axios from '@/utils/axios'
import { hasEmoji } from '@/utils/index'
import { ElMessage } from 'element-plus'
export default {
  name: 'DialogAddCategory',
  props: {
    type: String,
    reload: Function
  },
  setup(props) {
    const formRef = ref(null)
    const route = useRoute()
    const state = reactive({
      visible: false,
      categorylevel: 1,
      parentid: 0,
      ruleForm: {
        name: '',
        rank: ''
      },
      rules: {
        name: [
          { required: 'true', message: '名称不能为空', trigger: ['change'] }
        ],
        rank: [
          { required: 'true', message: '排序值不能为空', trigger: ['change'] }
        ]
      },
      id: ''
    })
    // 获取详情
    const getDetail = (id) => {
      axios.get(`/admin/categories/level/${id}`).then(res => {
        state.ruleForm = {
          name: res.categoryname,
          rank: res.categoryrank
        }
        state.parentId = res.parentId
        state.categorylevel = res.categorylevel
      })
    }
    // 开启弹窗
    const open = (id) => {
      state.visible = true
      if (id) {
        state.id = id
        getDetail(id)
      } else {
        // 新增类目，从路由获取父分类id 和 分类级别
        const { level = 1, parent_id = 0 } = route.query
        console.log(route.query)
        state.ruleForm = {
          name: '',
          rank: ''
        }
        state.parentId = parentId
        state.categorylevel = categorylevel
      }
    }
    // 关闭弹窗
    const close = () => {
      state.visible = false
    }
    const handleClose = () => {
      formRef.value.resetFields()
    }
    const submitForm = () => {
      formRef.value.validate((valid) => {
        if (valid) {
          if (hasEmoji(state.ruleForm.name)) {
            ElMessage.error('不要输入表情包')
            return
          }
          if (state.ruleForm.name.length > 16) {
            ElMessage.error('名称不能超过16个字符')
            return
          }
          if (state.ruleForm.rank > 200) {
            ElMessage.error('排序不能超过200')
            return
          }
          if (props.type == 'add') {
            axios.post('/admin/categories', {
              categoryLevel: state.categorylevel,
              parentId: state.parentid,
              categoryName: state.ruleForm.name,
              categoryRank: state.ruleForm.rank
            }).then(() => {
              ElMessage.success('添加成功')
              state.visible = false
              if (props.reload) props.reload()
            })
          } else {
            axios.put('/admin/categories', {
              categoryid: state.id,
              categorylevel: state.categorylevel,
              parentid: state.parentid,
              categoryname: state.ruleForm.name,
              categoryrank: state.ruleForm.rank
            }).then(() => {
              ElMessage.success('修改成功')
              state.visible = false
              if (props.reload) props.reload()
            })
          }
        }
      })
    }
    return {
      ...toRefs(state),
      open,
      close,
      formRef,
      submitForm,
      handleClose
    }
  }
}
</script>