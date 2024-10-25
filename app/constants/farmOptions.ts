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
    name: "BTC (Mar-25)",
    contractAddress:
      "CA5LZL3PZO7C6PT573OBXM6SAGSY6VYQCEOFBE7SR2ICXPQHMSN24GFU",
      shareId: "CCCK4DDNLSCQNG3NHFNPTKB2WW7IU7ILUGU7R6252FAE3UWVQFY4SRVV",
      poolId: 0,
    shareDecimals: 7
  },
  {
    name: "ETH (Mar-25)",
    contractAddress:
      "CDJWJDGV6C2SXJGTRYM42ESXOEUCJU4VEPAGQJ6VKWCQMOLRCAYGPPBS",
      shareId: "CAGJRVECNL3E4TGVEJUKT5EZYT6HH6MPAA6LOZC25YR3LHU7RFZUSEMN",
      poolId: 0,
      shareDecimals: 7
  },
  {
    name: "BTC (Dec-24)",
    contractAddress:
      "CAVOHJEK5ZM4H25722UKN5ZIZX32FGS6GVIWSVJVUSDJDEHE6HHGR7QN",
      shareId: "CCVNQ3QQIU5DG545S5XRJU77BZAZDLEDJA43R4K2SDGNFWF5K4ZFTEYZ",
      poolId: 0,
      shareDecimals: 7
  },
  {
    name: "ETH (Dec-24)",
    contractAddress:
      "CBRJNGMRZVJVWMJQ3QGZSZYYG24PSLMSH2QXSMEPQ5YZ7Y2R4VINHQYG",
      shareId: "CDJERRZSNVEWMHCY4XTVTN6LEM2Y2ZW2ZBSJ5TNE4E722LTMIKYZWFO2",
      poolId: 0,
      shareDecimals: 7
  },
  ];
