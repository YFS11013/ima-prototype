import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Map design-tokens to skeleton's copy
      '@ima-tokens': path.resolve(__dirname, '../design-tokens'),
      // Map shared-assets
      '@ima-assets': path.resolve(__dirname, '../shared-assets'),
    },
  },
  css: {
    preprocessorOptions: {
      css: {
        // Allow @import from design-tokens
      },
    },
  },
})
