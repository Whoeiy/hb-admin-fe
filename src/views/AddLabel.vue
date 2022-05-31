<template>
  <div class="add">
    <el-card class="add-container">
      <el-form :model="goodForm" :rules="rules" ref="goodRef" label-width="150px" class="goodForm">
        <el-form-item label="商品标签" prop="label">
          <el-input type="text" v-model="ruleForm.label"></el-input>
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
  name: 'AddLabel',
  setup() {
    const { proxy } = getCurrentInstance()
    console.log('proxy', proxy)
    const editor = ref(null)
    const goodRef = ref(null)
    const route = useRoute()
    const router = useRouter()
    const { id } = route.query
    const state = reactive({
      uploadImgServer,
      token: localGet('token') || '',
      id: id,
      defaultCate: '',
      labelForm: {

       labelName: '',
        labelRank: '0',

      },
      rules: {
        labelName: [
          { required: 'true', message: '请填写标签中文名称', trigger: ['change'] },
          { max: 16, message: '长度需小于16个字符', trigger: 'blur'}
        ],

        labelRank: [
          { type: 'number', message: '排序必须为数字值'}
        ],
      },

      category: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level = 0, value } = node
          axios.get('/categories', {
            params: {
              pageNumber: 1,
              pageSize: 1000,
              categoryLevel: level + 1,
              parentId: value || 0
            }
          }).then(res => {
            const list = res.list
            const nodes = list.map(item => ({
              value: item.categoryId,
              label: item.categoryName,
              leaf: level > 1
            }))
            resolve(nodes)
          })
        }
      }
    })
    let instance
    onMounted(() => {
      instance = new WangEditor(editor.value)
      instance.config.showLinkImg = false
      instance.config.showLinkImgAlt = false
      instance.config.showLinkImgHref = false
      instance.config.uploadImgMaxSize = 2 * 1024 * 1024 // 2M
      instance.config.uploadFileName = 'file'
      instance.config.uploadImgHeaders = {
        token: state.token
      }
      // 图片返回格式不同，需要自定义返回格式
      instance.config.uploadImgHooks = {
        // 图片上传并返回了结果，想要自己把图片插入到编辑器中
        // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
        customInsert: function(insertImgFn, result) {
          console.log('result', result)
          // result 即服务端返回的接口
          // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
          if (result.data && result.data.length) {
            result.data.forEach(item => insertImgFn(item))
          }
        }
      }
      instance.config.uploadImgServer = uploadImgsServer
      Object.assign(instance.config, {
        onchange() {
          console.log('change')
        },
      })
      instance.create()
      if (id) {
        axios.get(`/goods/${id}`).then(res => {
          const { goods, firstCategory, secondCategory, thirdCategory } = res
          state.goodForm = {
            goodsName: goods.goodsName,
            goodsIntro: goods.goodsIntro,
            originalPrice: goods.originalPrice,
            sellingPrice: goods.sellingPrice,
            stockNum: goods.stockNum,
            goodsSellStatus: String(goods.goodsSellStatus),
            goodsCoverImg: proxy.$filters.prefix(goods.goodsCoverImg),
            tag: goods.tag,
            categoryId: goods.goodsCategoryId
          }
          state.categoryId = goods.goodsCategoryId
          state.defaultCate = `${firstCategory.categoryName}/${secondCategory.categoryName}/${thirdCategory.categoryName}`
          if (instance) {
            // 初始化商品详情 html
            instance.txt.html(goods.goodsDetailContent)
          }
        })
      }
    })
    onBeforeUnmount(() => {
      instance.destroy()
      instance = null
    })
    const submitAdd = () => {
      goodRef.value.validate((vaild) => {
        if (vaild) {
          // 默认新增用 post 方法
          let httpOption = axios.post
          let params = {
            goodsCategoryId: state.categoryId,
            goodsCoverImg: state.goodForm.goodsCoverImg,
            goodsDetailContent: instance.txt.html(),
            goodsIntro: state.goodForm.goodsIntro,
            goodsName: state.goodForm.goodsName,
            goodsSellStatus: state.goodForm.goodsSellStatus,
            originalPrice: state.goodForm.originalPrice,
            sellingPrice: state.goodForm.sellingPrice,
            stockNum: state.goodForm.stockNum,
            tag: state.goodForm.tag
          }
          if (hasEmoji(params.goodsIntro) || hasEmoji(params.goodsName) || hasEmoji(params.tag) || hasEmoji(params.goodsDetailContent)) {
            ElMessage.error('不要输入表情包，再输入就打死你个龟孙儿~')
            return
          }
          if (params.goodsIntro.length > 300) {
            ElMessage.error('商家简介不能超过300个字符')
            return
          }
          console.log('params', params)
          if (id) {
            params.goodsId = id
            // 修改商品使用 put 方法
            httpOption = axios.put
          }
          httpOption('/goods', params).then(() => {
            ElMessage.success(id ? '修改成功' : '添加成功')
            router.push({ path: '/good' })
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
      state.goodForm.goodsCoverImg = val.data || ''
    }
    const handleChangeCate = (val) => {
      state.categoryId = val[2] || 0
    }
    const resetForm = () => {
      //console.log(this);
      //this.$ref.goodRef.resetFields();
      goodRef.value.resetFields();
    }
    return {
      ...toRefs(state),
      goodRef,
      submitAdd,
      handleBeforeUpload,
      handleUrlSuccess,
      editor,
      handleChangeCate,
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
