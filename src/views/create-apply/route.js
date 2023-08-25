const Layout = () => import('@/layout/index.vue')

export default {
  name: 'CreateApply',
  path: '/create-apply',
  component: Layout,
  redirect: '/index',
  meta: {
    title: '创建流程',
    customIcon: 'createApply',
    order: 2,
  },
  children: [
    {
      name: 'CreateApply',
      path: 'index',
      component: () => import('./index.vue'),
      meta: {
        title: '创建流程',
        customIcon: 'createApply',
        keepAlive: true,
      },
    },
    {
      name: 'ApplyDetail',
      path: 'detail/:id',
      component: () => import('./detail.vue'),
      isHidden: true,
      meta: {
        title: '事项详情',
        customIcon: 'taskDetail',
        keepAlive: true,
      },
    },
    {
      name: 'ApplyIndex',
      path: 'apply/:id',
      component: () => import('./apply.vue'),
      isHidden: true,
      meta: {
        title: '业务申报',
        customIcon: 'createApply',
        keepAlive: true,
      },
    },
  ],
}
