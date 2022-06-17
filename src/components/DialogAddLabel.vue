<template>
  <el-dialog
      :title="type == 'add' ? '添加标签' : '修改标签'"
      v-model="visible"
      width="400px"
      @close="handleClose"
  >
    <el-form :model="ruleForm" :rules="rules" ref="formRef" label-width="100px" class="good-form">
      <el-form-item label="标签名称" prop="name">
        <el-input type="text" v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="标签图片" prop="url">
        <el-upload
            class="avatar-uploader"
            :action="uploadImgServer"
            accept="jpg,jpeg,png"
            :headers="{
            token: token
          }"
            :show-file-list="false"
            :before-upload="handleBeforeUpload"
            :on-success="handleUrlSuccess"
        >
          <img style="width: 200px; height: 100px; border: 1px solid #e9e9e9;" v-if="ruleForm.url" :src="ruleForm.url" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
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
    const route = useRoute()
    const state = reactive({
      uploadImgServer,
      token: localGet('token') || '',
      visible: false,
      labelLevel: 1,
      parentId: 0,
      createuser:1,
      ruleForm: {
        name: '',
        rank: '',
        url: '',
      },
      rules: {
        url: [
          {  trigger: ['change'] }
        ],
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
      axios.get(`/admin/label/${id}`).then(res => {
        state.ruleForm = {
          url: res.labelicon,
          name: res.labelname,
          rank: res.labelrank,

        }
        state.parentid = res.parentid
        state.laballevel = res.labellevel
        state.createuser = res.createuser
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
        const { labelLevel = 1, parentId = 0, createuser = 1 } = route.query
        state.ruleForm = {
          name: '',
          rank: '',
          url: '',
        }
        state.parentid = parentId
        state.labelLevel = labelLevel
        state.createuser = createuser
      }
    }
    // 关闭弹窗
    const close = () => {
      state.visible = false
    }
    const handleClose = () => {
      formRef.value.resetFields()
    }

    const handleBeforeUpload = (file) => {
      const sufix = file.name.split('.')[1] || ''
      if (!['jpg', 'jpeg', 'png'].includes(sufix)) {
        ElMessage.error('请上传 jpg、jpeg、png 格式的图片')
        return false
      }
    }
    // 上传图片
    const handleUrlSuccess = (val) => {
      state.ruleForm.url = val.data || ''
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
            axios.post('/admin/label', {
              labellevel: state.labelLevel,
              parentid: state.parentid,
              labelname: state.ruleForm.name,
              labelrank: state.ruleForm.rank,
              createuser: state.createuser,
              labelicon: state.ruleForm.url
            }).then(() => {
              ElMessage.success('添加成功')
              state.visible = false
              if (props.reload) props.reload()
            })
          } else {
            axios.put('/admin/label', {
              labelid: state.id,
              labellevel: state.labelLevel,
              parentid: state.parentid,
              labelname: state.ruleForm.name,
              labelrank: state.ruleForm.rank,
              createuser: state.createuser,
              labelicon: state.ruleForm.url
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
      handleClose,
      handleBeforeUpload,
      handleUrlSuccess
    }
  }
}
</script>