"use client";
import Image from "next/image";
import styles from "./styles.module.scss";
import {
  Close,
  DepositSuccess,
  EthLogo,
  LoadingImg,
  UsdcBgLogo,
  Wallet,
} from "../assets";
import React, { useEffect, useState } from "react";
import UseStore from "@/store/UseStore";
import {
  BASE_FEE,
  accountToScVal,
  depositBondToFarm,
  getEstimatedFee,
  getServer,
  getTxBuilder,
  mintTokens,
  removeBondFromFarm,
  simulateTx,
  submitTx,
} from "@/app/helpers/soroban";
import { TESTNET_DETAILS, signTx } from "@/app/helpers/network";
import { ethers } from "ethers";
import { stroopToXlm, xlmToStroop } from "@/app/helpers/format";
import { kit } from "../navigations/dAppHeader";
import { ERRORS } from "@/app/helpers/error";
import { Contract, TransactionBuilder } from "@stellar/stellar-sdk";
import { ActivateQuote } from "@/app/dataService/dataServices";
import { dateFormat, floatFigure } from "../web3FiguresHelpers";
import SpinningLoading from "../UI-assets/SpinningLoading";
const FarmWithdraw: React.FC<{ setOpenState: any }> = ({ setOpenState }) => {
  const [depositAmount, setDepositAmount] = useState("");
  const [memo, setMemo] = useState("");
  const {
    connectorWalletAddress,
    userBalance,
    selectedNetwork: currentNetwork,
    setTransactionsStatus,
    selectedPool,
    selectedFarmPool,
    selectedNetwork,
  } = UseStore();
  const provider = getServer(selectedNetwork);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [fee, setFee] = React.useState('1');
  const [step, setStep] = useState(0);
  const [isGettingFee, setIsGettingFee] = useState<Boolean | null>(null);
  const contractAddress = selectedFarmPool.contractAddress;
  const [connectionError, setConnectionError] = useState(null as string | null);
  const [openXDR, setOpenXDR] = useState(false);
  const [signedXdr, setSignedXdr] = React.useState("");
  const [txResultXDR, setTxResultXDR] = useState<String | null>(null);
  const [notEnoughBal, setNotEnoughBal] = useState(false);
  const [initialQuote, setInitialQuote] = useState<number | null | string>("0");
  const [quote, setQuote] = useState<number | null | string>("0");
  const [minAmountAlert, setMinAmountAlert] = useState(false);
  const [quoteStatus, setQuoteStatus] = useState<boolean | null>(null);
  const [isProductExpired, setIsProductExpired] = useState(false);
  const [quoteActivated, setQuoteActivated] = useState(false);
  const [quoteActivationLoading, setQuoteActivationLoading] = useState(true);
  const [quoteProcessAlert, setQuoteProcessAlert] = useState("");
  const [depositEnabled, setDepositEnabled] = useState(true);
  const [quoteFromSc, setQuoteFromSC] = useState("");
  const maturity = selectedFarmPool?.maturityTimeStamp;
  const bondBalance = selectedFarmPool?.getUserInfo?.deposited;
  // after depoist input proceed to the next

  const signWithFreighter = async () => {
    setIsSubmitting(true);

    const txBuilderAdmin = await getTxBuilder(
      connectorWalletAddress,
      xlmToStroop(fee).toString(),
      provider,
      selectedNetwork.networkPassphrase
    );
    const xdr = await removeBondFromFarm({
      tokenId: contractAddress,
      quantity: ethers
        .parseUnits(depositAmount, selectedFarmPool?.shareDecimals)
        .toString(),
      // quantity: ethers
      //   .parseUnits(depositAmount, selectedFarmPool?.shareDecimals).toString(),
      destinationPubKey: connectorWalletAddress,
      memo,
      txBuilderAdmin,
      server: provider,
      farmPoolId: selectedFarmPool?.poolId,
    });

    try {
      // Signs XDR representing the "mint" transaction
      const signedTx = await signTx(xdr, connectorWalletAddress, kit);

      setSignedXdr(signedTx);
    } catch (error) {
      console.log({ error });
      setIsSubmitting(false);
      setConnectionError(
        error == ERRORS.INTERNAL_ERROR
          ? ERRORS.INTERNAL_ERROR
          : ERRORS.UNABLE_TO_SIGN_TX
      );
    }
  };

  //Finally submit Deposit transaction
  const submit = async () => {
    try {
      const result = await submitTx(
        signedXdr,
        selectedNetwork.networkPassphrase,
        provider
      );

      setTxResultXDR(result);
      setTransactionsStatus({ depositLp: true });
      setIsSubmitting(false);
      setStep(2);
    } catch (error) {
      console.log({ error });
      setIsSubmitting(false);
      setConnectionError(ERRORS.UNABLE_TO_SUBMIT_TX);
    }
  };

  useEffect(() => {
    if (signedXdr) {
      submit();
    }
  }, [signedXdr]);
  const maxDeposit = () => {
    setDepositAmount(      ethers.formatUnits(
      bondBalance,
      7
    ));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDepositAmount(value);
  };

  const moveToDeposit = () => {
    // if(!isGettingFee) {
    // getFee()
    signWithFreighter();
    setStep(1);
    // }
  };
  console.log();
  useEffect(() => {
    if (Number(depositAmount) > Number(bondBalance)) {
      setNotEnoughBal(true);
    } else {
      setNotEnoughBal(false);
    }
  }, [depositAmount, bondBalance]);
  return (
    <>
      <div
        className={`fixed modal-container z-[999] w-full md:p-4 top-0 left-0 h-full flex items-center max-sm:items-end justify-center ${styles.modal}`}
      >
        <div className=" w-full mx-auto flex items-center justify-center ">
          {step === 0 && (
            <div className="modal_content relative w-[500px] max-sm:w-full pb-5  rounded-lg text-[white] border-2 border-borderColor bg-[#15072C] p-5 max-sm:pb-28">
              <div className="header flex justify-between items-start">
                <div className="mb-6">
                  <h1 className="text-lg">
                    {selectedFarmPool?.name} - Withdraw LP tokens
                  </h1>
                  <p className="text_grey text-sm">BOND/USDT</p>
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

              <div className="md:p-3 py-3">
                <p className="text-white mb-3 text-sm">Bond Amount</p>
                {notEnoughBal && (
                  <p className="text-red-500 text-sm mb-2">
                    Not Enough Bond, Get More
                  </p>
                )}
                <div className=" flex justify-between items-center mb-4 card md:py-1 py-2 max-md:px-2">
                  <div className="relative">
                    <input
                      type="tel"
                      id="success"
                      className="bg-transparent md:pl-5 pl-2 outline-none rounded-r-lg text-blueish  block md:text-[20px] text-[16px] text-left max-w-[250px]"
                      placeholder="0"
                      name="depositAmount"
                      value={depositAmount}
                      onChange={handleChange}
                    />
                  </div>
                  <div className=" flex items-center gap-1 md:px-3 md:py-2">
                    <h1 className="md:text-md text-sm text_grey">
                      {selectedFarmPool?.name} LP
                    </h1>
                  </div>
                </div>
                <div className="balance flex justify-between">
                  <div className="flex items-center gap-4 ">
                    <div className="flex items-center gap-1 ">
                      <p className="text-sm text_grey">Available :</p>
                      <h2 className="text-md text-blueish">
                        {" "}
                        {Number(
                          ethers.formatUnits(
                            selectedFarmPool?.getUserInfo?.deposited,
                            7
                          )
                        )}
                      </h2>
                    </div>
                    <span
                      className="text-sm rounded shadowBackDrop px-3 py-[2px] cursor-pointer"
                      onClick={maxDeposit}
                    >
                      max
                    </span>
                  </div>

                  <h2 className="text-md max-sm:text-sm cursor-pointer text-blueish">
                    Get More
                  </h2>
                </div>

                <div className="pt-4 mt-6">
                  <div className=" flex items-center justify-between mb-3">
                    <p className="text_grey text-md max-sm:text-sm">
                    Last Time Deposited
                    </p>
                    <p className="text-white text-md max-sm:text-sm">
                    {dateFormat(selectedFarmPool?.getUserInfo.deposit_time)}
                    </p>
                  </div>
                </div>
                <div className="">
                  <div className=" flex items-center justify-between mb-3">
                    <p className="text_grey text-md max-sm:text-sm">
                      Accrued Reward One{" "}
                    </p>
                    <p className="text-white text-md max-sm:text-sm">
                      {floatFigure(
                        Number(
                          ethers.formatUnits(
                            selectedFarmPool?.getUserInfo.accrued_rewards1,
                            7
                          )
                        ),
                        2
                      )}{" "}
                      Bonds
                    </p>
                  </div>
                </div>
                <div className="">
                  <div className=" flex items-center justify-between mb-3">
                    <p className="text_grey text-md max-sm:text-sm">
                      Accrued Reward Two{" "}
                    </p>
                    <p className="text-white text-md max-sm:text-sm">
                      {floatFigure(
                        Number(
                          ethers.formatUnits(
                            selectedFarmPool?.getUserInfo.accrued_rewards2,
                            7
                          )
                        ),
                        2
                      )}{" "}
                      Bonds
                    </p>
                  </div>
                </div>
                <div className="border-t border-gray-500 pt-4 mt-6">
                  <div className=" flex items-center justify-between mb-1 mb-4">
                    <p className="text_grey text-md max-sm:text-sm">Fee</p>
                    <p className="text-white text-md max-sm:text-sm">
                      0.14 - 0.8 BOND
                    </p>
                  </div>
                </div>
              </div>
              <button
                className={`mt-7 py-3 w-full flex ${"proceed"}`}
                onClick={moveToDeposit}
              >
                {/* {isGettingFee ? (
                    <div className="mx-auto">
                      <Loading />
                    </div>
                  ) : ( */}
                <p className="mx-auto">Withdraw</p>
                {/* )} */}
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="modal_content relative w-[450px] max-sm:w-full  rounded-lg text-[white] border-2 border-borderColor bg-[#15072C] p-5 max-sm:pb-16 flex flex-col items-center gap-5 justify-center text-center md:py-[150px] max-sm:pb-36 max-sm:pt-28">
              <div className="header flex justify-between items-start absolute top-5 right-5">
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
              {/* <SpinningLoading/> */}
              <h1 className="text-2xl px-16 mb-7">
                Confirm Withdrawal transaction in your wallet for{" "}
                {selectedFarmPool?.name}
              </h1>
              <p className="text_grey text-sm">
                Farm {depositAmount} BOND/USDT LP
              </p>
              {connectionError && (
                <p className="text-red-500 break-words bg-dappHeaderBg border-border_pri border rounded-md text-sm py-3 px-10 mt-5">
                  {connectionError}
                </p>
              )}
            </div>
          )}
          {/* {step === 2 && (
            <div className="modal_content relative w-[450px] max-sm:w-full  rounded-lg text-[white] border-2 border-borderColor bg-[#15072C] p-5 max-sm:pb-16 flex flex-col items-center gap-5 justify-center text-center md:py-[150px] max-sm:pb-36 max-sm:pt-28">
            <div className="header flex justify-between items-start absolute top-5 right-5">
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
            <SpinningLoading/>
            <h1 className="text-2xl px-16">
            One more second
            </h1>
            <p className="text_grey text-sm">Farm 0.1998783 BOND/USDT LP</p>
          </div>
          )} */}
          {step === 2 && txResultXDR && (
            <div className="modal_content relative w-[450px] max-sm:w-full  rounded-lg text-[white] border-2 border-borderColor bg-[#15072C] p-5 max-sm:pb-16 flex flex-col items-center gap-5 justify-center text-center md:py-[70px] max-sm:pb-36 max-sm:pt-28">
              <div className="header flex justify-between items-start absolute top-5 right-5">
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
              <SpinningLoading/>
              <h1 className="text-2xl px-16">
                Your transaction was successful
              </h1>
              <p className="text_grey text-sm mb-5">
                {" "}
                {depositAmount} Removed from {selectedFarmPool?.name}
              </p>
              <div className="mt-5 ">
                <p
                  className="underline text-sm text-paraDarkText cursor-pointer"
                  onClick={() => setOpenXDR(!openXDR)}
                >
                  View Signed Transaction XDR
                </p>
                {openXDR && (
                  <p className="w-5/12 mx-auto break-words bg-dappHeaderBg border-border_pri border rounded-md text-sm p-5 mt-5">
                    {txResultXDR}
                  </p>
                )}
              </div>
              <button
                className={`mt-7 py-3 w-6/12 flex ${"proceed"}`}
                onClick={() => setOpenState(false)}
              >
                {/* {isGettingFee ? (
                    <div className="mx-auto">
                      <Loading />
                    </div>
                  ) : ( */}
                <p className="mx-auto">Got It</p>
                {/* )} */}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FarmWithdraw;
