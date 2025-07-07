export const ERC20_ADDRESS = {
    USDC: "0x72df0bcd7276f2dfbac900d1ce63c272c4bccced",
    WPHRS: "0x76aaada469d23216be5f7c596fa25f282ff9b364",
    USDT: "0xd4071393f8716661958f766df660033b3d35fd29",
}

export const ERC20_ABI = [
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
  "function balanceOf(address owner) external view returns (uint256)"
];

export const ZENITHSWAP = {
    SWAP_ROUTER: "0x1a4de519154ae51200b0ad7c90f7fac75547888a"
}

export const ABI_multiCall = [
      "function multicall(uint256 deadline, bytes[] data)"
]

export const swapAbi = [
  "function exactInputSingle((address tokenIn,address tokenOut,uint24 fee,address recipient,uint256 amountIn,uint256 amountOutMinimum,uint160 sqrtPriceLimitX96) params)"
];

export const LIQUIDITY_POSITION_MANAGER = "0xf8a1d4ff0f9b9af7ce58e1fc1833688f3bfd6115"; // Uniswap V3 NFT position manager
export const LIQUIDITY_ABI = [
  "function mint((address token0,address token1,uint24 fee,int24 tickLower,int24 tickUpper,uint256 amount0Desired,uint256 amount1Desired,uint256 amount0Min,uint256 amount1Min,address recipient,uint256 deadline)) returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)"
];
