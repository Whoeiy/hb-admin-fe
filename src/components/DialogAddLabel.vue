<template>
  <el-dialog
      :title="type == 'add' ? '添加标签' : '修改标签'"
      v-model="visible"
      width="400px"
      @close="handleClose"
  >
    <el-form :model="ruleForm" :rules="rules" ref="formRef" label-width="100px" class="good-form">

      <el-form-item label="标签" prop="name">
        <el-input type="text" v-model="ruleForm.name"></el-input>
      </el-form-item>

      <el-form-item label="排序值" prop="sort">
        <el-input type="number" v-model="ruleForm.sort"></el-input>
      </el-form-item>
      <el-form-item label="User" prop="sort">
        <el-input type="number" v-model="ruleForm.createuser"></el-input>
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
import axios from '@/utils/axios'
import { localGet, uploadImgServer, hasEmoji } from '@/utils'
import { ElMessage } from 'element-plus'

export default {
  name: 'DialogAddLabel',
  props: {
    type: String,
    reload: Function
  },
  setup(props) {
    const formRef = ref(null)
    const state = reactive({
      uploadImgServer,
      token: localGet('token') || '',
      visible: false,
      ruleForm: {

        name: '',
        sort: '',
        createuser:'',
      },
      rules: {
        name: [
          { required: 'true', message: '标签名不能为空', trigger: ['change'] }
        ],
        sort: [
          { required: 'true', message: '排序不能为空', trigger: ['change'] }
        ],

          createuser: [
            { required: 'true', message: '用户不能为空', trigger: ['change'] }
          ]
        },
      id: ''
    })
    // 获取详情
    const getDetail = (id) => {
      axios.get(`/admin/label/${id}`).then(res => {
        state.ruleForm = {
          name: res.labelname,
          sort: res.labelrank,
          createuser :res.createuser,
        }
      })
    }


    // 开启弹窗
    const open = (id) => {
      state.visible = true
      if (id) {
        state.id = id
        getDetail(id)
      } else {
        state.ruleForm = {

          name: '',
          sort: '',
          createuser:'',
        }
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
      console.log(formRef.value.validate)
      formRef.value.validate((valid) => {
        if (valid) {
          if (hasEmoji(state.ruleForm.name)) {
            ElMessage.error('不要输入表情包')
            return
          }

          if (props.type == 'add') {
            axios.post('/admin/label', {

              labelname: state.ruleForm.name,
              labelrank: state.ruleForm.sort,
              createuser: state.ruleForm.createuser

            }).then(() => {
              ElMessage.success('添加成功')
              state.visible = false
              if (props.reload) props.reload()
            })
          } else {
            axios.put('/admin/label', {
              labelid: state.id,
              createuser: state.ruleForm.createuser,
              labelname: state.ruleForm.name,
              labelrank: state.ruleForm.sort
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

<style scoped>
.avatar-uploader {
  width: 100px;
  height: 100px;
  color: #ddd;
  font-size: 30px;
}
.avatar-uploader-icon {
  display: block;
  width: 100%;
  height: 100%;
  border: 1px solid #e9e9e9;
  padding: 32px 17px;
}
</style>