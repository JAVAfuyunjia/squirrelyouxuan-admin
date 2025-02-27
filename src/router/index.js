import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },



    {
      name: 'Product',
      path: '/product',
      component: Layout,
      redirect: '/product/category/list',
      meta: { title: '商品信息管理', icon: 'dashboard' },
      alwaysShow: true,
      children: [
        {
          path: 'category/list',
          name: 'Category',
          component: () => import('@/views/product/category/list'),
          meta: { title: '商品分类' }
        },
        {
          path: 'category/add',
          name: 'CategoryAdd',
          component: () => import('@/views/product/category/form'),
          meta: { title: '添加' },
          hidden: true
        },
        {
          path: 'category/edit/:id',
          name: 'CategoryEdit',
          component: () => import('@/views/product/category/form'),
          meta: { title: '编辑', noCache: true },
          hidden: true
        },
        {
          path: 'attrGroup/list',
          name: 'AttrGroup',
          component: () => import('@/views/product/attrGroup/list'),
          meta: { title: '平台属性分组' }
        },
        {
          path: 'attrGroup/add',
          name: 'AttrGroupAdd',
          component: () => import('@/views/product/attrGroup/form'),
          meta: { title: '添加' },
          hidden: true
        },
        {
          path: 'attrGroup/edit/:id',
          name: 'AttrGroupEdit',
          component: () => import('@/views/product/attrGroup/form'),
          meta: { title: '编辑', noCache: true },
          hidden: true
        },
        {
          path: 'attr/list/:id',
          name: 'AttrList',
          component: () => import('@/views/product/attr/list'),
          meta: { title: '平台属性列表', noCache: true },
          hidden: true
        },
        {
          path: 'attr/add',
          name: 'AttrAdd',
          component: () => import('@/views/product/attr/form'),
          meta: { title: '添加' },
          hidden: true
        },
        {
          path: 'attr/edit/:id',
          name: 'AttrEdit',
          component: () => import('@/views/product/attr/form'),
          meta: { title: '编辑', noCache: true },
          hidden: true
        },
        {
          path: 'skuInfo/list',
          name: 'SkuInfo',
          component: () => import('@/views/product/skuInfo/list'),
          meta: { title: 'SKU列表' }
        },
        {
          path: 'skuInfo/add',
          name: 'SkuInfoAdd',
          component: () => import('@/views/product/skuInfo/form'),
          meta: { title: '添加' },
          hidden: true
        },
        {
          path: 'skuInfo/edit/:id',
          name: 'SkuInfoEdit',
          component: () => import('@/views/product/skuInfo/form'),
          meta: { title: '编辑', noCache: true },
          hidden: true
        }
      ]
    },
  
    {
      name: 'Order',
      path: '/order',
      component: Layout,
      redirect: '/order/orderInfo/list',
      meta: { title: '订单管理', icon: 'table' },
      alwaysShow: true,
      children: [
        {
          path: 'orderInfo/list',
          name: 'OrderInfo',
          component: () => import('@/views/order/orderInfo/list'),
          meta: { title: '订单列表' }
        },
        {
          path: 'orderInfo/show/:id',
          name: 'OrderInfoShow',
          component: () => import('@/views/order/orderInfo/show'),
          meta: { title: '查看', noCache: true },
          hidden: true
        },

      ]
    },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
