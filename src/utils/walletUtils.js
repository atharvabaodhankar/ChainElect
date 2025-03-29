/**
 * Comprehensive utility functions for wallet connections with strong mobile support
 */

// Enhanced mobile detection that checks for various indicators
export const isMobileDevice = () => {
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.innerWidth <= 768) ||
    ('ontouchstart' in window) ||
    (navigator.maxTouchPoints > 0)
  );
};

// Check if browsing within MetaMask's mobile in-app browser
export const isMetaMaskBrowser = () => {
  const isMobile = isMobileDevice();
  const isMMBrowser = window.ethereum?.isMetaMask && navigator.userAgent.includes('MetaMask');
  return isMobile && isMMBrowser;
};

// Get the correct deep linking format for the current environment
export const getMetaMaskDeepLink = () => {
  // Get current URL components
  const url = window.location.href;
  const encodedUrl = encodeURIComponent(url);
  
  // iOS devices use different deep linking format
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  // Universal linking formats - using direct URL approach
  if (isIOS) {
    // iOS direct link using universal link
    return {
      primary: `https://metamask.app.link/dapp/${window.location.host}${window.location.pathname}`,
      fallback: `metamask://dapp/${window.location.host}${window.location.pathname}`
    };
  } else {
    // Android direct intent with fallback
    return {
      primary: `https://metamask.app.link/dapp/${window.location.host}${window.location.pathname}`, 
      fallback: `metamask://dapp/${window.location.host}${window.location.pathname}`
    };
  }
};

// Proper check for any available ethereum provider
export const hasEthereumProvider = () => {
  return typeof window.ethereum !== 'undefined';
};

// Session storage keys
const STORAGE_KEYS = {
  REDIRECT_ATTEMPTED: 'chainelect_metamask_redirect_attempted',
  WALLET_STATE: 'chainelect_wallet_state'
};

// Remember that we attempted to redirect to MetaMask
export const saveRedirectAttempt = () => {
  try {
    sessionStorage.setItem(STORAGE_KEYS.REDIRECT_ATTEMPTED, 'true');
    sessionStorage.setItem(STORAGE_KEYS.WALLET_STATE, JSON.stringify({
      timestamp: Date.now(),
      path: window.location.pathname
    }));
  } catch (e) {
    console.error('Error saving redirect state:', e);
  }
};

// Check if we previously attempted a redirect
export const wasRedirectAttempted = () => {
  try {
    return sessionStorage.getItem(STORAGE_KEYS.REDIRECT_ATTEMPTED) === 'true';
  } catch (e) {
    return false;
  }
};

// Clear the redirect attempt flag
export const clearRedirectAttempt = () => {
  try {
    sessionStorage.removeItem(STORAGE_KEYS.REDIRECT_ATTEMPTED);
  } catch (e) {
    console.error('Error clearing redirect state:', e);
  }
};

// Deep link to MetaMask mobile app with improved handling
export const openMetaMaskMobile = () => {
  // Save current page state
  saveRedirectAttempt();
  
  const deepLinks = getMetaMaskDeepLink();
  console.log("Opening MetaMask with:", deepLinks);
  
  // For iOS, window.location tends to work better than window.open
  const isIOS = isIOSDevice();
  
  if (isIOS) {
    // iOS needs direct location change
    window.location.href = deepLinks.primary;
    
    // Fallback timer for iOS
    setTimeout(() => {
      window.location.href = deepLinks.fallback;
      
      // Final iOS fallback to app store
      setTimeout(() => {
        window.location.href = 'https://apps.apple.com/us/app/metamask/id1438144202';
      }, 2000);
    }, 1500);
  } else {
    // For Android, try opening in new window first
    const opened = window.open(deepLinks.primary, '_blank');
    
    // If window.open fails or is blocked, try direct location
    if (!opened || opened.closed || typeof opened.closed === 'undefined') {
      window.location.href = deepLinks.primary;
      
      // Android fallback
      setTimeout(() => {
        window.location.href = deepLinks.fallback;
        
        // Final Android fallback to Play Store
        setTimeout(() => {
          window.location.href = 'https://play.google.com/store/apps/details?id=io.metamask';
        }, 2000);
      }, 1500);
    }
  }
};

