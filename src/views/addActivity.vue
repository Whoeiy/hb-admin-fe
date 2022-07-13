<template>
  <div class="add">
    <el-card class="add-container">
      <el-form :model="vendorForm" :rules="rules" ref="vendorRef" label-width="150px" class="vendorForm">
        <el-form-item label="活动名称" prop="activityname">
          <el-input style="width: 300px" v-model="vendorForm.activityname" placeholder="请输入活动名称"></el-input>
        </el-form-item>
        <el-form-item required label="活动类型">
          <el-select v-model="vendorForm.activitytype" @change="handleChange" >
            <el-option
                label="有奖活动"
                v-bind:value="1"
            >
            </el-option>
            <el-option
                label="主题活动"
                v-bind:value="2"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动海报图" prop="posterurl">
          <el-upload
              class="avatar-uploader"
              :action="uploadImgServer"
              accept="jpg,jpeg,png"
              :headers="{
              token: token,
            }"
              :show-file-list="false"
              :before-upload="handleBeforeUpload"
              :on-success="handleUrlSuccess"
          >
            <img
                style="width: 100px; height: 100px; border: 1px solid #e9e9e9"
                v-if="vendorForm.posterurl"
                :src="vendorForm.posterurl"
                class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="活动奖品" >
          <el-cascader
              :placeholder="请选择奖品"
              style="width: 300px"
              :props="coupon"
              @change="handleChangeCoupon"
          ></el-cascader>
<!--          <el-form-item label="选择优惠券">-->
<!--            <el-select v-model="value" placeholder="请选择">-->
<!--              <el-option-->
<!--                  v-for="item in options"-->
<!--                  :key="item.couponid"-->
<!--                  :label="item.couponname"-->
<!--                  :value="item.couponid">-->
<!--              </el-option>-->

        </el-form-item>
        <el-form-item label="活动细节" prop="activitydetail">
          <el-input style="width: 500px;" v-model="vendorForm.activitydetail" placeholder="请输入活动细节"></el-input>
        </el-form-item>
        <el-form-item  required label="生效日期" prop="starttime">
          <el-input v-model="vendorForm.starttime"  type="date" placeholder="开始"  format="yyyy-MM-dd" style="width:150px" />
        </el-form-item>
        <el-form-item required  label="失效日期" prop="endtime">
          <el-input v-model="vendorForm.endtime"  type="date" placeholder="结束" format="yyyy-MM-dd"  style="width:150px" />
        </el-form-item>
        <el-form-item  label="排序" prop="showRank">
          <el-input min="0" style="width: 300px" v-model.number="vendorForm.showrank" placeholder="请输入活动排序"></el-input>
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
  name: 'AddActivity' +
      '',
  setup() {
    const {proxy} = getCurrentInstance()
    console.log('proxy', proxy)
    const editor = ref(null)
    const vendorRef = ref(null)
    const route = useRoute()
    const router = useRouter()
    const {id} = route.query
    const state = reactive({
      uploadImgServer,
      token: localGet('token') || '',
      id: id,
      vendorForm: {
        activityname: '',
        posterurl: '',
        activitytype: '',
        activitystatus:'0',
        showrank: 0,
        isshown: '1',
        starttime: '',
        endtime: '',

      },
      rules: {
        activityname: [
          {required: 'true', message: '请填写活动名称', trigger: ['change']},
          {max: 16, message: '长度需小于16个字符', trigger: 'blur'}
        ],
        showrank: [
          {required: 'true', type: 'number', message: '排序必须为数字值', trigger: ["change"]}
        ],
        posterurl:[
          {required: 'true', message: '请上传活动海报', trigger: ['change']},
        ],
        activitytype: [
          {required: 'true', message: '请选择类型', trigger: ["change"]}
        ],
        activitydetail: [
          {required: 'true', message: '请输入活动详情', trigger: ["change"]}
        ],
      },
      couponid: "",
      coupon: {
        lazy: true,
        lazyLoad(node, resolve) {
          const {  level = 0, value } = node;
          axios
              .get("/admin/coupon", {
                params: {
                  currentPage: 1,
                  pageSize: 10,
                },
              })
              .then((res) => {
                const list = res.list;
                // const level=0;
                const nodes = list.map((item) => ({
                  value: item.couponid,
                  label: item.couponname,
                  leaf: level,
                }));
                resolve(nodes);
              });
        },
      },



    })

    onMounted(() => {
      if (id) {
        axios.get(`/admin/activity/${id}`).then(res => {
          state.vendorForm.activityname = res.activityname
          state.vendorForm.activitytype = String(res.activitytype)
          state.vendorForm.activitydetail = res.activitydetail
          // state.vendorForm.activitystatus = res.activitystatus
          state.vendorForm.starttime = res.starttime
          state.vendorForm.endtime = res.endtime
          state.vendorForm.showrank = res.showrank
          state.vendorForm.isshown = String(res.isshown)
          state.couponid= res.couponid
          state.vendorForm.posterurl= res.posterurl
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
            activityid: state.vendorForm.activityid,
            activityname: state.vendorForm.activityname,
            activitytype: state.vendorForm.activitytype,
            activitydetail: state.vendorForm.activitydetail,
            activitystatus: state.vendorForm.activitystatus,
            starttime: state.vendorForm.starttime,
            endtime: state.vendorForm.endtime,
            showrank: state.vendorForm.showrank,
            isshown: state.vendorForm.isshown,
            posterurl: state.vendorForm.posterurl,
            couponid:state.couponid[0],
          }
          if (hasEmoji(params.activityname)) {
            ElMessage.error('不要输入表情包')
            return
          }
          console.log('params', params)
          if (id) {
            params.activityid = id
            // 修改商品使用 put 方法
            httpOption = axios.put
          }
          httpOption('admin/activity', params).then(() => {
            ElMessage.success(id ? '修改成功' : '添加成功')
            router.push({path: '/activity'})
          })
        }
      })
    }

    const handleChange = (val) => {
      if (val == "1") {
        this.vendorForm.activityntype = "1";
      }
      else {
        this.vendorForm.activitytype = "2";
      }

}
    const handleStatus = (id, status) => {
      axios.put(`admin/coupon/showStatus?activityId=${id}&showstatus=${status}`, {
        ids: id ? [id] : []
      }).then(() => {
        ElMessage.success('修改成功')
        getVendorList()
      })
    }
    const resetForm = () => {
      vendorRef.value.resetFields();
    }
    const handleBeforeUpload = (file) => {
      const sufix = file.name.split(".")[1] || "";
      if (!["jpg", "jpeg", "png"].includes(sufix)) {
        ElMessage.error("请上传 jpg、jpeg、png 格式的图片");
        return false;
      }
    };
    const handleChangeCoupon = (val) => {
      state.couponid = val;
      console.log(val);
    };

    const handleUrlSuccess = (val) => {
      state.vendorForm.posterurl = val.data || "";
    };
    return {
      ...toRefs(state),
      vendorRef,
      submitAdd,
      handleChange,
      handleStatus,
      handleChangeCoupon,
      editor,
      resetForm,
      handleBeforeUpload,
      handleUrlSuccess,
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
