import { createApp } from 'vue'
import { ElButton, ElContainer, ElAside, ElHeader, ElMain, ElFooter, ElMenu, ElSubmenu, ElMenuItemGroup, ElMenuItem, ElForm, ElFormItem, ElInput, ElPopover, ElTag, ElCard, ElTable, ElTableColumn, ElPagination, ElDialog, ElPopconfirm, ElUpload, ElLoading, ElSelect, ElOption, ElRadioGroup, ElRadio, ElCascader, ElCheckbox, ElInputNumber } from 'element-plus'
import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";
import App from './App.vue'
import router from './router/index'

// 修改后的主题样式必须放在最后面
import '../theme/index.css'


const orderStatus = {
  0: '待支付',
  1: '已支付',
  2: '定制中',
  3: '定制完成',
  4: '出库成功',
  5: '交易成功',
  6: '手动关闭',
  7: '用户取消'
}

const app = createApp(App)
// 全局过滤器
app.config.globalProperties.$filters = {
  orderMap(status) {
    return orderStatus[status] || '未知状态'
  },
  prefix(url) {
    if (url && url.startsWith('http')) {
      return url
    } else {
      url = `http://101.133.131.175:8081/upload/${url}`
      return url
    }
  },
  resetImgUrl(imgObj, imgSrc, maxErrorNum) {  
    if (maxErrorNum > 0) { 
      imgObj.onerror = function() {  
        resetImgUrl(imgObj, imgSrc, maxErrorNum - 1) 
      }
      setTimeout(function() {  
        imgObj.src = imgSrc  
      }, 500)
    } else {  
      imgObj.onerror = null  
      imgObj.src = imgSrc
    }  
  }  
}

app.use(router)

app.use(ElButton)
    .use(ElContainer)
    .use(ElAside)
    .use(ElHeader)
    .use(ElMain)
    .use(ElFooter)
    .use(ElMenu)
    .use(ElSubmenu)
    .use(ElMenuItemGroup)
    .use(ElMenuItem)
    .use(ElForm)
    .use(ElFormItem)
    .use(ElInput)
    .use(ElPopover)
    .use(ElTag)
    .use(ElCard)
    .use(ElTable)
    .use(ElTableColumn)
    .use(ElPagination)
    .use(ElDialog)
    .use(ElPopconfirm)
    .use(ElUpload)
    .use(ElLoading)
    .use(ElSelect)
    .use(ElOption)
    .use(ElRadioGroup)
    .use(ElRadio)
    .use(ElCascader)
    .use(ElCheckbox)
    .use(ElInputNumber)

    Sentry.init({
      dsn: "https://0d9ad9a4f4ef4da69866d510241f17b8@o1261393.ingest.sentry.io/6439069",
      integrations: [new Integrations.BrowserTracing()],
    
      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,
    });

app.mount('#app')