// Detect if a wallet provider is available
export const detectWalletProvider = () => {
  if (window.ethereum) {
    // Check for specific providers
    if (window.ethereum.isMetaMask) {
      return 'metamask';
    } else if (window.ethereum.isCoinbaseWallet) {
      return 'coinbase';
    } else if (window.ethereum.isWalletConnect) {
      return 'walletconnect';
    } else {
      return 'unknown';
    }
  }
  return null;
};

// Check connection and determine best action
export const checkWalletConnection = async () => {
  // Check if any provider exists
  if (hasEthereumProvider()) {
    try {
      // If we're in a wallet browser or have a provider, request accounts
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      return { 
        connected: accounts.length > 0,
        accounts,
        provider: window.ethereum,
        providerType: detectWalletProvider()
      };
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      return { 
        connected: false, 
        error,
        isMobile: isMobileDevice()
      };
    }
  } else if (isMobileDevice()) {
    // On mobile but no provider - need to open MetaMask app
    return { 
      connected: false, 
      isMobile: true,
      openMetaMask: openMetaMaskMobile
    };
  } else {
    // On desktop without a provider
    return { 
      connected: false,
      isMobile: false 
    };
  }
};

// Helper function to display mobile-friendly error messages
export const getMobileWalletMessage = () => {
  const isMobile = isMobileDevice();
  
  if (isMobile) {
    return "For the best experience on mobile, please use the MetaMask mobile app browser.";
  } else {
    return "Please install the MetaMask browser extension to interact with this application.";
  }
};

// Function to handle mobile styling adjustments
export const applyMobileOptimizations = () => {
  if (isMobileDevice()) {
    // Add a class to the body to apply mobile-specific styles
    document.body.classList.add('mobile-device');
    
    // Check viewport meta tag
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = document.createElement('meta');
      viewportMeta.name = 'viewport';
      document.head.appendChild(viewportMeta);
    }
    
    // Set proper viewport settings for mobile
    viewportMeta.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
  }
};

// Detect iOS specifically for better device-specific handling
export const isIOSDevice = () => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent);
};

// Detect Android specifically
export const isAndroidDevice = () => {
  return /Android/.test(navigator.userAgent);
};

// Enhanced network switching with better mobile support
export const switchToNetwork = async (chainId, networkDetails) => {
  if (!window.ethereum) {
    console.error("No Ethereum provider found");
    return { success: false, error: "No provider" };
  }
  
  try {
    // First try to switch to the network
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
    return { success: true };
  } catch (switchError) {
    console.log("Switch error:", switchError);
    
    // Handle specific error codes differently on mobile
    if (switchError.code === 4902 || switchError.message?.includes("Unrecognized chain ID")) {
      try {
        // For mobile, simplify the RPC URLs format to avoid errors
        let rpcUrls = networkDetails.rpcUrls;
        if (Array.isArray(rpcUrls) && rpcUrls.length > 0) {
          rpcUrls = rpcUrls[0];
        }
        
        // Format network params to be more mobile-friendly
        const params = [{
          chainId: chainId,
          chainName: networkDetails.chainName,
          nativeCurrency: networkDetails.nativeCurrency,
          rpcUrls: isIOSDevice() ? [rpcUrls] : networkDetails.rpcUrls,
          blockExplorerUrls: networkDetails.blockExplorerUrls
        }];
        
        console.log("Adding network with params:", JSON.stringify(params, null, 2));
        
        // Add the Ethereum chain
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params
        });
        
        // After adding, try switching again after a short delay
        setTimeout(async () => {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId }],
            });
          } catch (err) {
            console.log("Second switch attempt failed:", err);
          }
        }, 1000);
        
        return { success: true };
      } catch (addError) {
        console.error("Error adding chain:", addError);
        return { 
          success: false, 
          error: addError,
          errorType: 'add_chain',
          isMobile: isMobileDevice()
        };
      }
    } else {
      console.error("Error switching chain:", switchError);
      return { 
        success: false, 
        error: switchError,
        errorType: 'switch_chain',
        isMobile: isMobileDevice()
      };
    }
  }
}; 