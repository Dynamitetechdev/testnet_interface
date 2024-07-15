// import {
//     Contract,
//     SorobanRpc,
//     TransactionBuilder,
//     Networks,
//     BASE_FEE,
//     nativeToScVal,
//     Address,
//     xdr,
//     Memo,
//     MemoType,
//     Operation,
//     scValToNative,
//     TimeoutInfinite,
//     Transaction,
// } from "@stellar/stellar-sdk";
// import { userSignTransaction } from './freighter';
// import { getPublicKey } from '@stellar/freighter-api';
// import { getTxBuilder } from "@/app/helpers/soroban";

// const rpcUrl = "https://horizon.stellar.org"
// const contractAddress = 'CDFAPYA7SOZQFPAPOYGCCAEN3S7RFWHJ5HSLH2PHEY5ZN5G7LQECCABG';

// const stringToSymbol = (value: string) => {
//     return nativeToScVal(value, { type: "symbol" });
// };

// const accountToScVal = (account: string) => new Address(account).toScVal();

// export const stringToI128 = (value: string): xdr.ScVal =>
//     nativeToScVal(value, { type: "i128" });

// const params = {
//     fee: BASE_FEE,
//     networkPassphrase: Networks.PUBLIC
// };
// // const provider = new SorobanRpc.Server(rpcUrl, { allowHttp: true });
// // async function contractInt(caller: string, functName: string, values: xdr.ScVal[] | null) {

// //     const contract = new Contract(contractAddress);
// //     const sourceAccount = await provider.getAccount(caller);

// //     let buildTx;
// //     if (values === null) {
// //         buildTx = new TransactionBuilder(sourceAccount, params)
// //             .addOperation(contract.call(functName))
// //             .setTimeout(30)
// //             .build();
// //     } else {
// //         buildTx = new TransactionBuilder(sourceAccount, params)
// //             .addOperation(contract.call(functName, ...values))
// //             .setTimeout(30)
// //             .build();
// //     }

// //     try {
// //        const result = await simulateTx(buildTx, provider)
// //        return result
// //     } catch (error) {
// //         console.error(error)
// //     }

// // }

// export const simulateTx = async <ArgType>(
//     tx: Transaction<Memo<MemoType>, Operation[]>,
//     server: SorobanRpc.Server,
//   ): Promise<ArgType> => {
//     const response = await server.simulateTransaction(tx);
  
//     if (
//       SorobanRpc.Api.isSimulationSuccess(response) &&
//       response.result !== undefined
//     ) {
//       return scValToNative(response.result.retval);
//     }
  
//     throw new Error("cannot simulate transaction");
//   };
// async function fetchBalance(addr: any) {
//     const caller = await getPublicKey();
//     // const result = await contractInt(caller, 'balance', [accountToScVal(caller)]);
// }

// // const getQuoteCont = async (
// //     id: string,
// //     txBuilder: TransactionBuilder,
// //     connection: any,
// //     destinationPubKey: string | null = null,
// //     functName: string
// //   ) => {
// //     const contract = new Contract(id);
// //     if (!destinationPubKey) {
// //       return false;
// //     }
// //     const tx = txBuilder
// //       .addOperation(
// //         contract.call(functName)
// //       )
// //       .setTimeout(30)
// //       .build();

// //     const result = await simulateTx<string>(tx, connection);
// //     return result;
// //   };
// //   const readContract = async (functName: string) => {
// //     const caller = await getPublicKey()
// //     const txBuilderBalance = await getTxBuilder(
// //       caller!,
// //       BASE_FEE,
// //       provider,
// //       Networks.TESTNET
// //     );

// //     const result: any = await getQuoteCont(selectedPool.contractAddress, txBuilderBalance, provider, connectorWalletAddress, functName);
// //     console.log({[functName]: result});
// //     return result
// //   }

// async function contractInt(provider:any, contractAddress: any, caller: any, functName: string, values: any) {
//   const contract = new Contract(contractAddress);
//   const sourceAccount = await provider.getAccount(caller);
//   console.log("contractAddress",{contractAddress, caller, functName, values})
//   console.log("contractAddress IS GOOOOOO")
//   let buildTx;
//   if (values == null) {
//       buildTx = new TransactionBuilder(sourceAccount, params)
//       .addOperation(contract.call(functName))
//       .setTimeout(30).build();
//   }
//   else {
//       buildTx = new TransactionBuilder(sourceAccount, params)
//       .addOperation(contract.call(functName, ...[
//         accountToScVal(caller)
//       ]))
//       .setTimeout(30).build();
//   }
//   let _buildTx = await provider.prepareTransaction(buildTx);
//   let prepareTx = _buildTx.toXDR();
//   let signedTx = await userSignTransaction(prepareTx, "PUBLIC", caller);
//   let tx = TransactionBuilder.fromXDR(signedTx, Networks.PUBLIC);
//   try {
//       let sendTx = await provider.sendTransaction(tx).catch(function (err) {
//           return err;
//       });
//       if (sendTx.errorResult) {
//           throw new Error("Unable to submit transaction");
//       }
//       if (sendTx.status === "PENDING") {
//           let txResponse = await provider.getTransaction(sendTx.hash);
//           while (txResponse.status === "NOT_FOUND") {
//               txResponse = await provider.getTransaction(sendTx.hash);
//               await new Promise((resolve) => setTimeout(resolve, 100));
//           }
//           if (txResponse.status === "SUCCESS") {
//               let result = txResponse.returnValue;
//               return result;
//           }
//       }
//   } catch (err) {
//       return err;
//   }
// }


// async function fetchPoll() {
//   let caller = await getPublicKey();
//   // let result = await contractInt(caller, 'view_poll', null);
// }
// export { fetchBalance , contractInt};
