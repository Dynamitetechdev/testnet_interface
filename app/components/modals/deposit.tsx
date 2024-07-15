"use client";
import Image from "next/image";
import styles from "./styles.module.scss";
import { Close, DepositSuccess, EthLogo, UsdcBgLogo, Wallet } from "../assets";
import React, { useEffect, useState } from "react";
import UseStore from "@/store/UseStore";
import {
  BASE_FEE,
  accountToScVal,
  getEstimatedFee,
  getServer,
  getTxBuilder,
  mintTokens,
  simulateTx,
  submitTx,
} from "@/app/helpers/soroban";
import { TESTNET_DETAILS, signTx } from "@/app/helpers/network";
import { ethers } from "ethers";
import { stroopToXlm, xlmToStroop } from "@/app/helpers/format";
import { kit } from "../navigations/dAppHeader";
import { ERRORS } from "@/app/helpers/error";
import Loading from "../UI-assets/loading";
import { pool } from "@/app/constants/poolOptions";
import { Contract, TransactionBuilder } from "@stellar/stellar-sdk";
import { ActivateQuote } from "@/app/dataService/dataServices";
import { floatFigure, formatFigures, formatWithCommas } from "../web3FiguresHelpers";
import { formatBigIntTimestamp } from "../web3Function/hooks";
const DepositFunds: React.FC<{ setOpenState: any }> = ({ setOpenState }) => {
  const [depositAmount, setDepositAmount] = useState("");
  const [memo, setMemo] = useState("")
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
  const [openXDR, setOpenXDR] = useState(false)
  const [signedXdr, setSignedXdr] = React.useState("");
  const [txResultXDR,setTxResultXDR] = useState<String | null>(null)
  const [notEnoughBal, setNotEnoughBal] = useState(false)
  const [quote, setQuote] = useState<number | null | string >("0")
  const [minAmountAlert, setMinAmountAlert] = useState(false)
  const [quoteStatus, setQuoteStatus] = useState<boolean | null>(null)
  const [isProductExpired, setIsProductExpired] = useState(false)
  const [quoteActivated, setQuoteActivated] = useState(false)
  const [quoteActivationLoading, setQuoteActivationLoading] = useState(true)
  const [quoteProcessAlert, setQuoteProcessAlert] = useState("")
  const [depositEnabled, setDepositEnabled] = useState(true)
  const [maturity,setMaturity] = useState(0)
  // after depoist input proceed to the next
  const getFee = async () => {
    setIsGettingFee(true);

    try {
      const builder = await getTxBuilder(
        connectorWalletAddress!,
        fee,
        provider,
        selectedNetwork.networkPassphrase
      );

      const estimatedFee = await getEstimatedFee(
        contractAddress,
        ethers.parseUnits(depositAmount, selectedPool?.tokenDecimals).toString(),
        connectorWalletAddress!,
       memo,
        builder,
        provider
      );
      setFee(stroopToXlm(estimatedFee).toString());
      setIsGettingFee(false);
    } catch (error: any) {
      setConnectionError("error getting fee");
      // defaults to hardcoded base fee if this fails
      console.log(error);
      if(error.includes("HostError: Error(Contract, #4)")){
        setIsProductExpired(true)
      }else{
        setIsProductExpired(false )
      }
      setIsGettingFee(false);
    }
  };
  console.log({isProductExpired,depositEnabled})
  const signWithFreighter = async () => {
    setIsSubmitting(true);

    const txBuilderAdmin = await getTxBuilder(
      connectorWalletAddress,
      xlmToStroop(fee).toString(),
      provider,
      selectedNetwork.networkPassphrase
    );
    const xdr = await mintTokens({
      tokenId: contractAddress,
      quantity: ethers.parseUnits(depositAmount, selectedPool?.tokenDecimals).toString(),
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
      setTransactionsStatus({deposit: true})
      setIsSubmitting(false);
      setStep(2)
    } catch (error) {
      console.log(error);
      setIsSubmitting(false);
      setConnectionError(ERRORS.UNABLE_TO_SUBMIT_TX);
    }
  };



  const getQuoteCont = async (
    id: string,
    txBuilder: TransactionBuilder,
    connection: any,
    destinationPubKey: string | null = null
  ) => {
    const contract = new Contract(id);
    if (!destinationPubKey) {
      return false;
    }
    const tx = txBuilder
      .addOperation(
        contract.call("quote")
      )
      .setTimeout(30)
      .build();

    const result = await simulateTx<string>(tx, connection);
    return ethers.formatUnits(result, selectedPool.shareDecimals);
  };
  const getQuote = async () => {
    const txBuilderBalance = await getTxBuilder(
      connectorWalletAddress!,
      BASE_FEE,
      provider,
      selectedNetwork.networkPassphrase
    );
    // setQuoteProcessAlert("Checking Quote...")
    const quote: any = await getQuoteCont(selectedPool.contractAddress, txBuilderBalance, provider, connectorWalletAddress);
    setQuoteStatus(Number(quote) > 0 ? true : false)
    setQuoteActivationLoading(Number(quote) > 0  ? false : true)
    // setQuoteProcessAlert(Number(quote) > 0  ? "Quote successful." : 'No Quote, Requesting Quote 1/2 done.')
    setQuote(quote)
    return quote
  }

    //  READ FUNCTION
  const readContIntr = async (
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

    const result: any = await readContIntr(selectedPool.contractAddress, txBuilderBalance, provider, connectorWalletAddress, functName);
    const now = BigInt(Math.floor(Date.now() / 1000))
    // console.log({endDatedepositEnabled:formatBigIntTimestamp(result)})
    setMaturity(result)
    if(BigInt(result) > now){
      setDepositEnabled(true)
    }else{
      setDepositEnabled(false)
    }

    // console.log({[functName]: result});
    return result
  }

  const calEstimatedBonds = () => {
   const estimatedBond = Number(quote) * Number(depositAmount)
   return estimatedBond
  }
  useEffect(() => {
    readContract("maturity")
  })

  useEffect(() => {
    if (signedXdr) {
      submit();
    }
  }, [signedXdr]);

  useEffect(() => {
    if (isGettingFee === false && connectionError !== "error getting fee") {
      setStep(1);
      setIsGettingFee(null)
    }
  }, [isGettingFee, connectionError]);

  useEffect(() => {
    if(Number(depositAmount) > Number(userBalance)){
      setNotEnoughBal(true)
    } else{
      setNotEnoughBal(false)
    }

    if(Number(depositAmount) != 0 &&  Number(depositAmount) < 100){
      setMinAmountAlert(true)
    }else{
      setMinAmountAlert(false)
    }
  }, [depositAmount, userBalance])

  useEffect(() => {
    // console.log("quoteImmediately")
    getQuote()
  }, [])
  // console.log({quoteActivated, quoteStatus, quote})
  useEffect(() => {
    if (quoteActivated) {
      const timer = setTimeout(() => {
        getQuote();
        setQuoteActivationLoading(false)
        setQuoteActivated(false)
        // console.log({ "getting quote after activation": quote });
      }, 1000);
  
      return () => clearTimeout(timer);
    }
  }, [quoteActivated, quoteActivationLoading])
  
  useEffect(() => {
    setQuoteActivationLoading(true)
    const activate = async () => {
      setQuoteProcessAlert('Requesting Quote...')
      try {
        const {data, isLoading} = await ActivateQuote(contractAddress)
        if(data){
          setQuoteActivated(true)
          setQuoteProcessAlert("Requesting Quote...")
        }
        // console.log("quotebefore")
      } catch (error) {
        setQuoteActivated(false)
        setQuoteActivationLoading(false)
      }
    }
    if(quoteStatus === false){
      activate()
    }
  }, [quoteStatus,quoteActivated, quoteActivationLoading])
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
                  <h1 className="text-lg">Deposit Funds</h1>
                  <p className="text-paraDarkText text-sm">
                  Invest asset for Guaranteed Yields
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
              {minAmountAlert && <p className="text-red-500 text-sm mb-2">Minimum deposit is $100 USDC</p>}
              <div className="balance flex justify-be  tween">
                  <div className="flex items-center gap-1 ">
                    <div className="flex items-center">
                    <Image
                      src={Wallet}
                      width={17}
                      height={17}
                      alt="right"
                      className=""
                    />
                    </div>
                    <h2 className="text-lg text-paraDarkText">
                      ${formatWithCommas(userBalance)}
                    </h2>
                  </div>
                  {/* <h2 className="text-[14px] text-paraDarkText">$23,123</h2> */}
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
                      placeholder={formatWithCommas(userBalance)}
                      name="depositAmount"
                      value={depositAmount}
                      onChange={(e: any) => setDepositAmount(e.target.value)}
                    />
                  </div>
                  {/* <h1 className="text-[34px]">23,123</h1> */}
                </div>

                <div className="border-t border-border_pri pt-4">
                <div className=" flex items-center justify-between">
                  <p className="text-white text-sm">Estimated Bonds</p>
                  <p className="text-white text-lg">{floatFigure(calEstimatedBonds(), 3)}</p>
                </div>
                <div className=" flex items-center justify-between">
                  <p className="text-white text-sm">Estimated redemption</p>
                  <p className="text-white text-lg">{floatFigure((calEstimatedBonds() * 100), 3)}</p>
                </div>
                <div className=" flex items-center justify-between mb-4">
                  <p className="text-white text-sm">Redeemable on</p>
                  <p className="text-white text-lg">{maturity == 0 ?<Loading/>  : formatBigIntTimestamp(maturity)}</p>
                </div>
                </div>
              </div>
              {
                notEnoughBal && <div className="mt-3">
                <p className="text-red-500 cursor-pointer">
                The Amount you entered is larger than your balance. Try a lower anount
                </p>
              </div>
              }
              {
               depositEnabled && Number(quote) === 0 && (
                  <button
                  className={`mt-7 py-3 w-full flex button1 ${notEnoughBal ? " text-paraDarkText": "proceed"}`}
                  // onClick={() => {
                  //   getQuote()
                  // }}
                  disabled={true}
                >
                  <div className="mx-auto">
                  {quoteActivationLoading && (
                    <div className="flex items-center gap-2">
                      <Loading/>
                      <p className="text-sm">{quoteProcessAlert ? quoteProcessAlert : "Checking Quote..."}</p>
                    </div>
                  )}
                  </div> 
                </button>
                )
              }
              {
                Number(quote) > 0 && !isProductExpired && depositEnabled && (
                  <button
                  className={`mt-7 py-3 w-full flex ${notEnoughBal || minAmountAlert || Number(depositAmount) == 0 ? "button1 text-paraDarkText": "proceed"}`}
                  onClick={() => {
                    !isGettingFee &&  getFee();
                  }}
                  disabled={notEnoughBal || Number(quote) <= 0 || minAmountAlert || Number(depositAmount) == 0}
                >
                  {isGettingFee ? <div className="mx-auto">
                    <Loading/>
                  </div>  : <p className="mx-auto">Proceed</p> }
                </button>
                )
              }
              {
                !depositEnabled && (
                  <button
                  className="mt-7 py-3 w-full flex button1 text-paraDarkText"
                  // onClick={() => {
                  //   !isGettingFee &&  getFee();
                  // }}
                  disabled={!depositEnabled}
                >
                  <p className="mx-auto">Product Has Expired</p>
                </button>
                )
              }
            </div>
          )}

          {step === 1 && (
            <div className="modal_content relative w-[550px] max-sm:w-full pb-5 rounded-lg text-[white] border-2 border-borderColor bg-[#1B2132] p-5 max-sm:pb-16">
              <div className="header flex justify-between items-start">
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
              </div>
              <div className="mt-8">
                <div className=" flex justify-between mb-4 items-center">
                  <h1 className="text-paraDarkText">Network</h1>
                  <h1 className="text-1xl text-paraDarkText">{selectedNetwork.network}</h1>
                </div>
                <div className=" flex justify-between mb-4 items-center">
                  <h1 className="text-paraDarkText">Estimate fee (XLM)</h1>
                  <h1 className="text-1xl">{fee}</h1>
                </div>
                <div className=" flex justify-between mb-4 items-center">
                  <h1 className="text-paraDarkText">Quantity</h1>
                  <h1 className="text-1xl">{depositAmount} USDC</h1>
                </div>
                <div className="mt-5">
                  <p className="text-[12px] mb-2 text-paraDarkText">Write memo for your transaction (optional)</p>
                  <textarea
                    id="memo"
                    className="text-secText max-md:py-[16px] h-[80px] block w-full p-2 py-4 pl-3 text-[16px] outline-none bg-dappHeaderBg border-border_pri border rounded-md"
                    placeholder=""
                    name="memo"
                    value={memo}
                    onChange={(e: any) => setMemo(e.target.value)}
                  />
                </div>
                {
                  connectionError && <div className="mt-3">
                  <p className="text-red-500 cursor-pointer">
                  Error: {connectionError}
                  </p>
                </div>
                }
                <button
                  className="proceed mt-7 py-3 w-full flex"
                  onClick={signWithFreighter}
                >
                                  {isSubmitting ? <div className="mx-auto">
                  <Loading/>
                </div>  : <p className="mx-auto">Deposit</p> }

                </button>
              </div>
            </div>
          )}
          {/* {step === 2 && ( */}
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
              <h1 className="text-center text-3xl mb-5 text-gold">Deposit Successful</h1>
              <div className=" flex justify-between mb-4 items-center">
                  <h1 className="text-paraDarkText">Network</h1>
                  <h1 className="text-1xl text-paraDarkText">{selectedNetwork.network}</h1>
                </div>
                <div className=" flex justify-between mb-4 items-center">
                  <h1 className="text-paraDarkText">Deposited</h1>
                  <h1 className="text-1xl">{depositAmount} USDC</h1>
                </div>
                <div className=" flex justify-between mb-4 items-center">
                  <h1 className="text-paraDarkText">Memo</h1>
                  <h1 className="text-1xl">{memo}</h1>
                </div>
              <div className="mt-5 ">
                <p className="underline text-sm text-paraDarkText cursor-pointer" onClick={() => setOpenXDR(!openXDR)}>View Signed Transaction XDR</p>
                {
                  openXDR && <p className="w-[200px break-words bg-dappHeaderBg border-border_pri border rounded-md text-sm p-5 mt-5">{txResultXDR}</p>
                }
              </div>
              <button className="button2 px-14 py-2 flex justify-center mx-auto mt-10" onClick={() => setOpenState(false)}>Close</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DepositFunds;
