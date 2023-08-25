import vue from '@vitejs/plugin-vue'

import { VitePWA } from 'vite-plugin-pwa'

/**
 * * unocss插件，原子css
 * https://github.com/antfu/unocss
 */
import Unocss from 'unocss/vite'

// rollup打包分析插件
import visualizer from 'rollup-plugin-visualizer'
// 压缩
import viteCompression from 'vite-plugin-compression'

import DefineOptions from 'unplugin-vue-define-options/vite'

import { configHtmlPlugin } from './html'
import unplugin from './unplugin'

export function createVitePlugins(viteEnv, isBuild) {
  const plugins = [
    vue(),
    DefineOptions(),
    ...unplugin,
    configHtmlPlugin(viteEnv, isBuild),
    Unocss(),
  ]

  if (viteEnv.VITE_USE_COMPRESS) {
    plugins.push(viteCompression({ algorithm: viteEnv.VITE_COMPRESS_TYPE || 'gzip' }))
  }

  if (isBuild) {
    plugins.push(
      visualizer({
        open: true,
        gzipSize: true,
        brotliSize: true,
      }),
      VitePWA({
        manifest: {
          name: '吉顺办中台',
          short_name: 'MyApp',
          theme_color: '#ffffff',
          icons: [
            //添加图标， 注意路径和图像像素正确
            {
              src: 'icon-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'icon-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
        registerType: 'autoUpdate',
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg}'], //缓存相关静态资源
          runtimeCaching: [
            {
              //由于要测试第三方API， 这里配置缓存访问第三方API的资源
              handler: 'CacheFirst',
              urlPattern: /^https:\/\/jsonplaceholder/, //注意，要修改成要测试的API。请使用正则表达式匹配
              method: 'GET',
              options: {
                cacheName: 'test-external-api', //创建缓存名称
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // <== 365 days
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
      })
    )
  }

  return plugins
}
