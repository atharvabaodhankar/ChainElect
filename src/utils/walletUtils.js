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
  // Base URL of the current page
  const currentUrl = window.location.href;
  const hostname = window.location.host;
  const pathname = window.location.pathname;
  
  // iOS devices use different deep linking format
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  
  // Universal linking format with fallbacks
  if (isIOS) {
    // iOS format with fallback chain
    return {
      primary: `https://metamask.app.link/dapp/${hostname}${pathname}`,
      fallback: `metamask://browse/${hostname}${pathname}`
    };
  } else {
    // Android and others
    return {
      primary: `https://metamask.app.link/dapp/${hostname}${pathname}`,
      fallback: `intent://browse#Intent;scheme=metamask;package=io.metamask;end`
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

// Enhanced deep link to MetaMask mobile app with redirection memory
export const openMetaMaskMobile = () => {
  // Save the fact that we attempted a redirect
  saveRedirectAttempt();
  
  const deepLinks = getMetaMaskDeepLink();
  
  // First try the primary deep link
  window.location.href = deepLinks.primary;
  
  // Set a timer to try the fallback if primary fails
  const fallbackTimer = setTimeout(() => {
    window.location.href = deepLinks.fallback;
    
    // Final fallback: if nothing works, redirect to MetaMask download page
    const downloadTimer = setTimeout(() => {
      window.open('https://metamask.io/download/', '_blank');
    }, 1500);
    
    return () => clearTimeout(downloadTimer);
  }, 1500);
  
  return () => clearTimeout(fallbackTimer);
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
    // Handle specific error codes differently on mobile
    if (switchError.code === 4902) {
      try {
        // For mobile devices, we may need different parameters
        const params = isIOSDevice() 
          ? [{ 
              chainId,
              ...networkDetails,
              // iOS sometimes needs rpcUrls as a string not array
              rpcUrls: typeof networkDetails.rpcUrls === 'object' ? networkDetails.rpcUrls[0] : networkDetails.rpcUrls
            }]
          : [{ 
              chainId,
              ...networkDetails
            }];
            
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params
        });
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