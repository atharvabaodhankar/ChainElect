import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env variables based on mode
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      port: 5173,
    },
    define: {
      // Make env variables available to client-side code
      'process.env.VITE_CONTRACT_ADDRESS': JSON.stringify(env.VITE_CONTRACT_ADDRESS),
      'process.env.VITE_NETWORK_ID': JSON.stringify(env.VITE_NETWORK_ID),
      'process.env.VITE_NETWORK_NAME': JSON.stringify(env.VITE_NETWORK_NAME),
      'process.env.VITE_RPC_URL': JSON.stringify(env.VITE_RPC_URL),
      'process.env.VITE_BACKEND_URL': JSON.stringify(env.VITE_BACKEND_URL),
    },
    build: {
      // Generate sourcemaps for better debugging
      sourcemap: true,
      // Optimize chunk size
      chunkSizeWarningLimit: 1600,
    }
  }
})
