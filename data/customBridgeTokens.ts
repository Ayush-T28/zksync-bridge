export type CustomBridgeToken = {
  chainId: number;
  l1Address: string;
  l2Address: string;
  symbol: string;
  name?: string;
  bridges: {
    label: string;
    iconUrl: string;
    depositUrl?: string;
    withdrawUrl?: string;
  }[];
};

export const customBridgeTokens: CustomBridgeToken[] = [
  {
    chainId: 1,
    l1Address: "0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0",
    l2Address: "0x703b52F2b28fEbcB60E1372858AF5b18849FE867",
    bridges: [
      {
        label: "txSync Bridge",
        iconUrl: "/img/txsync.png",
        depositUrl: "https://portal.txsync.io/bridge/?token=0x703b52F2b28fEbcB60E1372858AF5b18849FE867",
        withdrawUrl: "https://portal.txsync.io/bridge/withdraw/?token=0x703b52F2b28fEbcB60E1372858AF5b18849FE867",
      },
    ],
    symbol: "wstETH",
    name: "Wrapped liquid staked Ether 2.0",
  },
  {
    chainId: 1,
    l1Address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    l2Address: "0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4",
    bridges: [
      {
        label: "Symbiosis",
        iconUrl: "/img/symbiosis.svg",
        depositUrl:
          "https://app.symbiosis.finance/swap?amountIn&chainIn=Ethereum&chainOut=ZkSync%20Era&tokenIn=0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48&tokenOut=0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4",
      },
    ],
    symbol: "USDC",
    name: "USD Coin",
  },
];
