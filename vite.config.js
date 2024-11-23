import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createFilter } from '@rollup/pluginutils';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'strip-use-client',
      enforce: 'post',
      transform(code, id) {
        const filter = createFilter(['**/*.js']);
        if (filter(id)) {
          return code.replace(/["']use client["'];/g, '');
        }
        return null;
      },
    },
  ],
  ssr: {
    noExternal: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
  },
  
});
