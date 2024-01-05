import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // CHo phép vite sử dụng process.env, nếu không thì sẽ sử dụng import.meta.env của vite
  define: {
    'process.env': process.env
  },
  plugins: [react(), svgr()],
  server: {
    port: 3000
  },
  css: {
    devSourcemap: true
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src')
    }
  }
});
