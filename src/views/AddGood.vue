<template>
  <div class="add">
    <el-card class="add-container">
      <el-form
        :model="giftForm"
        :rules="rules"
        ref="giftRef"
        label-width="100px"
        class="giftForm"
      >
        <el-form-item required label="礼物分类">
          <el-cascader
            :placeholder="defaultCate"
            style="width: 300px"
            :props="category"
            @change="handleChangeCate"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="礼物名称" prop="giftName">
          <el-input
            style="width: 300px"
            v-model="giftForm.giftName"
            placeholder="请输入礼物名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="礼物简介" prop="giftIntro">
          <el-input
            style="width: 300px"
            type="textarea"
            v-model="giftForm.giftIntro"
            placeholder="请输入礼物简介(100字)"
          ></el-input>
        </el-form-item>
        <el-form-item label="礼物价格" prop="originalPrice">
          <el-input
            type="number"
            min="0"
            style="width: 300px"
            v-model="giftForm.originalPrice"
            placeholder="请输入礼物价格"
          ></el-input>
        </el-form-item>
        <el-form-item label="礼物会员价" prop="vipPrice">
          <el-input
            type="number"
            min="0"
            style="width: 300px"
            v-model="giftForm.vipPrice"
            placeholder="请输入礼物售价"
          ></el-input>
        </el-form-item>
        <el-form-item label="礼物库存" prop="stockNum">
          <el-input
            type="number"
            min="0"
            style="width: 300px"
            v-model="giftForm.stockNum"
            placeholder="请输入礼物库存"
          ></el-input>
        </el-form-item>
        <el-form-item label="礼物标签">
          <el-cascader
            :placeholder="defaultLabel"
            style="width: 300px"
            :props="label"
            @change="handleChangeLabel"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="上架状态" prop="isShown">
          <el-radio-group v-model="giftForm.isShown">
            <el-radio label="0">上架</el-radio>
            <el-radio label="1">下架</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="礼物主图" prop="imgUrl">
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
              v-if="giftForm.imgUrl"
              :src="giftForm.imgUrl"
              class="avatar"
            />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="详情内容">
          <div ref="editor"></div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitAdd()">{{
            id ? "立即修改" : "立即创建"
          }}</el-button>
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
import WangEditor from "wangeditor";
import axios from "@/utils/axios";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import { localGet, uploadImgServer, uploadImgsServer, hasEmoji } from "@/utils";
export default {
  name: "AddGood",
  setup() {
    const { proxy } = getCurrentInstance();
    console.log("proxy", proxy);
    const editor = ref(null);
    const giftRef = ref(null);
    const route = useRoute();
    const router = useRouter();
    const { id } = route.query;
    const state = reactive({
      uploadImgServer,
      token: localGet("token") || "",
      id: id,
      defaultCate: "",
      defaultLabel: "",
      giftForm: {
        giftName: "",
        giftIntro: "",
        originalPrice: "",
        vipPrice: "",
        stockNum: "",
        isShown: "0",
        imgUrl: "",
      },
      vendorId: "",
      rules: {
        // imgUrl: [
        //   { required: 'true', message: '请上传主图', trigger: ['change'] }
        // ],
        giftName: [
          { required: "true", message: "请填写礼物名称", trigger: ["change"] },
        ],
        originalPrice: [
          { required: "true", message: "请填写礼物价格", trigger: ["change"] },
        ],
        vipPrice: [
          { required: "true", message: "请填写礼物售价", trigger: ["change"] },
        ],
        stockNum: [
          { required: "true", message: "请填写礼物库存", trigger: ["change"] },
        ],
      },
      categoryid: "",
      category: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level = 0, value } = node;
          axios
            .get("/admin/categories/level", {
              params: {
                currentPage: 1,
                pageSize: 10,
                categoryLevel: level + 1,
                parentId: value || 0,
              },
            })
            .then((res) => {
              const list = res.list;
              const nodes = list.map((item) => ({
                value: item.categoryid,
                label: item.categoryname,
                leaf: level > 1,
              }));
              resolve(nodes);
            });
        },
      },
      labelid: "",
      label: {
        lazy: true,
        lazyLoad(node, resolve) {
          const { level = 0, value } = node;
          axios
            .get("/admin/label/labelLevel", {
              params: {
                currentPage: 1,
                pageSize: 10,
                labelLevel: level + 1,
                parentId: value || 0,
              },
            })
            .then((res) => {
              const list = res.list;
              const nodes = list.map((item) => ({
                value: item.labelid,
                label: item.labelname,
                leaf: level > 1,
              }));
              resolve(nodes);
            });
        },
      },
    });
    let instance;
    onMounted(() => {
      instance = new WangEditor(editor.value);
      instance.config.showLinkImg = false;
      instance.config.showLinkImgAlt = false;
      instance.config.showLinkImgHref = false;
      instance.config.uploadImgMaxSize = 2 * 1024 * 1024; // 2M
      instance.config.uploadFileName = "file";
      instance.config.uploadImgHeaders = {
        token: state.token,
      };
      // 图片返回格式不同，需要自定义返回格式
      instance.config.uploadImgHooks = {
        // 图片上传并返回了结果，想要自己把图片插入到编辑器中
        // 例如服务器端返回的不是 { errno: 0, data: [...] } 这种格式，可使用 customInsert
        customInsert: function (insertImgFn, result) {
          console.log("result", result);
          // result 即服务端返回的接口
          // insertImgFn 可把图片插入到编辑器，传入图片 src ，执行函数即可
          if (result.data && result.data.length) {
            result.data = [result.data];
            result.data.forEach((item) => insertImgFn(item));
          }
        },
      };
      instance.config.uploadImgServer = uploadImgsServer;
      Object.assign(instance.config, {
        onchange() {
          console.log("change");
        },
      });
      instance.create();
      if (id) {
        axios.get(`/admin/gift/${id}`).then((res) => {
          const { gift, categories, labels } = res;
          // console.log(res);
          console.log(categories);
          console.log(labels[0]);
          state.giftForm = {
            giftName: gift.giftName,
            giftIntro: gift.giftIntro,
            originalPrice: gift.originalPrice,
            vipPrice: gift.vipPrice,
            stockNum: gift.stockNum,
            isShown: String(gift.isShown),
            imgUrl: proxy.$filters.prefix(gift.imgUrl),
            //categoryid: categories.categoryid,
            //labelid: labels[0].labelid
          };
          //state.categoryid = categories.categoryid
          //console.log(state.categoryid)
         //state.labelid = labels[0].labelid
          state.defaultCate = `${categories[0].categoryname}/${categories[1].categoryname}/${categories[2].categoryname}`
          state.defaultLabel = `${labels[0][0].labelname}/${labels[0][1].labelname}/${labels[0][2].labelname}`
          if (instance) {
            // 初始化礼物详情 html
            instance.txt.html(gift.giftDetail);
          }
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
    onBeforeUnmount(() => {
      instance.destroy();
      instance = null;
    });
    const submitAdd = () => {
      giftRef.value.validate((vaild) => {
        if (vaild) {
          // 默认新增用 post 方法
          let httpOption = axios.post;
          let params = {
            giftId: state.giftForm.giftId,
            giftName: state.giftForm.giftName,
            giftIntro: state.giftForm.giftIntro,
            originalPrice: state.giftForm.originalPrice,
            vipPrice: state.giftForm.vipPrice,
            stockNum: state.giftForm.stockNum,
            giftThirdCategoryId: state.categoryid,
            giftLabelIdList: `${state.labelid}`,
            isShown: state.giftForm.isShown,
            imgUrl: state.giftForm.imgUrl,
            giftDetail: instance.txt.html(),
            vendorId: state.vendorId,
          };
          if (
            hasEmoji(params.giftIntro) ||
            hasEmoji(params.giftName) ||
            hasEmoji(params.giftDetail)
          ) {
            ElMessage.error("不要输入表情包，再输入就打死你个龟孙儿~");
            return;
          }
          if (params.giftName.length > 30) {
            ElMessage.error("礼物名称不能超过30个字符");
            return;
          }
          if (params.giftIntro.length > 100) {
            ElMessage.error("礼物简介不能超过100个字符");
            return;
          }
          console.log("params", params);
          if (id) {
            params.giftId = id;
            // 修改礼物使用 put 方法
            httpOption = axios.put;
          }
          httpOption("/admin/gift", params).then(() => {
            ElMessage.success(id ? "修改成功" : "添加成功");
            router.push({ path: "/good" });
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
      state.giftForm.imgUrl = val.data || "";
    };
    const handleChangeCate = (val) => {
      state.categoryid = val[2] || 0;
      console.log(val);
    };

    const handleChangeLabel = (val) => {
      state.labelid = val[2] || 0;
      console.log(val);
    };
    return {
      ...toRefs(state),
      giftRef,
      submitAdd,
      handleBeforeUpload,
      handleUrlSuccess,
      editor,
      handleChangeCate,
      handleChangeLabel,
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
