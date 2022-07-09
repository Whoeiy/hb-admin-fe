<template>
  <div class="add">
    <el-card class="add-container">
      <el-form :model="vendorForm" :rules="rules" ref="vendorRef" label-width="150px" class="vendorForm">
        <el-form-item label="优惠券名称" prop="couponname">
          <el-input style="width: 300px" v-model="vendorForm.couponname" placeholder="请输入优惠劵名称"></el-input>
        </el-form-item>
        <el-form-item required label="优惠券类型">
          <el-select v-model="vendorForm.coupontype" @change="handleChange" >
            <el-option
                label="活动优惠券"
                v-bind:value="1"


            >
            </el-option>
            <el-option
                label="普通优惠券"
                v-bind:value="2"

            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="优惠券价格" prop="couponprice">
          <el-input style="width: 300px" v-model="vendorForm.couponprice" placeholder="请输入优惠劵价格"></el-input>
        </el-form-item>
        <el-form-item  required label="生效日期" prop="starttime">
          <el-input v-model="vendorForm.starttime"  type="date" placeholder="开始"  format="yyyy-MM-dd" style="width:150px" />
        </el-form-item>
        <el-form-item required  label="失效日期" prop="endtime">
          <el-input v-model="vendorForm.endtime"  type="date" placeholder="结束" format="yyyy-MM-dd"  style="width:150px" />
        </el-form-item>
        <el-form-item  label="排序" prop="showRank">
          <el-input min="0" style="width: 300px" v-model.number="vendorForm.showrank" placeholder="请输入商家排序"></el-input>
        </el-form-item>
        <el-form-item label="是否显示" prop="isshown">
          <el-radio-group v-model="vendorForm.isshown">
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
import axios from '@/utils/axios'
import { ElMessage } from 'element-plus'
import { useRoute, useRouter } from 'vue-router'
import { localGet, uploadImgServer, hasEmoji } from '@/utils'
export default {
  name: 'AddCoupon',
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
      vendorForm: {
        couponname: '',
        couponprice: '',
        coupontype: '1',
        showrank: 0,
        isshown: '1',
        starttime:'',
        endtime:'',

      },
      rules: {
        couponname: [
          { required: 'true', message: '请填写优惠劵名称', trigger: ['change'] },
          { max: 16, message: '长度需小于16个字符', trigger: 'blur'}
        ],

        couponprice: [
          { required: 'true', message: '优惠券价格必须为数字值',trigger: ["change"]}
        ],
        showrank: [
          { required: 'true',type: 'number', message: '排序必须为数字值',trigger: ["change"]}
        ],
        coupontype: [
          { required: 'true', message: '请选择类型',trigger: ["change"]}
        ],
      },

    })

    onMounted(() => {
      if (id) {
        axios.get(`/admin/coupon/${id}`).then(res => {
          state.vendorForm.couponname = res.couponname
          state.vendorForm.coupontype = res.coupontype
          state.vendorForm.couponprice = res.couponprice
          state.vendorForm.starttime = res.starttime
          state.vendorForm.endtime = res.endtime
          state.vendorForm.showrank = res.showrank
          state.vendorForm.isshown = String(res.isshown)
          console.log(state.vendorForm)
        })
      }
    })

    const submitAdd = () => {
      vendorRef.value.validate((vaild) => {
        if (vaild) {
          // 默认新增用 post 方法
          let httpOption = axios.post
          let params = {
            couponid: state.vendorForm.couponid,
            couponname: state.vendorForm.couponname,
            coupontype: state.vendorForm.coupontype,
            couponprice: state.vendorForm.couponprice,
            starttime: state.vendorForm.starttime,
            endtime: state.vendorForm.endtime,
            showrank: state.vendorForm.showrank,
            isshown: state.vendorForm.isshown,
          }
          if  (hasEmoji(params.couponname)) {
            ElMessage.error('不要输入表情包')
            return
          }
          console.log('params', params)
          if (id) {
            params.couponid = id
            // 修改商品使用 put 方法
            httpOption = axios.put
          }
          httpOption('admin/coupon', params).then(() => {
            ElMessage.success(id ? '修改成功' : '添加成功')
            router.push({ path: '/coupon' })
          })
        }
      })
    }


    const handleChange = (val) => {
      if (val=="1") {
        this.vendorForm.coupontype = "1";
      }
      else{ this.vendorForm.coupontype = "2";}
    }

    const handleStatus = (id, status) => {
      axios.put(`admin/coupon/showStatus?couponId=${id}&showStatus=${status}`, {
        ids: id ? [id] : []
      }).then(() => {
        ElMessage.success('修改成功')
        getVendorList()
      })
    }
    const resetForm = () => {
      vendorRef.value.resetFields();
    }
    return {
      ...toRefs(state),
      vendorRef,
      submitAdd,
      handleChange,
      handleStatus,
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
