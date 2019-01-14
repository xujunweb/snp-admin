import Main from '@/view/main'
import parentView from '@/components/parent-view'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: '_home',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true,
      access:[1,2,3],
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon:'md-home',
        },
        component: () => import('@/view/single-page/home')
      },
      {
        path: '/home/plugManage_page/:id',
        name: 'plugManage_page',
        meta: {
          icon: 'md-person',
          title: '文章详情'
        },
        component: () => import('@/view/plugManage/plugManage.vue')
      }
    ]
  },
  {
    path: '/article',
    name: 'article',
    meta: {
      hide: true,
    },
    component: Main,
    children: [
      {
        path: 'article_page',
        name: 'article_page',
        meta: {
          icon: 'ios-paper',
          title: '文章审核'
        },
        component: () => import('@/view/article/article.vue')
      }
    ]
  },
  {
    path: '/Jsonconfig',
    name: 'Jsonconfig',
    meta: {
      hide: true,
    },
    component: Main,
    children: [
      {
        path: 'Jsonconfig_page',
        name: 'Jsonconfig_page',
        meta: {
          icon: 'md-menu',
          title: '机构审核'
        },
        component: () => import('@/view/Jsonconfig/Jsonconfig.vue')
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/404.vue')
  }
]
