// import { StellarWalletsKit } from "stellar-wallets-kit";

export interface NetworkDetails {
  network: string;
  networkUrl: string;
  networkPassphrase: string;
}

export const TESTNET_DETAILS = {
  network: "TESTNET",
  networkUrl: "https://horizon-testnet.stellar.org",
  networkPassphrase: "Test SDF Network ; September 2015",
};
export const MAINNET_DETAILS = {
  network: "PUBLIC",
  networkUrl: "https://mainnet.stellar.validationcloud.io/v1/YcyPYotN_b6-_656rpr0CabDwlGgkT42NCzPVIqcZh0",
  networkPassphrase: "Public Global Stellar Network ; September 2015",
};

export const signTx = async (
  xdr: string,
  publicKey: string,
  kit: any,
) => {
  const { signedXDR } = await kit.sign({
    xdr,
    publicKey,
  });
  return signedXDR;
};
