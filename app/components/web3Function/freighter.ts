import {
  isConnected,
  getPublicKey,
  signAuthEntry,
  signTransaction,
  signBlob,
  setAllowed,
} from "@stellar/freighter-api";

const connectWallet = async () => {
  const isConnected = await setAllowed();
  return isConnected;
};

const userSignTransaction = async (txXdr: any, network: any, signWith: any) => {
  let signedTx = "";
  let error = "";

  try {
    signedTx = await signTransaction(txXdr, {
      network,
      accountToSign: signWith,
    });
  } catch (error) {
    console.error(error);
  }
  if (error) {
    return error;
  }
  return signedTx;
};

export { connectWallet, userSignTransaction };
