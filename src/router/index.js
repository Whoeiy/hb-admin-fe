import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
  routes: [
    {
      path: '/',
      redirect: '/introduce'
    },
    {
      path: '/introduce',
      name: 'introduce',
      component: () => import(/* webpackChunkName: "introduce" */ '../views/Introduce.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
    },
    {
      path: '/add',
      name: 'add',
      component: () => import(/* webpackChunkName: "add" */ '../views/AddGood.vue')
    },
    {
      path: '/swiper',
      name: 'swiper',
      component: () => import(/* webpackChunkName: "swiper" */ '../views/Swiper.vue')
    },
    {
      path: '/hot',
      name: 'hot',
      component: () => import(/* webpackChunkName: "hot" */ '../views/IndexConfig.vue')
    },
    {
      path: '/new',
      name: 'new',
      component: () => import(/* webpackChunkName: "new" */ '../views/IndexConfig.vue')
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: () => import(/* webpackChunkName: "recommend" */ '../views/IndexConfig.vue')
    },
    {
      path: '/category',
      name: 'category',
      component: () => import(/* webpackChunkName: "category" */ '../views/Category.vue'),
      children: [
        {
          path: '/category/level2',
          name: 'level2',
          component: () => import(/* webpackChunkName: "level2" */ '../views/Category.vue'),
        },
        {
          path: '/category/level3',
          name: 'level3',
          component: () => import(/* webpackChunkName: "level3" */ '../views/Category.vue'),
        }
      ]
    },
    {
      path: '/label',
      name: 'label',
      component: () => import(/* webpackChunkName: "label" */ '../views/Label.vue'),
      children: [
        {
          path: '/label/labelLevel2',
          name: 'labelLevel2',
          component: () => import(/* webpackChunkName: "labelLevel2" */ '../views/Label.vue'),
        },
        {
          path: '/label/labelLevel3',
          name: 'labelLevel3',
          component: () => import(/* webpackChunkName: "labelLevel3" */ '../views/Label.vue'),
        }
      ]
    },

    {
      path: '/good',
      name: 'good',
      component: () => import(/* webpackChunkName: "new" */ '../views/Good.vue')
    },
    {
      path: '/order',
      name: 'order',
      component: () => import(/* webpackChunkName: "order" */ '../views/Order.vue')
    },
    {
      path: '/order_detail',
      name: 'order_detail',
      component: () => import(/* webpackChunkName: "order_detail" */ '../views/OrderDetail.vue')
    },
    {
      path: '/account',
      name: 'account',
      component: () => import(/* webpackChunkName: "account" */ '../views/Account.vue')
    },
    {
      path: '/vendor',
      name: 'vendor',
      component: () => import(/* webpackChunkName: "vendor" */ '../views/Vendor.vue')
    },
    {
      path: '/addVendor',
      name: 'addVendor',
      component: () => import(/* webpackChunkName: "vendor" */ '../views/addVendor.vue')
    },
    {
      path: '/coupon',
      name: 'coupon',
      component: () => import(/* webpackChunkName: "coupon" */ '../views/Coupon.vue')
    },
    {
      path: '/addCoupon',
      name: 'addCoupon',
      component: () => import(/* webpackChunkName: "addcoupon" */ '../views/addCoupon.vue')
    },
    {
      path: '/giftcustom',
      name: 'giftcustom',
      component: () => import(/* webpackChunkName: "vendor" */ '../views/GiftCustom.vue')
    },
    {
      path: '/addGiftCustom',
      name: 'addGiftCustom',
      component: () => import(/* webpackChunkName: "vendor" */ '../views/addGiftCustom.vue')
    },

  ]
})

export default router