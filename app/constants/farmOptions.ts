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
export const farms: any= [
  {
    name: "BTC (Sept-24)",
    contractAddress:
      "CDZQWKODPYQDJPDPTML3R6RKL4IYUWLPAJ3JFIY6J3AIQ6OEJNI63S3D",
      shareId: "CCWACECEVXX4UHAL6TAR4A3HXWE36ZNG3OPDFMMSME743IPYXSBWHS5J",
      poolId: 0,
    lp: 50.90,
    shareDecimals: 7
  },
  {
    name: "ETH (Sept-24)",
    contractAddress:
      "CAS6Q7A3Q72VDWN62TDUMF5R22RIO47F2EUILSNPS2Q7YGCIVL2XCAVR",
      shareId: "CBLZDMKCUY2VLY5EA5NZA5MJVUQZOITNJNDZ24ZDVEGUSKIDIF54XB7M",
      poolId: 0,
      lp:23.98,
      shareDecimals: 7
  },
  {
    name: "BTC (Dec-24)",
    contractAddress:
      "CAD2I3BTBYU42CUDKAY4TXBL2NVP5FAD2RCEUKCJDCODTXVBQE36AV5P",
      lp:60.88,
      shareId: "CDRLWR7SAFMCZGHAKUNROJYS3KN5U76KF45KWIRGKTMZCAWGVEODPIY6",
      poolId: 0,
      shareDecimals: 7
  },
  {
    name: "ETH (Dec-24)",
    contractAddress:
      "CCLQZHAB3JMGOVB54JSWMLG6JLGJZE4LIHCYSJGMODJYUIUJBR4O2SHM",
      shareId: "CC2V6XQJNE6UWHUPOSK6GDV5MUICAHNJHI42JZ23F43CPKDC3S4CBMED",
      poolId: 0,
      lp:10.98,
      shareDecimals: 7
  },
  ];
