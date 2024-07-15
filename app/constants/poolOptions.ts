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
      "CA6BJ2EU2SAP5BDF423F6JNMFCJW4XE7DHH7GIXI2HILTXA6TPW2HWOU",
    tokenAddress: "CDJCX67YS7M6EOREWQ7MVVBX2CCQHOSTXF6ZQPADLEVQO26MUNABYLX2",
    tokenDecimals: 7,
    tokenSymbol: "USDC",
    shareId: "CCLAP7OSCPMO3O3JEOKFMR5GKVMVQC7Q2NOHORPXFPDZHEBAVH3EVTLH",
    shareDecimals: 7,
    shareSymbol: "VST",
    apy: "9.01%",
    expiration: "27, Sept 2024",
    underlying: "BTC Futures and Spot",
    img: BTCBgLogo,
    ticker: "BTC",
    reserves: "0",
    minimum: "100",
  },
  {
    name: "ETH (Sept-24)",
    contractAddress:
      "CDNCM2VKMXUDERGFRI7QQWSKP3ABP4V6B6LYQFI7AVCM6JCJ65FAM2N5",
    tokenAddress: "CDJCX67YS7M6EOREWQ7MVVBX2CCQHOSTXF6ZQPADLEVQO26MUNABYLX2",
    tokenDecimals: 7,
    tokenSymbol: "USDC",
    shareId: "CBXFALA7CDB5OGM2XB2AHZMDVMOTQ2VBKYZAP66BVG42M4TLGILOS3X3",
    shareDecimals: 7,
    shareSymbol: "VST",
    apy: "9.66%",
    expiration: "27, Sept 2024",
    underlying: "Ethereum Futures and Spot",
    img: EthBgWhiteLogo,
    ticker: "ETH",
    reserves: "0",
    minimum: "100",
  },
  {
    name: "BTC (Dec-24)",
    contractAddress:
      "CAWTSAIEGSH72RWXLJVO3YB67TREEIYKM5CZO5QJ5K3XAV7LMDU453BW",
    tokenAddress: "CDJCX67YS7M6EOREWQ7MVVBX2CCQHOSTXF6ZQPADLEVQO26MUNABYLX2",
    tokenDecimals: 7,
    tokenSymbol: "USDC",
    shareId: "CC7ZR2RIWYNGLFSDZERUNNXSUZJPT4SHSUXCVG3DK227DC66DA2RA6WL",
    shareDecimals: 7,
    shareSymbol: "VST",
    apy: "9.47%",
    expiration: "27, Dec 2024",
    underlying: "BTC Futures and Spot",
    img: BTCBgLogo,
    ticker: "BTC",
    reserves: "0",
    minimum: "100",
  },
  {
    name: "ETH (Dec-24)",
    contractAddress:
      "CDDBEIZLOXVHL3HIKLOKURFAOVWK2DIYQGA6CYVX4QT5SMSB6IGV3MB7",
    tokenAddress: "CDJCX67YS7M6EOREWQ7MVVBX2CCQHOSTXF6ZQPADLEVQO26MUNABYLX2",
    tokenDecimals: 7,
    tokenSymbol: "USDC",
    shareId: "CBWN7DXJYWT65K5A7ZDAHUTGZMHOIQLBBFDZ6HUJ27H2IKY2RDLAI4VT",
    shareDecimals: 7,
    shareSymbol: "VST",
    apy: "9.20%",
    expiration: "27, Dec 2024",
    underlying: "Ethereum Futures and Spot",
    img: EthBgWhiteLogo,
    ticker: "ETH",
    reserves: "0",
    minimum: "100",
  },
  ];
