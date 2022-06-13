import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vitePluginImport from 'vite-plugin-babel-import';
import path from 'path'

const baseUrl = {
  development: './',
  beta: './',
  release: './'
}

// https://vitejs.dev/config/
export default ({ mode }) =>  defineConfig({
  plugins: [
    vue(),
    vitePluginImport([
      {
        libraryName: 'element-plus',
        libraryDirectory: 'es',
        style(name) {
          return `element-plus/lib/theme-chalk/${name}.css`;
        },
      }
    ])
  ],
  base: baseUrl[mode],
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './'),
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    proxy: {
      '/api': {
        // yy: 原服务器接口
        // target: 'http://backend-api-02.newbee.ltd/manage-api/v1',
        // yy: 本地接口
        // target: 'http://localhost:8080/',
        // yy: aliyun服务器接口
        // target: 'http://101.133.131.175:8080/',
        target: 'http://101.133.131.175:8081/ms',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  }
})
