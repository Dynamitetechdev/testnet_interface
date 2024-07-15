"use client";
import Image from "next/image";
import styles from "./styles.module.scss";
import { Close, DepositSuccess, EthLogo, UsdcBgLogo, Wallet } from "../assets";
import React, { useEffect, useState } from "react";
import UseStore from "@/store/UseStore";
import {
  BASE_FEE,
  getEstimatedFee,
  getServer,
  getTxBuilder,
  mintTokens,
  simulateTx,
  submitTx,
  withdrawTokens,
} from "@/app/helpers/soroban";
import { TESTNET_DETAILS, signTx } from "@/app/helpers/network";
import { ethers } from "ethers";
import { stroopToXlm, xlmToStroop } from "@/app/helpers/format";
import { kit } from "../navigations/dAppHeader";
import { ERRORS } from "@/app/helpers/error";
import Loading from "../UI-assets/loading";
import { pool } from "@/app/constants/poolOptions";
import { Contract, TransactionBuilder } from "@stellar/stellar-sdk";
import { floatFigure, formatFigures, formatWithCommas } from "../web3FiguresHelpers";
const WithdrawFunds: React.FC<{ setOpenState: any}> = ({
  setOpenState
}) => {
  const [depositAmount, setDepositAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [withdrawalEnabled, setWihdrawalEnabled] = useState(false)
  const {
    connectorWalletAddress,
    userBalance,
    selectedNetwork: currentNetwork,
    setTransactionsStatus,
    selectedPool,
    selectedNetwork
  } = UseStore();
  const provider = getServer(selectedNetwork);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [fee, setFee] = React.useState(BASE_FEE);
  const [step, setStep] = useState(0);
  const [isGettingFee, setIsGettingFee] = useState<Boolean | null>(null);
  const contractAddress = selectedPool.contractAddress;
  const [connectionError, setConnectionError] = useState(null as string | null);
  const [openXDR, setOpenXDR] = useState(false);
  const [signedXdr, setSignedXdr] = React.useState("");
  const [txResultXDR, setTxResultXDR] = useState<String | null>(null);
  const [notEnoughBal, setNotEnoughBal] = useState(false);
  const signWithFreighter = async () => {
    setIsSubmitting(true);

    const txBuilderAdmin = await getTxBuilder(
      connectorWalletAddress,
      xlmToStroop(fee).toString(),
      provider,
      selectedNetwork.networkPassphrase
    );
    const xdr = await withdrawTokens({
      tokenId: contractAddress,
      quantity: ethers
        .parseUnits(depositAmount, selectedPool?.tokenDecimals)
        .toString(),
      destinationPubKey: connectorWalletAddress,
      memo,
      txBuilderAdmin,
      server: provider,
    });
    try {
      // Signs XDR representing the "mint" transaction
      const signedTx = await signTx(xdr, connectorWalletAddress, kit);
      setIsSubmitting(false);
      setSignedXdr(signedTx);
    } catch (e) {
      setIsSubmitting(false);
      setConnectionError(ERRORS.UNABLE_TO_SIGN_TX);
    }
  };

  //Finally submit Deposit transaction
  const submit = async () => {
    setIsSubmitting(true);

    try {
      const result = await submitTx(
        signedXdr,
        selectedNetwork.networkPassphrase,
        provider
      );

      setTxResultXDR(result);
      setTransactionsStatus({ deposit: true });
      setIsSubmitting(false);
      setStep(2);
    } catch (error) {
      setIsSubmitting(false);
      setConnectionError(ERRORS.UNABLE_TO_SUBMIT_TX);
    }
  };


  const getQuoteCont = async (
    id: string,
    txBuilder: TransactionBuilder,
    connection: any,
    destinationPubKey: string | null = null,
    functName: string
  ) => {
    const contract = new Contract(id);
    if (!destinationPubKey) {
      return false;
    }
    const tx = txBuilder
      .addOperation(
        contract.call(functName)
      )
      .setTimeout(30)
      .build();

    const result = await simulateTx<string>(tx, connection);
    return result;
  };
  const readContract = async (functName: string) => {
    const txBuilderBalance = await getTxBuilder(
      connectorWalletAddress!,
      BASE_FEE,
      provider,
      selectedNetwork.networkPassphrase
    );

    const result: any = await getQuoteCont(selectedPool.contractAddress, txBuilderBalance, provider, connectorWalletAddress, functName);
    setWihdrawalEnabled(functName === "deposit_limit" && Number(result) > 0 ? true : false)
    // console.log({[functName]: result});
    return result
  }
  // console.log({withdrawalEnabled})
  useEffect(() => {
    readContract("deposit_limit")
  })
  useEffect(() => {
    if (signedXdr) {
      submit();
    }
  }, [signedXdr]);

  useEffect(() => {
    if (isGettingFee === false && connectionError !== "error getting fee") {
      setStep(1);
      setIsGettingFee(null);
    }
  }, [isGettingFee, connectionError]);

  useEffect(() => {
    if (Number(depositAmount) > Number(selectedPool.shareBalance)) {
      setNotEnoughBal(true);
    } else {
      setNotEnoughBal(false);
    }
  }, [depositAmount, userBalance]);
  return (
    <>
      <div
        className={`fixed modal-container z-[999] w-full md:p-4 top-0 left-0 h-full flex items-center max-sm:items-end justify-center ${styles.modal}`}
      >
        <div className=" w-full mx-auto flex items-center justify-center ">
          {step === 0 && (
            <div className="modal_content relative w-[550px] max-sm:w-full pb-5 rounded-lg text-[white] border-2 border-borderColor bg-[#1B2132] p-5 max-sm:pb-16">
              <div className="header flex justify-between items-start">
                <div className="mb-6">
                  <h1 className="text-lg">My Position</h1>
                  <p className="text-paraDarkText text-sm">
                    Details of my position
                  </p>
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => setOpenState(false)}
                >
                  <Image
                    src={Close}
                    width={18}
                    height={18}
                    alt="right"
                    className=""
                  />
                </div>
              </div>
              <div className="currency_container p-3">
                <div className=" flex justify-between mb-4">
                  <p className="text-paraDarkText text-sm">Available Shares</p>
                  <p className="text-white text-sm">{formatWithCommas(Number(floatFigure(selectedPool.shareBalance,2)))}</p>
                </div>
                <div className=" flex justify-between mb-4">
                  <p className="text-paraDarkText text-sm">Estimated redemption value</p>
                  <p className="text-white text-sm">{formatWithCommas(Number(floatFigure(selectedPool.position,2)))}</p>
                </div>
              </div>
              {!withdrawalEnabled && <p className="text-sm text-bluish font-semibold mt-7">Investor can redeem post maturity {selectedPool.expiration} at 8:00 am GMT</p>}
                <div className="flex max-sm:flex-col justify-between gap-3 mt-4">
                  <button className="button1 text-paraDarkText w-1/2 max-sm:w-full py-3">Secondary Market (soon)</button>
                  <button className="button1 text-paraDarkText w-1/2 max-sm:w-full py-3">Buyback (soon)</button>
                </div>
              <button
               className={`mt-4 py-3 w-full flex ${
                Number(selectedPool.shareBalance) <= 0 || !withdrawalEnabled ? "button1 text-paraDarkText hover:bg-transparent" : "proceed"
              }`}
                onClick={() => setStep(1)}
                disabled={Number(selectedPool.shareBalance) <= 0 || !withdrawalEnabled}
              >
                  <p className="mx-auto">Proceed to Redeem</p>
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="modal_content relative w-[550px] max-sm:w-full pb-5 rounded-lg text-[white] border-2 border-borderColor bg-[#1B2132] p-5 max-sm:pb-16">
              <div className="header flex justify-between items-start">
                <div className="mb-6">
                  <h1 className="text-lg">Redeem</h1>
                  <p className="text-paraDarkText text-sm">
                    Withdraw from this strategy
                  </p>
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => setOpenState(false)}
                >
                  <Image
                    src={Close}
                    width={18}
                    height={18}
                    alt="right"
                    className=""
                  />
                </div>
              </div>
              <div className="currency_container p-3">
                <div className=" flex justify-between mb-4">
                  <p className="text-paraDarkText text-sm">Currency</p>
                  <p className="text-paraDarkText text-sm">Enter Amount</p>
                </div>

                <div className=" flex justify-between items-center mb-2">
                  <div className="token flex items-center gap-1 px-3 py-2">
                    <Image
                      src={UsdcBgLogo}
                      width={24}
                      height={24}
                      alt="right"
                      className=""
                    />
                    <h1 className="text-white text-[13px]">USDC</h1>
                  </div>
                  <div className="">
                    <input
                      type="tel"
                      id="success"
                      className="bg-transparent  outline-none rounded-r-lg  block text-[34px] text-right max-w-[250px]"
                      placeholder={selectedPool.shareBalance}
                      name="depositAmount"
                      value={depositAmount}
                      onChange={(e: any) => setDepositAmount(e.target.value)}
                    />
                  </div>
                  {/* <h1 className="text-[34px]">23,123</h1> */}
                </div>

                <div className="balance flex justify-between">
                  <div className="flex items-center gap-1 ">
                    <Image
                      src={Wallet}
                      width={17}
                      height={17}
                      alt="right"
                      className=""
                    />
                    <p className="text-[14px] text-paraDarkText">
                      Avail. Shares:
                    </p>
                    <h2 className="text-[14px] text-white">${selectedPool.shareBalance}</h2>
                  </div>
                  {/* <h2 className="text-[14px] text-paraDarkText">$23,123</h2> */}
                </div>
              </div>
              {notEnoughBal && (
                <div className="mt-3">
                  <p className="text-red-500 cursor-pointer">
                    The Amount you entered is larger than your balance. Try a
                    lower anount
                  </p>
                </div>
              )}
              <button
                className={`mt-7 py-3 w-full flex ${
                  notEnoughBal || Number(selectedPool.shareBalance) <= 0 ? "button1 text-paraDarkText" : "proceed"
                }`}
                // onClick={() => {
                //   !isGettingFee &&  submit();
                // }}
                onClick={signWithFreighter}
                disabled={notEnoughBal || Number(selectedPool.shareBalance) <= 0}
              >
                {isSubmitting ? (
                  <div className="mx-auto">
                    <Loading />
                  </div>
                ) : (
                  <p className="mx-auto">Withdraw</p>
                )}
              </button>
            </div>
          )}
          {step === 2 && txResultXDR && (
            <div className="modal_content relative w-[550px] max-sm:w-full pb-5 rounded-lg text-[white] border-2 border-borderColor bg-[#1B2132] p-5 max-sm:pb-16 px-16">
              {/* <div className="header flex justify-between items-start">
                <div className="mb-6">
                  <h1 className="text-lg">Deposit Transaction Settings</h1>
                  <p className="text-paraDarkText text-sm">
                    Adjust Estimate Fee and Add memo for transaction (optional)
                  </p>
                </div>
                <div
                  className="cursor-pointer"
                  onClick={() => setOpenState(false)}
                >
                  <Image
                    src={Close}
                    width={18}
                    height={18}
                    alt="right"
                    className=""
                  />
                </div>
              </div> */}
              <div className="">
                <Image
                  src={DepositSuccess}
                  width={108}
                  height={108}
                  alt="right"
                  className="mx-auto"
                />
                <h1 className="text-center text-3xl mb-5 text-gold">
                  Withdrawal Successful
                </h1>
                <div className=" flex justify-between mb-4 items-center">
                  <h1 className="text-paraDarkText">Network</h1>
                  <h1 className="text-1xl text-paraDarkText">
                    {selectedNetwork.network}
                  </h1>
                </div>
                <div className=" flex justify-between mb-4 items-center">
                  <h1 className="text-paraDarkText">Burned Bonds</h1>
                  <h1 className="text-1xl">{depositAmount}</h1>
                </div>
                <div className=" flex justify-between mb-4 items-center">
                  <h1 className="text-paraDarkText">Memo</h1>
                  <h1 className="text-1xl">{memo}</h1>
                </div>
                <div className="mt-5 ">
                  <p
                    className="underline text-sm text-paraDarkText cursor-pointer"
                    onClick={() => setOpenXDR(!openXDR)}
                  >
                    View Signed Transaction XDR
                  </p>
                  {openXDR && (
                    <p className="w-[200px break-words bg-dappHeaderBg border-border_pri border rounded-md text-sm p-5 mt-5">
                      {txResultXDR}
                    </p>
                  )}
                </div>
                <button
                  className="button2 px-14 py-2 flex justify-center mx-auto mt-10"
                  onClick={() => setOpenState(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WithdrawFunds;
