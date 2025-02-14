export function localGet (key) {
  const value = window.localStorage.getItem(key)
  try {
    return JSON.parse(window.localStorage.getItem(key))
  } catch (error) {
    return value
  }
}

export function localSet (key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

export function localRemove (key) {
  window.localStorage.removeItem(key)
}

// 判断内容是否含有表情字符，现有数据库不支持。
export function hasEmoji (str = '') {
  const reg = /[^\u0020-\u007E\u00A0-\u00BE\u2E80-\uA4CF\uF900-\uFAFF\uFE30-\uFE4F\uFF00-\uFFEF\u0080-\u009F\u2000-\u201f\u2026\u2022\u20ac\r\n]/g;
  return str.match(reg) && str.match(reg).length
}

// 单张图片上传
export const uploadImgServer = '/api/admin/upload/file'
// 多张图片上传
export const uploadImgsServer = '/api/admin/upload/files'

export const pathMap = {
  login: '登录',
  introduce: '系统介绍',
  dashboard: '大盘数据',
  add: '添加商品',
  swiper: '轮播图配置',
  hot: '热销礼物配置',
  new: '新品上线配置',
  recommend: '为你推荐配置',
  category: '分类管理',
  level2: '分类二级管理',
  level3: '分类三级管理',
  label:'标签管理',
  labelLevel2: '标签二级管理',
  labelLevel3: '标签三级管理',
  good: '礼物管理',
  order: '订单管理',
  order_detail: '订单详情',
  coupon:'优惠券管理',
  activity:'活动管理',
  account: '修改账户',
  vendor: '商家管理',
  addVendor: '添加商家',
  addCoupon:'优惠券管理',
  addActivity:'添加活动信息',
  giftcustom:'定制服务管理',
  addGiftCustom:'添加服务'

}