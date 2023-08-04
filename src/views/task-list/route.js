const Layout = () => import('@/layout/index.vue')

export default {
  name: 'TaskList',
  path: '/task-list',
  component: Layout,
  redirect: '/task-list',
  meta: {
    title: '任务列表',
    customIcon: 'taskList',
    order: 3,
  },
  children: [
    {
      name: 'TaskIndex',
      path: 'index',
      component: () => import('./index.vue'),
      meta: {
        title: '任务列表',
        customIcon: 'taskList',
        keepAlive: true,
      },
    },
    {
      name: 'TaskDetail',
      path: 'detail/:id',
      component: () => import('./detail.vue'),
      isHidden: true,
      meta: {
        title: '任务详情',
        customIcon: 'taskDetail',
        keepAlive: true,
      },
    },
  ],
}
