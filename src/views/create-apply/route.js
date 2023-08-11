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
      name: 'Create-Apply',
      path: 'index',
      component: () => import('./index.vue'),
      meta: {
        title: '创建流程',
        customIcon: 'createApply',
        keepAlive: true,
      },
    },
  ],
}
