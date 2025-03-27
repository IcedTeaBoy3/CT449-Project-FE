import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';
// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src') // Định nghĩa alias @ trỏ đến thư mục src
    }
  },
  define: {
    'process.env': process.env // Đảm bảo biến môi trường được load
  }

})
