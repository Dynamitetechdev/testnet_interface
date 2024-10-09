import { BTCBgLogo, EthBgWhiteLogo } from "../components/assets";

// Define the Pool type
export interface Pool {
  name: string;
  contractAddress: string;
  tokenAddress: string;
  tokenDecimals: number;
  tokenSymbol: string;
  shareId: string;
  shareDecimals: number;
  shareSymbol: string;
  apy: string;
  expiration: string;
  underlying: string;
  img: any;
  ticker: string;
  reserves: string;
  minimum: string;
}

// Define the pool options
export const pool: any= [
  {
    name: "BTC (Sept-24)",
    contractAddress:
      "CAMZJUTVWLCE5EAXYR6IVBKUPNSKJOPJRT2GEE4446KFWS2THB7FXN4B",
    tokenAddress: "CBCJHCJMDD6SLD3K4HEUHNILUQBPXQFZ6XAIWHBS7GPQEHV3YXDOW3UK",
    tokenDecimals: 7,
    tokenSymbol: "USDC",
    shareId: "CCWACECEVXX4UHAL6TAR4A3HXWE36ZNG3OPDFMMSME743IPYXSBWHS5J",
    shareDecimals: 7,
    shareSymbol: "VST",
    apy: "0.0%",
    // expiration: "27, Sept 2024",
    underlying: "BTC Futures and Spot",
    img: BTCBgLogo,
    ticker: "BTC",
    reserves: "0",
    minimum: "100",
          symbolFuture:"BTCUSD_240827"
  },
  {
    name: "ETH (Sept-24)",
    contractAddress:
      "CBT547XSS6S57B7QIIHGDQPBAI44OHVENESLWXMKA2K2WX6DXVKEBFGC",
    tokenAddress: "CBCJHCJMDD6SLD3K4HEUHNILUQBPXQFZ6XAIWHBS7GPQEHV3YXDOW3UK",
    tokenDecimals: 7,
    tokenSymbol: "USDC",
    shareId: "CBLZDMKCUY2VLY5EA5NZA5MJVUQZOITNJNDZ24ZDVEGUSKIDIF54XB7M",
    shareDecimals: 7,
    shareSymbol: "VST",
    apy: "0.0%",
    // expiration: "27, Sept 2024",
    underlying: "Ethereum Futures and Spot",
    img: EthBgWhiteLogo,
    ticker: "ETH",
    reserves: "0",
    minimum: "10",
            symbolFuture:"ETHUSD_240827"
  },
  {
    name: "BTC (Dec-24)",
    contractAddress:
      "CB6JAUESIAFIV37XNFXTKAYDKWYQIXTARPGVPJSFFBYHALOW5XARVKLV",
    tokenAddress: "CBCJHCJMDD6SLD3K4HEUHNILUQBPXQFZ6XAIWHBS7GPQEHV3YXDOW3UK",
    tokenDecimals: 7,
    tokenSymbol: "USDC",
    shareId: "CDRLWR7SAFMCZGHAKUNROJYS3KN5U76KF45KWIRGKTMZCAWGVEODPIY6",
    shareDecimals: 7,
    shareSymbol: "VST",
    apy: "0.0%",
    // expiration: "27, Dec 2024",
    underlying: "BTC Futures and Spot",
    img: BTCBgLogo,
    ticker: "BTC",
    reserves: "0",
    minimum: "100",
    symbolFuture:"BTCUSD_241227"
  },
  {
    name: "ETH (Dec-24)",
    contractAddress:
      "CCE3IYMBUCGXKFMENSHRXBZR5L3VDG7LRLM2SWVC26O3B5UGVNYSMOWO",
    tokenAddress: "CBCJHCJMDD6SLD3K4HEUHNILUQBPXQFZ6XAIWHBS7GPQEHV3YXDOW3UK",
    tokenDecimals: 7,
    tokenSymbol: "USDC",
    shareId: "CC2V6XQJNE6UWHUPOSK6GDV5MUICAHNJHI42JZ23F43CPKDC3S4CBMED",
    shareDecimals: 7,
    shareSymbol: "VST",
    apy: "0.0%",
    // expiration: "27, Dec 2024",
    underlying: "Ethereum Futures and Spot",
    img: EthBgWhiteLogo,
    ticker: "ETH",
    reserves: "0",
    minimum: "10",
    symbolFuture:"ETHUSD_241227"
  },
  ];
