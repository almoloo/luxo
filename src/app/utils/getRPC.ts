/**
 * Generates the RPC network URL based on the given environment.
 *
 * @param {boolean} isTestnet - Indicates whether the network is a testnet or not.
 * @return {string} The URL of the RPC network.
 */
export const rpcNetwork = (isTestnet: boolean = false) => {
  if (isTestnet) {
    return process.env.NEXT_PUBLIC_RPC_TESTNET;
  }
  return process.env.NEXT_PUBLIC_RPC_MAINNET;
};
