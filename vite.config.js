import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const groqApiKey = env.GROQ_API_KEY

  return {
    plugins: [react()],
    base: '/',
    server: {
      port: 3000,
      open: true,
      proxy: {
        '/api/nvidia': {
          target: 'https://api.groq.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/nvidia/, '/openai'),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (groqApiKey) {
                proxyReq.setHeader('Authorization', `Bearer ${groqApiKey}`)
              }
            })
          }
        }
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom']
          }
        }
      }
    }
  }
})
