<template>
  <div class="add">
    <el-card class="add-container">
      <el-form :model="vendorForm" :rules="rules" ref="vendorRef" label-width="150px" class="vendorForm">
        <el-form-item label="商家中文名称" prop="nameCn">
          <el-input style="width: 300px" v-model="vendorForm.nameCn" placeholder="请输入商家中文名称"></el-input>
        </el-form-item>
        <el-form-item label="商家英文名称" prop="nameEn">
          <el-input style="width: 300px" v-model="vendorForm.nameEn" placeholder="请输入商家英文名称"></el-input>
        </el-form-item>
        <el-form-item label="商家logo" prop="logoUrl">
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
            <img style="width: 100px; height: 100px; border: 1px solid #e9e9e9;" v-if="vendorForm.logoUrl" :src="vendorForm.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="商家简介" prop="store">
          <el-input style="width: 300px" type="textarea" v-model="vendorForm.store" placeholder="请输入商家简介(最长300字符)"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="showRank">
          <el-input min="0" style="width: 300px" v-model.number="vendorForm.showRank" placeholder="请输入商家排序"></el-input>
        </el-form-item>
        <el-form-item label="是否显示" prop="isShown">
          <el-radio-group v-model="vendorForm.isShown">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitAdd()">{{ id ? '立即修改' : '立即创建' }}</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { reactive, ref, toRefs, onMounted, onBeforeUnmount, getCurrentInstance } from 'vue'
import WangEditor from 'wangeditor'
import axios from '@/utils/axios'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { localGet, uploadImgServer, uploadImgsServer, hasEmoji } from '@/utils'
export default {
  name: 'AddVendor',
  setup() {
    const { proxy } = getCurrentInstance()
    console.log('proxy', proxy)
    const editor = ref(null)
    const vendorRef = ref(null)
    const route = useRoute()
    const router = useRouter()
    const { id } = route.query
    const state = reactive({
      uploadImgServer,
      token: localGet('token') || '',
      id: id,
      defaultCate: '',
      vendorForm: {
        nameCn: '',
        nameEn: '',
        logoUrl: '',
        store: '',
        showRank: 0,
        isShown: '1',
      },
      rules: {
        nameCn: [
          { required: 'true', message: '请填写商家中文名称', trigger: ['change'] },
          { max: 16, message: '长度需小于16个字符', trigger: 'blur'}
        ],
        nameEn: [
          { required: 'true', message: '请填写商家英文名称', trigger: ['change'] },
          { max: 16, message: '长度需小于16个字符', trigger: 'blur'}
        ],
        showRank: [
          { type: 'number', message: '排序必须为数字值'}
        ],
      },

    })

    onMounted(() => {
      if (id) {
        axios.get(`/admin/vendor/${id}`).then(res => {
          const { vendors } = res
          state.vendorForm = {
            nameCn: vendors.nameCn,
            nameEn: vendors.nameEn,
            logoUrl: proxy.$filters.prefix(goods.logoUrl),
            store: goods.store,
            showRank: goods.showRank,
            isShown: String(goods.isShown),
          }
          console.log(res)
        })
      }
    })

    const submitAdd = () => {
      vendorRef.value.validate((vaild) => {
        if (vaild) {
          // 默认新增用 post 方法
          let httpOption = axios.post
          let params = {
            vendorId: state.vendorForm.vendorId,
            nameCn: state.vendorForm.nameCn,
            nameEn: state.vendorForm.nameEn,
            logoUrl: state.vendorForm.logoUrl,
            store: state.vendorForm.store,
            showRank: state.vendorForm.showRank,
            isShown: state.vendorForm.isShown,
          }
          if (hasEmoji(params.store) || hasEmoji(params.nameCn) || hasEmoji(params.tag)) {
            ElMessage.error('不要输入表情包，再输入就打死你个龟孙儿~')
            return
          }
          if (params.store.length > 300) {
            ElMessage.error('商家简介不能超过300个字符')
            return
          }
          console.log('params', params)
          if (id) {
            params.vendorId = id
            // 修改商品使用 put 方法
            httpOption = axios.put
          }
          httpOption('admin/vendor', params).then(() => {
            ElMessage.success(id ? '修改成功' : '添加成功')
            router.push({ path: '/vendor' })
          })
        }
      })
    }


    const handleBeforeUpload = (file) => {
      const sufix = file.name.split('.')[1] || ''
      if (!['jpg', 'jpeg', 'png'].includes(sufix)) {
        ElMessage.error('请上传 jpg、jpeg、png 格式的图片')
        return false
      }
    }
    const handleUrlSuccess = (val) => {
      state.vendorForm.logoUrl = val.data || ''
    }

    const resetForm = () => {
      vendorRef.value.resetFields();
    }
    return {
      ...toRefs(state),
      vendorRef,
      submitAdd,
      handleBeforeUpload,
      handleUrlSuccess,
      editor,
      resetForm,
    }
  }
}
</script>

<style scoped>
  .add {
    display: flex;
  }
  .add-container {
    flex: 1;
    height: 100%;
  }
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
