# ChainElect - Blockchain-Based Voting System

ChainElect is a secure and transparent e-voting system built on blockchain technology, combining Ethereum smart contracts with a modern web interface. The system ensures the integrity of the voting process while providing a user-friendly experience.

## 🚀 Features

- **Secure Authentication**
  - Email-based user verification
  - Metamask wallet integration
  - Profile image upload capability
  - Session management

- **Blockchain Integration**
  - Smart contract-based voting system
  - Real-time vote counting
  - Transparent vote tracking
  - Ethereum network integration

- **User Interface**
  - Modern, responsive design
  - Real-time voting status updates
  - Live countdown timer
  - Interactive candidate selection
  - Profile management

- **Security Features**
  - Email verification
  - Metamask ID validation
  - One vote per wallet address
  - Secure image storage with Supabase
  - Session-based authentication

## 🛠 Prerequisites

Before running the application, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (Node Package Manager)
- MetaMask browser extension
- Hardhat for local blockchain development
- Git

## 📦 Tech Stack

- **Frontend**
  - React.js with Vite
  - Web3.js for blockchain interaction
  - Modern CSS for styling
  
- **Backend**
  - Node.js with Express
  - Supabase for database and storage
  - Multer for file handling
  
- **Blockchain**
  - Ethereum (Hardhat local network)
  - Solidity smart contracts
  
- **Authentication**
  - Supabase Auth
  - Express sessions
  - MetaMask wallet

## 🔧 Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone [your-repository-url]
   cd ChainElect
   ```

2. **Install Dependencies**
   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd ChainElectBackend
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the ChainElectBackend directory:
   ```env
   NODE_ENV=development
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   SESSION_SECRET=your_session_secret
   ```

4. **MetaMask Configuration**
   
   Add a new network in MetaMask with these settings:
   - Network Name: Hardhat Local
   - New RPC URL: http://127.0.0.1:8545
   - Chain ID: 31337
   - Currency Symbol: ETH

## 🚀 Running the Application

1. **Start the Frontend**
   ```bash
   npm run dev
   ```

2. **Start the Backend Server**
   ```bash
   cd ChainElectBackend
   npx nodemon server.js
   ```

3. **Deploy Smart Contracts**
   ```bash
   # Compile contracts
   npx hardhat compile

   # Start local Hardhat node
   npx hardhat node

   # Deploy contracts
   npx hardhat run scripts/deploy.js --network localhost
   ```

## 🔄 Application Flow

1. **User Registration**
   - Enter voter ID, email, and password
   - Upload profile image
   - Connect MetaMask wallet
   - Verify email address

2. **Authentication**
   - Login with email and password
   - Automatic MetaMask wallet validation
   - Session management

3. **Voting Process**
   - View active election session
   - See remaining voting time
   - Cast vote for chosen candidate
   - Receive confirmation

4. **Profile Management**
   - View voter details
   - Check MetaMask balance
   - Manage session

## 👥 User Types

1. **Voters**
   - Register and authenticate
   - Cast votes
   - View profile information
   - Check voting status

2. **Admin**
   - Start/end voting sessions
   - Manage candidates
   - Monitor voting progress
   - View results

## 🔒 Security Measures

- Email verification for new registrations
- MetaMask wallet verification
- Session-based authentication
- Secure image storage
- Smart contract security
- Input validation
- Error handling


## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.


## 🔍 Additional Information

- The application uses Supabase for backend services
- Smart contracts are deployed on a local Hardhat network
- Frontend is built with React and Vite
- Supports modern browsers with MetaMask extension 