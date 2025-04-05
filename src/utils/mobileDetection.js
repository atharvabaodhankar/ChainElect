/**
 * Utility functions for mobile detection and MetaMask browser checks
 */

/**
 * Detects if the user is on a mobile device
 * @returns {boolean} true if mobile device, false otherwise
 */
export const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Checks if the browser is the MetaMask mobile browser
 * @returns {boolean} true if MetaMask mobile browser, false otherwise
 */
export const isMetaMaskBrowser = () => {
  return window.ethereum && window.ethereum.isMetaMask && isMobile();
};

/**
 * Opens MetaMask mobile app with the current website URL
 */
export const openInMetaMask = () => {
  // Get the current URL to pass to MetaMask
  const currentUrl = window.location.href;
  
  // Create the MetaMask deep link
  const metamaskAppLink = `https://metamask.app.link/dapp/${currentUrl.replace(/^https?:\/\//, '')}`;
  
  // Open the MetaMask app
  window.location.href = metamaskAppLink;
}; 