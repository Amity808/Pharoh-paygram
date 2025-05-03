import { cookieStorage, createStorage } from 'wagmi'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import type { AppKitNetwork } from '@reown/appkit/networks'
import { defineChain } from 'viem'
// import { chainConfig } from 'viem/zksync'

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || "b56e18d47c72ab683b10814fe9495694" // this is a public projectId only to use on localhost

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const pharos = /*#__PURE__*/ defineChain({
  // ...chainConfig,
  id: 50002,
  name: 'Pharos Devnet',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://devnet.dplabs-internal.com'],
      webSocket: ['wss://devnet.dplabs-internal.com'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Pharos',
      url: 'https://pharosscan.xyz',
    },
    native: {
      name: 'Pharos Explorer',
      url: 'https://pharosscan.xyz',
    },
  },
  // contracts: {
  //   multicall3: {
  //     address: '0xAa4De41dba0Ca5dCBb288b7cC6b708F3aaC759E7',
  //     blockCreated: 5288,
  //   },
  //   universalSignatureVerifier: {
  //     address: '0xfB688330379976DA81eB64Fe4BF50d7401763B9C',
  //     blockCreated: 5263,
  //   },
  // },
})

export const networks = [pharos] as [AppKitNetwork, ...AppKitNetwork[]]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig

export const supportedNetworks = [pharos];
