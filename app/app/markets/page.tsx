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
import DAppHeader from "@/app/components/navigations/dAppHeader";
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
import Charts from "./chart";
import { apyData,priceData } from "./priceData";
import Link from "next/link";
import MobileNav from "@/app/components/UI-assets/mobileNav";

const MainDapp = () => {
  const ourProducts = [
    {
      name: "APY",
      value: "apy",
    },
    // {
    //   name: "Secondary Trading Market",
    //   value: "secondaryMarket",
    // },
    {
      name: "price",
      value: "price",
    },
  ];
  const history = [
    {
      name: "my orders",
      value: "myOrders",
    },
    {
      name: "my Trade History",
      value: "myTradeHistory",
    },
    {
      name: "my position",
      value: "myPosition",
    },
    {
      name: "market transaction",
      value: "marketTransaction",
    },
  ];
  const [selectTabs, setSelectTabs] = useState<any>({
    apy: true,
  });
  const [historySelectTabs, setHistorySelectTabs] = useState<any>({
    myOrders: true,
  });
  const handleSelect = (selectedTab: string) => {
    setSelectTabs((prev: any) => {
      let updatedTab = { [selectedTab]: true };
      Object.keys(prev).forEach((key: any) => {
        if (key != selectedTab) {
          updatedTab[key] = false;
        }
      });
      return updatedTab;
    });
  };
  const handleSelectHistory = (selectedTab: string) => {
    setHistorySelectTabs((prev: any) => {
      let updatedTab = { [selectedTab]: true };
      Object.keys(prev).forEach((key: any) => {
        if (key != selectedTab) {
          updatedTab[key] = false;
        }
      });
      return updatedTab;
    });
  };
  return (
    <>
      <div className="dapp">
        <DAppHeader />
        <div className="lg:w-11/12 md:max-lg:w-11/12 mx-auto md:pt-24 pt-8 md:px-5 max-w-[1500px]">
          <div className="flex gap-8 max-md:flex-col">
            <div className="left w-4/12 max-md:w-11/12 md:max-lg:w-6/12 max-md:mx-auto">
              <div
                // variants={getAnimationVariants(0.6)}
                // initial="out"
                // animate={featuresIsInView ? "in" : "out"}
                className="card h-[146px] py-2 px-5 border-border_pri border-b"
              >
                {/* <Image
                // src={TransparentIcon}
                width={23}
                height={24}
                alt="right"
                className="arrow my-3 mt-5"
              /> */}
                <div className="flex items-center gap-1">
                  <ExclamationCircleIcon className="w-[20px] text-priBlue" />
                  <h2 className="text-priText font-semibold">
                    Bond Issuance is Capped!
                  </h2>
                </div>
                <p className="text-secText  text-[14px] my-2">
                  Once cap is reached, you can only or sell your bonds in the
                  secondary market
                </p>
                <div className="progress_bar">
                  <div className="mb-1 text-priBlue text-sm font-semibold">
                    $4.5m / $50m filled
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
                    <div className="bg-priBlue h-2.5 rounded-full  w-[9%]"></div>
                  </div>
                </div>
              </div>
              <button
                className={`product_button inline-flex items-center px-10 py-2 gap-2 my-5`}
              >
                <p className="text-[13px] text-darkPrimText uppercase">
                Go to Issuance
                </p>
                <Image
                  src={ArrowRightUpGrey}
                  width={17}
                  height={17}
                  alt="bondhive"
                />
              </button>

              <div className="card py-5  border-border_pri border-b mb-5">
                <div className="head px-5">
                  <div className="flex items-center justify-between">
                    <ul className="text-darkPrimText flex items-center gap-4 text-sm">
                      <li className="text-priBlue font-semibold">Swap</li>
                      <li>Limit</li>
                    </ul>

                    <div className="flex items-center gap-2">
                      <div className="slippage flex items-center gap-1 bg-dappHeaderBg py-[5px] px-2 rounded-full">
                        <p className="text-darkPrimText text-sm">0.1%</p>
                        <Cog6ToothIcon className="w-[22px] text-priBlue" />
                      </div>
                      <ArrowPathIcon className="w-[20px] text-darkPrimText" />
                    </div>
                  </div>
                </div>

                <div className="swap mt-5 border-border_pri border-t pt-5">
                  <form className="max-w-md mx-auto">
                    <div className="flex items-center justify-between mb-1 px-5">
                      <p className="text-white text-sm">Input</p>
                      <p className="text-secText text-sm">Balance: 0</p>
                    </div>
                    <div className="swap_input border-border_pri border-b pb-5 px-5">
                      <div className="input1 flex text-secText block w-full pl-3 text-[16px] outline-none bg-dappHeaderBg border-border_pri border rounded-md">
                        <button
                          className="w-6/12 border-r py-3 border-border_pri"
                          type="button"
                        >
                          <div className="flex items-center justify-between pr-2">
                            <div className="flex items-center gap-2">
                              <Image
                                src={UsdcBgLogo}
                                width={20}
                                className=""
                                alt=""
                              />
                              <p className="text-sm">bhETH-Sep2024</p>
                            </div>

                            <ChevronDownIcon className="w-4" />
                          </div>
                        </button>
                        <div className="relative w-6/12 px-2 py-3">
                          <span className="text-[10px] absolute top-0 right-0 rounded-x shadowBackDrop rounded-bl-lg px-3 py-[2px]">
                            max
                          </span>
                          <input
                            type="tel"
                            className="bg-transparent outline-none"
                            placeholder="100"
                            required
                          />
                        </div>
                      </div>

                      <div className="circle w-[36px] h-[36px] right-3 top-3 flex justify-center items-center mx-auto my-8">
                        <ArrowPathIcon className="w-5 text-white" />
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-white text-sm">Output</p>
                      </div>
                      <div className="input1 flex text-secText block w-full pl-3 text-[16px] outline-none bg-dappHeaderBg border-border_pri border rounded-md">
                        <button
                          className="w-6/12 border-r py-3 border-border_pri"
                          type="button"
                        >
                          <div className="flex items-center justify-between pr-2">
                            <div className="flex items-center gap-2">
                              <Image
                                src={UsdcBgLogo}
                                width={20}
                                className=""
                                alt=""
                              />
                              <p className="text-sm">Usdc</p>
                            </div>

                            <ChevronDownIcon className="w-4" />
                          </div>
                        </button>
                        <div className="relative w-6/12 px-2 py-3">
                          <span className="text-[10px] absolute top-0 right-0 rounded-x shadowBackDrop rounded-bl-lg px-3 py-[2px]">
                            max
                          </span>
                          <input
                            type="tel"
                            className="bg-transparent outline-none"
                            placeholder="100"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="px-5">
                      <button className={`mt-5 py-3 w-full button1 text-sm `}>
                        Connect Wallet
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div className="right w-8/12 max-md:w-11/12 md:max-lg:w-6/12 max-md:mx-auto">
              <div className="flex max-lg:flex-col items-center gap-5">
                <div className="w-1/2 max-lg:w-full card relative flex items-center justify-between px-4">
                  <div className="flex items-center gap-2">
                    <Image
                      src={EthBgWhiteLogo}
                      width={25}
                      height={25}
                      alt="right"
                      className=""
                    />
                    <div className="">
                      <h1 className="text-white text-sm">ETH - Sept ‘24</h1>
                      <p className="text-darkPrimText text-sm capitalize">
                        Bondhive
                      </p>
                    </div>
                  </div>
                  <button
                    className={`product_button inline-flex items-center px-4 py-1 gap-2 my-5`}
                  >
                    <p className="text-[10px] text-darkPrimText uppercase">
                      Info
                    </p>
                  </button>
                </div>
                <div className="w-1/2 max-lg:w-full card relative flex items-center justify-between px-4">
                  <div className="flex items-center gap-1 text-sm">
                    <h1 className="text-white ">28 Sep 2024</h1>
                    <p className="text-darkPrimText  capitalize">
                      19 days to maturity
                    </p>
                  </div>
                  <button
                    className={`product_button inline-flex items-center px-4 py-1 gap-2 my-5`}
                  >
                    <p className="text-[10px] text-darkPrimText uppercase">
                      Info
                    </p>
                  </button>
                </div>
              </div>
              <div className="flex items-start gap-1  py-2 px-3 border-priBlue border rounded-lg my-6">
                <ExclamationCircleIcon
                  className="w-[25px] max-md:w-[50px] text-priBlue"
                  fill="blue"
                />
                <h2 className="text-priText text-sm">
                  Investors gets locked yield if they hold till maturity,
                  however, they can sell the bond in open market or buyback
                  according to market conditions
                </h2>
              </div>
              <div className="stats w-full bg-red-60">
                <div className="selectTab text-darkPrimText mx-auto bg-red-60">
                  <ul className="flex p-[6px] bg-selectTabBg rounded-md  text-sm  justify-between ">
                    {ourProducts.map((el, index) => (
                      <li
                        key={index}
                        className={`w-6/12 md:px-[46px px-6 py-3 rounded-md cursor-pointer text-center ${
                          selectTabs[el.value]
                            ? "bg-dappHeaderBg"
                            : "less_opacity"
                        }`}
                        onClick={() => handleSelect(el.value)}
                      >
                        <p className="capitalize">{el.name}</p>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Should be for each tab */}
                {selectTabs["apy"] && (
                  <div className="text-white my-5">
                    <h1 className="font-semibold text-xl">
                      14%{" "}
                      <span className="text-sm text-darkPrimText">
                        0.3972% (Past 7d)
                      </span>
                    </h1>

                    <div className="chart_main mt-4">
                      <ul className="chart_timeline flex text-[12px] gap-1 bg-dappHeaderBg py-[5px] px-2 rounded-full w-3/12">
                        <li className="shadowBackDrop px-3 rounded-full py-[3px] cursor-pointer">
                          1m
                        </li>
                        <li className="px-3 py-[3px]">1H</li>
                        <li className="px-3 py-[3px]">1D</li>
                        <li className="px-3 py-[3px]">1W</li>
                      </ul>
                      <Charts testData={apyData} type={"apy"}/>
                    </div>
                  </div>
                )}
                {selectTabs["price"] && (
                  <div className="text-white my-5">
                    <h1 className="font-semibold text-xl">
                      $25.43{" "}
                      <span className="text-sm text-darkPrimText">
                        9.3972% (Past 7d)
                      </span>
                    </h1>

                    <div className="chart_main mt-4">
                      <ul className="chart_timeline flex text-[12px] gap-1 bg-dappHeaderBg py-[5px] px-2 rounded-full w-3/12">
                        <li className="shadowBackDrop px-3 rounded-full py-[3px] cursor-pointer">
                          1m
                        </li>
                        <li className="px-3 py-[3px]">1H</li>
                        <li className="px-3 py-[3px]">1D</li>
                        <li className="px-3 py-[3px]">1W</li>
                      </ul>
                      <Charts testData={priceData} type={"price"}/>
                    </div>
                  </div>
                )}
              </div>

              {/* <div className="flex card justify-center divide-x divide-border_pri py-4 mt-5">
                <div className="px-7 text-center">
                  <h2 className="text-darkPrimText text-sm">Liquidity</h2>
                  <h1 className="text-white brFirma_font font-semibold my-1">$6,765,900.90</h1>
                      <p className="bg-blueBg text-[13px] text-[#A586FE] text-center rounded-md px-5 mx-3">
                        +2.1%
                      </p>
                </div>
                <div className="px-7 text-center">
                  <h2 className="text-darkPrimText text-sm">24h Volume</h2>
                  <h1 className="text-white brFirma_font font-semibold my-1">$345,900.90</h1>
                      <p className="bg-blueBg text-[13px] text-[#A586FE] text-center rounded-md px-5 mx-3">
                        +2.1%
                      </p>
                </div>
                <div className="px-5 text-center">
                  <h2 className="text-darkPrimText text-sm">Underlying APY</h2>
                  <h1 className="text-white brFirma_font font-semibold my-1">0%</h1>
                      <p className="bg-blueBg text-[13px] text-[#A586FE] text-center rounded-md px-5 mx-3">
                        +0%
                      </p>
                </div>
                <div className="px-7 text-center">
                  <h2 className="text-darkPrimText text-sm">Implied APY</h2>
                  <h1 className="text-white brFirma_font font-semibold my-1">89.90%</h1>
                      <p className="bg-blueBg text-[13px] text-[#A586FE] text-center rounded-md px-5 mx-3">
                        +2.1%
                      </p>
                </div>
                <div className="px-7 text-center">
                  <h2 className="text-darkPrimText text-sm">Long Yield APY</h2>
                  <h1 className="text-white brFirma_font font-semibold my-1">89%</h1>
                      <p className="bg-blueBg text-[13px] text-[#A586FE] text-center rounded-md px-5 mx-3">
                        +0%
                      </p>
                </div>
              </div> */}
              <div className="max-lg:overflow-x-scroll mb-16">
                <div className="history text-darkPrimText mx-auto bg-red-60 mt-14  max-lg:w-[780px]">
                  <ul className="flex p-[6px] bg-selectTabBg rounded-md  text-sm  justify-between ">
                    {history.map((el, index) => (
                      <li
                        key={index}
                        className={`w-6/12 md:px-[46px px-6 py-3 rounded-md cursor-pointer text-center ${
                          historySelectTabs[el.value]
                            ? "bg-dappHeaderBg"
                            : "less_opacity"
                        }`}
                        onClick={() => handleSelectHistory(el.value)}
                      >
                        <p className="capitalize">{el.name}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="h-52 text-white text-center flex justify-center flex-col mb-20">
                <p>You have No Trade history for this market.</p>
              </div>
            </div>
          </div>
        </div>
        <MobileNav/>
        <DappFooter />
      </div>
    </>
  );
};

export default MainDapp;
