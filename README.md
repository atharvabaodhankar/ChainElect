# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

Steps to Run : 
In MetaMask:
Add a new network with these settings:
Network Name: Hardhat Local
New RPC URL: http://127.0.0.1:8545
Chain ID: 31337
Currency Symbol: ETH
Switch to this network in MetaMask
1) npm run dev
2) cd ChainElectBackend > npx nodemon server.js
3) npx hardhat compile
4) npx hardhat node
5) npx hardhat run scripts/deploy.js --network localhost 