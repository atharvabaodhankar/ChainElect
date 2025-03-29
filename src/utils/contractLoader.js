/**
 * Contract Loader Utility
 * 
 * This utility safely loads contract artifacts at runtime instead of importing them directly.
 * This approach is more compatible with various build systems including Vite.
 */

// Function to dynamically load the contract artifacts
export async function loadContractArtifacts() {
  try {
    // Fetch the contract JSON from the public directory
    const response = await fetch('/contracts/MyContract.json');
    
    if (!response.ok) {
      throw new Error(`Failed to load contract: ${response.status} ${response.statusText}`);
    }
    
    const contractJson = await response.json();
    return contractJson;
  } catch (error) {
    console.error('Error loading contract artifacts:', error);
    throw error;
  }
}

export default {
  loadContractArtifacts
}; 