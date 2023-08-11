const Layout = () => import('@/layout/index.vue')

export default {
  name: 'UserCenter',
  path: '/user-center',
  component: Layout,
  redirect: '/user-center',
  meta: {
    title: '个人中心',
    customIcon: 'userCenter',
    order: 4,
  },
  children: [
    {
      name: 'User-Center',
      path: 'index',
      component: () => import('./index.vue'),
      meta: {
        title: '个人中心',
        customIcon: 'userCenter',
        keepAlive: true,
      },
    },
  ],
}
