<template>
  <el-dialog
      :title="type == 'add' ? '添加礼物' : '修改礼物'"
      v-model="visible"
      width="400px"
      @close="handleClose"
  >
    <el-form :model="ruleForm" :rules="rules" ref="formRef" label-width="100px" class="good-form">
      <el-form-item label="礼物名称" prop="name">
        <el-input type="text" v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="跳转链接" prop="link">
        <el-input type="text" v-model="ruleForm.link"></el-input>
      </el-form-item>
      <el-form-item label="礼物编号" prop="id">
        <el-input type="number" min="0" v-model="ruleForm.id"></el-input>
      </el-form-item>
      <el-form-item label="排序值" prop="sort">
        <el-input type="number" v-model="ruleForm.sort"></el-input>
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
import { hasEmoji } from '@/utils/index'
import { ElMessage } from 'element-plus'
export default {
  name: 'DialogAddHotGood',
  props: {
    type: String,
    configType: Number,
    reload: Function
  },
  setup(props) {
    const formRef = ref(null)
    const state = reactive({
      visible: false,
      createUser: 1,
      configType: '',
      ruleForm: {
        name: '',
        link: '',
        id: '',
        sort: '',
      },
      rules: {
        name: [
          { required: 'true', message: '名称不能为空', trigger: ['change'] }
        ],
        id: [
          { required: 'true', message: '编号不能为空', trigger: ['change'] }
        ],
        link: [
          { required: 'true', message: 'link不能为空', trigger: ['change'] }
        ],
        sort: [
          { required: 'true', message: '排序不能为空', trigger: ['change'] }
        ],
      },
      id: ''
    })
    // 获取详情
    const getDetail = (id) => {
      axios.get(`/admin/indexConfig/${id}`).then(res => {
        state.ruleForm = {
          name: res.configName,
          id: res.giftId,
          link: res.redirectUrl,
          sort: res.configRank,
        }
        state.configType = res.configType,
        state.createUser = res.createUser
      })
    }
    // 开启弹窗
    const open = (id) => {
      state.visible = true
      if (id) { // 更新
        state.id = id
        getDetail(id)
      } else { // 修改
        state.ruleForm = {
          name: '',
          id: '',
          link: '',
          sort: '',
        }
        state.createUser = 1
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
          if (hasEmoji(state.ruleForm.name) || hasEmoji(state.ruleForm.link)) {
            ElMessage.error('不要输入表情包')
            return
          }
          if (state.ruleForm.name.length > 128) {
            ElMessage.error('礼物名称不能超过128个字符')
            return
          }
          if (state.ruleForm.sort < 0 || state.ruleForm.sort > 200) {
            ElMessage.error('排序值不能小于 0 或大于 200')
            return
          }
          if (props.type == 'add') {
            axios.post('/admin/indexConfig', {
              configType: props.configType || 1,
              configName: state.ruleForm.name,
              redirectUrl: state.ruleForm.link,
              giftId: state.ruleForm.id,
              configRank: state.ruleForm.sort,
              // configType: props.configType || 1,
              createUser: state.createUser

            }).then(() => {
              ElMessage.success('添加成功')
              state.visible = false
              if (props.reload) props.reload()
            })
          } else {
            axios.put('/admin/indexConfig', {
              configId: state.id,
              configType: props.configType || 1,
              configName: state.ruleForm.name,
              redirectUrl: state.ruleForm.link,
              giftId: state.ruleForm.id,
              configRank: state.ruleForm.sort,
              createUser: state.createUser,
              // configType: state.configType,
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
</style>