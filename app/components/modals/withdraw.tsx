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
import {
  Contract,
  TransactionBuilder,
  Asset,
  Operation,
  Keypair,
} from "@stellar/stellar-sdk";
import {
  floatFigure,
  formatFigures,
  formatWithCommas,
} from "../web3FiguresHelpers";
const WithdrawFunds: React.FC<{ setOpenState: any }> = ({ setOpenState }) => {
  const [depositAmount, setDepositAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [withdrawalEnabled, setWihdrawalEnabled] = useState(false);
  const {
    connectorWalletAddress,
    userBalance,
    selectedNetwork: currentNetwork,
    setTransactionsStatus,
    selectedPool,
    selectedNetwork,
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
  const maturity = selectedPool?.maturityTimeStamp;
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
      .addOperation(contract.call(functName))
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

    const result: any = await getQuoteCont(
      selectedPool.contractAddress,
      txBuilderBalance,
      provider,
      connectorWalletAddress,
      functName
    );
    setWihdrawalEnabled(
      functName === "available_redemption" && Number(result) > 0 ? true : false
    );
    console.log({functName: result})
    // console.log({[functName]: result});
    return result;
  };
  // console.log({withdrawalEnabled})
  useEffect(() => {
    readContract("available_redemption");
  });
  // console.log({maturity})
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

  // const calculateAPY = () => {
  //   const bondsHeld = Number(selectedPool?.shareBalance);
  //   const amountDeposited = Number(selectedPool?.reserves);
  //   const maturityDate: Date = new Date(Number(maturity) * 1000);
  //   const currentDate: Date = new Date();
  //   const timeDifference: number =
  //     maturityDate.getTime() - currentDate.getTime();
  //   const daysToMaturity: number = Math.floor(
  //     timeDifference / (1000 * 60 * 60 * 24)
  //   );

  //   const redemptionValue = Number(bondsHeld) * 100;
  //   const absoluteReturn =
  //     (redemptionValue / Number(amountDeposited) - 1) * 100;
  //   const annualizedReturn = (365 / daysToMaturity) * absoluteReturn;

  //   console.log({
  //     annualizedReturn,
  //     amountDeposited,
  //     redemptionValue,
  //     absoluteReturn,
  //     daysToMaturity,
  //   });
  //   return annualizedReturn;
  // };

  // const APY = calculateAPY();



  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    if (selectedPool?.shareId) {
      try {
        await navigator.clipboard.writeText(selectedPool?.shareId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

const depositsForAwallet = [
    { bondsHeld: 5.02, amountDeposited: 500, daysToMaturity: 60 },
    // { bondsHeld: 10.05, amountDeposited: 1000, daysToMaturity: 33 },
    // { bondsHeld: 50.15, amountDeposited: 5000, daysToMaturity: 10 }
];

  const calculateAPYY = (bondsHeld: number, amountDeposited: number, daysToMaturity: number) => {
    const redemptionValue = Number(bondsHeld) * 100;
    const absoluteReturn = ((redemptionValue / Number(amountDeposited)) - 1) * 100;
    const annualizedReturn = (365 / daysToMaturity) * absoluteReturn;

    return annualizedReturn;
};

const calculateAggregateAPY = (deposits: any[]) => {
    let totalWeightedAPY = 0;
    let totalAmountDeposited = 0;

    deposits.forEach((deposit: any) => {
        const { bondsHeld, amountDeposited, daysToMaturity } = deposit;
        const apy = calculateAPYY(bondsHeld, amountDeposited, daysToMaturity);

        totalWeightedAPY += apy * amountDeposited;
        totalAmountDeposited += amountDeposited;
    });

    const aggregateAPY = totalWeightedAPY / totalAmountDeposited;
    return aggregateAPY;
};

const aggregateAPY = calculateAggregateAPY(depositsForAwallet);

console.log('Aggregate APY:', aggregateAPY);

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
                  <h1 className="text-lg">
                    My Position - {selectedPool?.name}
                  </h1>
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
                  <p className=" text-sm">Available Shares</p>
                  <div className="flex gap-2 items-center">
                    <p className="text-white text-sm">
                      {formatWithCommas(
                        Number(floatFigure(selectedPool.shareBalance, 2))
                      )}
                    </p>
                  </div>
                </div>
                <div className=" flex justify-between mb-4">
                  <p className=" text-sm">Estimated redemption value</p>
                  <p className="text-white text-sm">
                    {formatWithCommas(
                      Number(floatFigure(selectedPool.position, 2))
                    )}
                  </p>
                </div>
                <div className=" flex justify-between mb-4">
                  <p className=" text-sm">Aggregate APY</p>
                  <p className="text-white text-sm">
                    {formatWithCommas(
                      Number(floatFigure(aggregateAPY, 2))
                    )}%
                  </p>
                </div>
              </div>
              <div className="copy_bond my-4  currency_container py-3 px-3">
                <div className="mb-3 flex justify-between items-center">
                  <p className=" text-sm ">
                    Add Bond Token - {selectedPool?.name} to wallet
                  </p>

                    <p className="text_grey text-[12px] underline cursor-pointer">Learn More</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm text_grey cursor-pointer" onClick={copyToClipboard}>{`${selectedPool?.shareId.substring(
                    0,
                    7
                  )}....${selectedPool?.shareId.substring(
                    selectedPool?.shareId.length - 7
                  )}`}</p>
                  <button
                    className="button text-[10px] bg-blue-600 p-1 px-3 rounded-md "
                    onClick={copyToClipboard}
                  >
                    {copied? 'Copied': 'Copy'}
                  </button>
                </div>
              </div>
              {!withdrawalEnabled && (
                <p className="text-sm text-bluish font-semibold ">
                  Investor can redeem post maturity {selectedPool.expiration} at
                  8:00 am GMT
                </p>
              )}
              <div className="flex max-sm:flex-col justify-between gap-3 mt-4">
                <button className=" disable_btn w-1/2 max-sm:w-full py-3">
                  Secondary Market (soon)
                </button>
                <button className=" disable_btn w-1/2 max-sm:w-full py-3">
                  Buyback (soon)
                </button>
              </div>
              <button
                className={`mt-4 py-3 w-full flex ${
                  Number(selectedPool.shareBalance) <= 0 || !withdrawalEnabled
                    ? "disable_btn hover:bg-transparent"
                    : "proceed"
                }`}
                onClick={() => setStep(1)}
                disabled={
                  Number(selectedPool.shareBalance) <= 0 || !withdrawalEnabled
                }
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
                    <h2 className="text-[14px] text-white">
                      ${selectedPool.shareBalance}
                    </h2>
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
                  notEnoughBal || Number(selectedPool.shareBalance) <= 0
                    ? "button1 text-paraDarkText"
                    : "proceed"
                }`}
                // onClick={() => {
                //   !isGettingFee &&  submit();
                // }}
                onClick={signWithFreighter}
                disabled={
                  notEnoughBal || Number(selectedPool.shareBalance) <= 0
                }
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
