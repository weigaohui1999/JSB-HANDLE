const Layout = () => import('@/layout/index.vue')

export default {
  name: 'TaskList',
  path: '/',
  component: Layout,
  redirect: '/task-list',
  meta: {
    title: '任务列表',
    customIcon: 'taskList',
    order: 1,
  },
  children: [
    {
      name: 'TaskIndex',
      path: 'task-list',
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
