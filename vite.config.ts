import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/evgeniy-tatyana/', // Укажите имя вашего репозитория здесь
  plugins: [react()],
  // ...
})
