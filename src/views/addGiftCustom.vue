<template>
  <div class="add">
    <el-card class="add-container">
      <el-form
        :model="serviceForm"
        :rules="rules"
        ref="serviceRef"
        label-width="150px"
        class="serviceForm"
      >
        <el-form-item label="服务名称" prop="servicename">
          <el-input
            style="width: 300px"
            v-model="serviceForm.servicename"
            placeholder="请输入服务名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="服务样图" prop="sampleimg">
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
              v-if="serviceForm.sampleimg"
              :src="serviceForm.sampleimg"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item required label="服务类型">
          <el-select v-model="serviceForm.servicetype" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="排序" prop="showrank">
          <el-input
            min="0"
            style="width: 300px"
            v-model.number="serviceForm.showrank"
            placeholder="请输入服务排序"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否显示" prop="isshown">
          <el-radio-group v-model="serviceForm.isshown">
            <el-radio label="1">是</el-radio>
            <el-radio label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitAdd()">{{
            id ? "立即修改" : "立即创建"
          }}</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {
  reactive,
  ref,
  toRefs,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance,
} from "vue";
import axios from "@/utils/axios";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { localGet, uploadImgServer, uploadImgsServer, hasEmoji } from "@/utils";
export default {
  name: "AddGiftCustom",
  data() {
    return {
      options: [
        {
          value: 1,
          label: "定制卡片",
        },
        {
          value: 2,
          label: "定制包装",
        },
        {
          value: 3,
          label: "定制外观",
        },
        {
          value: 4,
          label: "商家特供",
        },
      ],
      value: 1,
    };
  },
  setup() {
    const { proxy } = getCurrentInstance();
    console.log("proxy", proxy);
    const editor = ref(null);
    const serviceRef = ref(null);
    const route = useRoute();
    const router = useRouter();
    const { id } = route.query;
    const state = reactive({
      uploadImgServer,
      token: localGet("token") || "",
      id: id,
      vendorId: "",
      defaultCate: "",
      serviceForm: {
        servicename: "",
        sampleimg: "",
        servicetype: "",
        store: "",
        showrank: 0,
        isshown: "1",
      },
      rules: {
        servicename: [
          {
            required: "true",
            message: "请填写服务中文名称",
            trigger: ["change"],
          },
          { max: 20, message: "长度需小于20个字符", trigger: "blur" },
        ],
        showRank: [{ type: "number", message: "排序必须为数字值" }],
      },
    });

    onMounted(() => {
      if (id) {
        axios.get(`/admin/custom-service/${id}`).then((res) => {
          // const { vendors } = res
          state.serviceForm.servicename = res.servicename;
          state.serviceForm.sampleimg = res.sampleimg;
          state.serviceForm.servicetype = res.servicetype;
          state.serviceForm.showrank = res.showrank;
          state.serviceForm.isshown = String(res.isshown);
          // state.vendorForm.
          // state.vendorForm = {
          //   nameCn: res.nameCn,
          //   nameEn: res.nameEn,
          //   logoUrl: proxy.$filters.prefix(goods.logoUrl),
          //   store: goods.store,
          //   showRank: goods.showRank,
          //   isShown: String(goods.isShown),
          // }
          console.log(state.serviceForm);
        });
      }

      const username = window.sessionStorage.getItem("username");
      //console.log(username);
      if (username == "admin") {
        axios.get("/admin/profile").then((res) => {
          state.vendorId = res.adminID;
          //console.log(state.vendorId);
        });
      } else {
        axios.get("/admin/vendor/profile").then((res) => {
          state.vendorId = res.vendorId;
          //console.log(state.vendorId);
        });
      }
    });

    const submitAdd = () => {
      serviceRef.value.validate((vaild) => {
        if (vaild) {
          // 默认新增用 post 方法
          let httpOption = axios.post;
          let params = {
            serviceid: state.serviceForm.serviceid,
            servicename: state.serviceForm.servicename,
            sampleimg: state.serviceForm.sampleimg,
            servicetype: state.serviceForm.servicetype,
            showrank: state.serviceForm.showrank,
            isshown: parseInt(state.serviceForm.isshown),
            vendorid: state.vendorId,
          };
          console.log("params", params);
          if (id) {
            params.serviceid = id;
            // 修改礼物使用 put 方法
            httpOption = axios.put;
          }
          httpOption("admin/custom-service", params).then(() => {
            ElMessage.success(id ? "修改成功" : "添加成功");
            router.push({ path: "/giftcustom" });
          });
        }
      });
    };

    const handleBeforeUpload = (file) => {
      const sufix = file.name.split(".")[1] || "";
      if (!["jpg", "jpeg", "png"].includes(sufix)) {
        ElMessage.error("请上传 jpg、jpeg、png 格式的图片");
        return false;
      }
    };
    const handleUrlSuccess = (val) => {
      state.serviceForm.sampleimg = val.data || "";
    };

    const resetForm = () => {
      serviceRef.value.resetFields();
    };
    return {
      ...toRefs(state),
      serviceRef,
      submitAdd,
      handleBeforeUpload,
      handleUrlSuccess,
      editor,
      resetForm,
    };
  },
};
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
