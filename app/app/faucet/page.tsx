"use client";
import Image from "next/image";
import {
  ArrowPathIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  ExclamationCircleIcon,
  RectangleGroupIcon,
} from "@heroicons/react/24/outline";
import React, { memo, useEffect, useState } from "react";
import { Contract, TransactionBuilder } from "@stellar/stellar-sdk";
import UseStore from "@/store/UseStore";
import { ethers } from "ethers";
import DAppHeader, { kit } from "@/app/components/navigations/dAppHeader";
import DappFooter from "@/app/components/navigations/dAppFooter";
import {
  AnalyticsIcon,
  ApyArrowIcon,
  ArrowRightUpGrey,
  ArrowRightUpWhite,
  EthBgWhiteLogo,
  EthLogo,
  InvestIcon,
  UsdcBgLogo,
} from "@/app/components/assets";
import Link from "next/link";
import {
  BASE_FEE,
  getServer,
  getTxBuilder,
  mintTestTokens,
  submitTx,
} from "@/app/helpers/soroban";
import { TESTNET_DETAILS, signTx } from "@/app/helpers/network";
import { xlmToStroop } from "@/app/helpers/format";
import { ERRORS } from "@/app/helpers/error";
import { pool } from "@/app/constants/poolOptions";
import Loading from "@/app/components/UI-assets/loading";

const Faucet = () => {
  const [depositAmount, setDepositAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [withdrawalEnabled, setWihdrawalEnabled] = useState(false);
  const {
    connectorWalletAddress,
    userBalance,
    selectedNetwork: currentNetwork,
    setTransactionsStatus,
    selectedPool,
  } = UseStore();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [fee, setFee] = React.useState(BASE_FEE);
  const [step, setStep] = useState(0);
  const [isGettingFee, setIsGettingFee] = useState<Boolean | null>(null);
  // const contractAddress = "CDJCX67YS7M6EOREWQ7MVVBX2CCQHOSTXF6ZQPADLEVQO26MUNABYLX2"
  const contractAddress =
    "CBCJHCJMDD6SLD3K4HEUHNILUQBPXQFZ6XAIWHBS7GPQEHV3YXDOW3UK";
  const [selectedNetwork] = React.useState(TESTNET_DETAILS);
  const [connectionError, setConnectionError] = useState(null as string | null);
  const [openXDR, setOpenXDR] = useState(false);
  const [signedXdr, setSignedXdr] = React.useState("");
  const [txResultXDR, setTxResultXDR] = useState<String | null>(null);
  const [notEnoughBal, setNotEnoughBal] = useState(false);

  const provider = getServer(selectedNetwork);
  const signWithFreighter = async () => {
    setIsSubmitting(true);

    const txBuilderAdmin = await getTxBuilder(
      connectorWalletAddress,
      xlmToStroop(fee).toString(),
      provider,
      selectedNetwork.networkPassphrase
    );
    const xdr = await mintTestTokens({
      tokenId: contractAddress,
      quantity: ethers.parseUnits("100", 7).toString(),
      destinationPubKey: connectorWalletAddress,
      memo,
      txBuilderAdmin,
      server: provider,
    });
    try {
      // Signs XDR representing the "mint" transaction
      const signedTx = await signTx(xdr, connectorWalletAddress, kit);
      // setIsSubmitting(false);
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
    } catch (error) {
      setIsSubmitting(false);
      setConnectionError(ERRORS.UNABLE_TO_SUBMIT_TX);
    }
  };
  useEffect(() => {
    if (signedXdr) {
      submit();
    }
  }, [signedXdr]);
  useEffect(() => {
    if (txResultXDR) {
      setTimeout(() => {
        setTxResultXDR(null);
      }, 3000);
    }
  }, [txResultXDR]);
  return (
    <>
      <div className="dapp">
        <DAppHeader />
        <div className="lg:w-11/12 md:max-lg:w-11/12 mx-auto md:pt-24 pt-8 md:px-5 max-w-[1500px] h-screen text-center">
          <h1 className="text-[4vw] text-white uppercase">Faucets</h1>
          <p className="text-white">Mint Tokens For Tests.</p>
          <button
            className="product_button items-center px-20 py-5 my-5"
            onClick={signWithFreighter}
          >
            <p className="text-[13px] text-darkPrimText uppercase">
              {isSubmitting ? (
                <Loading />
              ) : (
                <span className="inline-flex gap-2">
                  <span>{txResultXDR ? "Minted 100 USDC" : "Mint"}</span>
                  <Image
                    src={ArrowRightUpGrey}
                    width={17}
                    height={17}
                    alt="bondhive"
                  />
                </span>
              )}
            </p>
          </button>
        </div>
        <DappFooter />
      </div>
    </>
  );
};

export default Faucet;
