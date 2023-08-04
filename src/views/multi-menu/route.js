const Layout = () => import('@/layout/index.vue')

export default {
  name: 'MultipleMenu',
  path: '/multi-menu',
  component: Layout,
  isHidden: true,
  meta: {
    title: '多级菜单',
    icon: 'ic:baseline-menu',
    role: [],

    order: 4,
  },
  children: [
    {
      name: 'a-1',
      path: 'multiple-menu',
      component: () => import('./a-1/index.vue'),
      meta: {
        title: 'a-1',
        icon: 'ic:baseline-menu',
        role: [],
      },
      children: [
        {
          name: 'a-1-1',
          path: 'a-1-1',
          component: () => import('./a-1/a-1-1/index.vue'),
          meta: {
            title: 'a-1-1',
            icon: 'ic:baseline-menu',
            role: [],
          },
        },
        {
          name: 'a-1-2',
          path: 'a-1-2',
          component: () => import('./a-1/a-1-2/index.vue'),
          meta: {
            title: 'a-1-2',
            icon: 'ic:baseline-menu',
            role: [],
          },
        },
      ],
    },
    {
      name: 'a-2',
      path: 'a-2',
      component: () => import('./a-2/index.vue'),
      meta: {
        title: 'a-2',
        icon: 'ic:baseline-menu',
        role: [],
      },
      children: [
        {
          name: 'a-2-1',
          path: 'a-2-1',
          component: () => import('./a-2/a-2-1/index.vue'),
          meta: {
            title: 'a-2-1（单个子菜单）',
            icon: 'ic:baseline-menu',
            role: [],
          },
        },
      ],
    },
  ],
}
