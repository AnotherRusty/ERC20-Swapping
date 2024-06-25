import 'dotenv/config'

export const privateKey = process.env.PRIVATE_KEY!
export const apiKey = process.env.ETHER_SCAN_API_KEY!
export const alchemyKey = process.env.ALCHEMY_KEY!

export const swapRouterAddresses = {
  bsctest: '0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506',
  sepolia: '0x86dcd3293C53Cf8EFd7303B57beb2a3F671dDE98',
}

export const usdtAddress = {
  bsctest: '0x7ef95a0fee0dd31b22626fa2e10ee6a223f8a684',
  sepolia: '0x7169D38820dfd117C3FA1f22a697dBA58d90BA06',
}

export const rpcURL = {
  bsctest: `https://data-seed-prebsc-1-s1.bnbchain.org:8545`,
  sepolia: `https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`,
}

export const chainId = {
  bsctest: 97,
  sepolia: 11155111
}