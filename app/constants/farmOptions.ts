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
      "CAV43OINFW6GP7NFTVK3EVMRAIKM3C7QR6F3OV42HLUKFXKIQJ52344D",
      shareId: "CCCK4DDNLSCQNG3NHFNPTKB2WW7IU7ILUGU7R6252FAE3UWVQFY4SRVV",
      poolId: 0,
    shareDecimals: 7
  },
  {
    name: "ETH (Mar-25)",
    contractAddress:
      "CDPE26ISC7B7X427P7PP2ROKUNCW3OF2BSN7NBJPJDMKPR6RLJ6NYZ64",
      shareId: "CAGJRVECNL3E4TGVEJUKT5EZYT6HH6MPAA6LOZC25YR3LHU7RFZUSEMN",
      poolId: 0,
      shareDecimals: 7
  },
  {
    name: "BTC (Dec-24)",
    contractAddress:
      "CC5TUFXBG7ZSAW3TB3O4E7NHD7P4S4ZJOR4XVFG44M4V7MKQPTLA6VBD",
      shareId: "CCVNQ3QQIU5DG545S5XRJU77BZAZDLEDJA43R4K2SDGNFWF5K4ZFTEYZ",
      poolId: 0,
      shareDecimals: 7
  },
  {
    name: "ETH (Dec-24)",
    contractAddress:
      "CBWQBXSQVWVM5BEYAM7O2LYTK6KZCMPTN6TVED4YPBCCJHSESHES5TQ2",
      shareId: "CDJERRZSNVEWMHCY4XTVTN6LEM2Y2ZW2ZBSJ5TNE4E722LTMIKYZWFO2",
      poolId: 0,
      shareDecimals: 7
  },
  ];
