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
    name: "BTC (Mar-25)",
    contractAddress:
      "CADMRI2PVLB5R3BSBNBZI4PEXONFMZGKFAU7OY2O473GZPY6SV7464NI",
    tokenAddress: "CADAHE4LOYB76PEJ7YCYSE3NH6JBRLKHINU4HLKMCH4ML7C4YP3OHDXO",
    tokenDecimals: 7,
    tokenSymbol: "USDC",
    shareId: "CCCK4DDNLSCQNG3NHFNPTKB2WW7IU7ILUGU7R6252FAE3UWVQFY4SRVV",
    shareDecimals: 7,
    shareSymbol: "VST",
    apy: "0.0%",
    // expiration: "27, Sept 2024",
    underlying: "BTC Futures and Spot",
    img: BTCBgLogo,
    ticker: "BTC",
    reserves: "0",
    minimum: "100",
    symbolFuture:"BTCUSD_250328"
  },
  {
    name: "ETH (Mar-25)",
    contractAddress:
      "CCV2MP2RVBMPMLBXM2OIQF5BSITESI26GVKURS5R37LQLRUUA5HHH3YQ",
    tokenAddress: "CADAHE4LOYB76PEJ7YCYSE3NH6JBRLKHINU4HLKMCH4ML7C4YP3OHDXO",
    tokenDecimals: 7,
    tokenSymbol: "USDC",
    shareId: "CAGJRVECNL3E4TGVEJUKT5EZYT6HH6MPAA6LOZC25YR3LHU7RFZUSEMN",
    shareDecimals: 7,
    shareSymbol: "VST",
    apy: "0.0%",
    // expiration: "27, Sept 2024",
    underlying: "Ethereum Futures and Spot",
    img: EthBgWhiteLogo,
    ticker: "ETH",
    reserves: "0",
    minimum: "10",
            symbolFuture:"ETHUSD_250328"
  },
  {
    name: "BTC (Dec-24)",
    contractAddress:
      "CA33KFPD7NMDJUSILB2QFNVOTX3JKHFFUESRMJYJYU2YOTD7NWQLD37C",
    tokenAddress: "CADAHE4LOYB76PEJ7YCYSE3NH6JBRLKHINU4HLKMCH4ML7C4YP3OHDXO",
    tokenDecimals: 7,
    tokenSymbol: "USDC",
    shareId: "CCVNQ3QQIU5DG545S5XRJU77BZAZDLEDJA43R4K2SDGNFWF5K4ZFTEYZ",
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
      "CCBYIAVAAOXQEXEZQTUOKZ4Q6Y3R2OW6ZIMC4UDWGN43XIMYGCYFI6GW",
    tokenAddress: "CADAHE4LOYB76PEJ7YCYSE3NH6JBRLKHINU4HLKMCH4ML7C4YP3OHDXO",
    tokenDecimals: 7,
    tokenSymbol: "USDC",
    shareId: "CDJERRZSNVEWMHCY4XTVTN6LEM2Y2ZW2ZBSJ5TNE4E722LTMIKYZWFO2",
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
