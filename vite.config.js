import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, existsSync } from 'fs'

// Copy contract artifacts to public directory during build
const contractSourcePath = resolve(__dirname, 'artifacts/contracts/MyContract.sol/MyContract.json')
const contractDestDir = resolve(__dirname, 'public/contracts')
const contractDestPath = resolve(contractDestDir, 'MyContract.json')

// Create directory if it doesn't exist
if (!existsSync(contractDestDir)) {
  mkdirSync(contractDestDir, { recursive: true })
}

// Copy the contract file
if (existsSync(contractSourcePath)) {
  copyFileSync(contractSourcePath, contractDestPath)
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      external: [
        '@walletconnect/web3-provider',
        'qrcode.react'
      ]
    },
  },
  publicDir: 'public',
})
