"use client";

import { ApyArrowIcon, ChervonUp, TokenLogo } from "@/app/components/assets";
import FarmDeposit from "@/app/components/modals/farm";
import DappFooter from "@/app/components/navigations/dAppFooter";
import DAppHeader from "@/app/components/navigations/dAppHeader";
import MobileNav from "@/app/components/UI-assets/mobileNav";
import { dateFormat, floatFigure } from "@/app/components/web3FiguresHelpers";
import { farms } from "@/app/constants/farmOptions";
import { numberToSCVU32 } from "@/app/helpers/format";
import {
  accountToScVal,
  getServer,
  getTxBuilder,
  numberToI128,
  numberToU32,
  readContract,
  simulateTx,
  stringToI128,
  stringToU32,
} from "@/app/helpers/soroban";
import UseStore from "@/store/UseStore";
import {
  BASE_FEE,
  Contract,
  ScInt,
  TransactionBuilder,
  xdr,
} from "@stellar/stellar-sdk";
import { ethers } from "ethers";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronUpIcon } from "@heroicons/react/24/outline";
import FarmWithdraw from "@/app/components/modals/farmWithdraw";
import RewardsWithdraw from "@/app/components/modals/withdrawRewards";
const FarmPage = () => {
  const {
    connectorWalletAddress,
    userBalance,
    selectedNetwork: currentNetwork,
    setTransactionsStatus,
    selectedPool,
    selectedNetwork,
    transactionsStatus,
    setSelectedFarmPool,
  } = UseStore();
  const provider = getServer(selectedNetwork);
  const [userFarmPositions, setUserFarmPositions] = useState([]);

  const tabOptions = [
    {
      name: "Farm",
      value: "farm",
    },
    {
      name: "My Position",
      value: "myPosition",
      count: true,
      countValue: userFarmPositions?.length,
    },
  ];
  const [selectTabs, setSelectTabs] = useState<any>({
    farm: true,
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

  const LPavailable = true;
  const [openFarmModal, setOpenFarmModal] = useState(false);
  const [openFarmWithdrawModal, setOpenFarmWithdrawModal] = useState(false);
  const [openWithdrawRewardModal, setOpenWithdrawRewardModal] = useState(false);

  const readContractFnCall = async (
    functName: string,
    args: any[] = [],
    contractAddr: string
  ) => {
    const txBuilder = await getTxBuilder(
      connectorWalletAddress!,
      BASE_FEE,
      provider,
      selectedNetwork.networkPassphrase
    );

    const result: any = await readContract(
      contractAddr,
      txBuilder,
      provider,
      connectorWalletAddress,
      functName,
      args
    );
    console.log({ [functName]: result });
    return result;
  };
  // console.log({withdrawalEnabled})
  useEffect(() => {
    if (connectorWalletAddress) {
      // readContractFnCall("get_pool_info", [numberToSCVU32(0)]);
      // readContractFnCall("get_user_info", [accountToScVal(connectorWalletAddress) , numberToSCVU32(0)], '');
      // readContractFnCall("get_global_allocated_rewards");
    }
  });

  // const signWithFreighter = async () => {
  //   setIsSubmitting(true);

  //   const txBuilderAdmin = await getTxBuilder(
  //     connectorWalletAddress,
  //     xlmToStroop(fee).toString(),
  //     provider,
  //     selectedNetwork.networkPassphrase
  //   );
  //   const xdr = await mintTokens({
  //     tokenId: contractAddress,
  //     quantity: ethers.parseUnits(depositAmount, selectedPool?.tokenDecimals).toString(),
  //     destinationPubKey: connectorWalletAddress,
  //     memo,
  //     txBuilderAdmin,
  //     server: provider,
  //   });

  //   try {
  //     // Signs XDR representing the "mint" transaction
  //     const signedTx = await signTx(xdr, connectorWalletAddress, kit);
  //     setIsSubmitting(false);
  //     setSignedXdr(signedTx);
  //   } catch (e) {
  //     setIsSubmitting(false);
  //     setConnectionError(ERRORS.UNABLE_TO_SIGN_TX);
  //   }
  // };

  //Finally submit Deposit transaction
  // const submit = async () => {
  //   setIsSubmitting(true);

  //   try {
  //     const result = await submitTx(
  //       signedXdr,
  //       selectedNetwork.networkPassphrase,
  //       provider
  //     );

  //     setTxResultXDR(result);
  //     setTransactionsStatus({deposit: true})
  //     setIsSubmitting(false);
  //     setStep(2)
  //   } catch (error) {
  //     console.log(error);
  //     setIsSubmitting(false);
  //     setConnectionError(ERRORS.UNABLE_TO_SUBMIT_TX);
  //   }
  // };

  //   useEffect(() => {
  //     const updatedPool = async () => {
  //       if(pool){
  //         const updatedPools = await Promise.all(pools.map(async (pool: any, index: number) => {
  //           const reserves = await getPoolReserve(index)
  //           const shareBalance = connectorWalletAddress && await getShareBalance(index)
  //           const maturityDate:string = await readContract("maturity", index)

  //           // console.log({[`${index}-maturityDate`]: dateFormat(maturityDate)})
  //           const now = BigInt(Math.floor(Date.now() / 1000))
  //           return {
  //             ...pool,
  //             reserves,
  //             shareBalance,
  //             maturityTimeStamp: maturityDate,
  //             expiration: dateFormat(maturityDate),
  //             position: Number(shareBalance) * 100,
  //             depositEnabled: BigInt(maturityDate) > now
  //           }
  //         }))
  //         setPools(updatedPools)
  //         setLoadPool(true)
  //       }
  //     }
  //     updatedPool()
  // }, [connectorWalletAddress,  transactionsStatus?.deposit, transactionsStatus])
  const getShareCont = async (
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
        contract.call(
          "balance",
          ...[
            accountToScVal(destinationPubKey), // id
          ]
        )
      )
      .setTimeout(30)
      .build();

    const result = await simulateTx<string>(tx, connection);
    return ethers.formatUnits(result, 7);
  };
  const getShareBalance = async (poolIndex: number) => {
    const txBuilderBalance = await getTxBuilder(
      connectorWalletAddress!,
      BASE_FEE,
      provider,
      selectedNetwork.networkPassphrase
    );

    const shareBalance: any = await getShareCont(
      farms[poolIndex].shareId,
      txBuilderBalance,
      provider,
      connectorWalletAddress
    );
    return shareBalance;
  };
  const [allFarms, setAllFarms] = useState(farms);
  useEffect(() => {
    const updatedFarms = async () => {
      if (farms) {
        const updatedFarm = await Promise.all(
          farms.map(async (farmPool: any, index: number) => {
            // const reserves = await getPoolReserve(index)
            const shareBalance =
              connectorWalletAddress && (await getShareBalance(index));
            const maturityDate: string = await readContractFnCall(
              "get_maturity_date",
              [],
              farms[index].contractAddress
            );
            const rewardAddresses: string[] = await readContractFnCall(
              "get_reward_token_addresses",
              [],
              farms[index].contractAddress
            );
            const getUserInfo: string[] = await readContractFnCall(
              "get_user_info",
              [accountToScVal(connectorWalletAddress), numberToSCVU32(0)],
              farms[index].contractAddress
            );

            // console.log({ [`FARM POOL USER INFO -> ${index}`]: getUserInfo });
            console.log({
              [`Farm timestamp - ${index}`]: [
                maturityDate,
                farms[index].contractAddress,
              ],
            });
            // Fetch the symbol for each reward address
            const rewardTokens = await Promise.all(
              rewardAddresses?.map(
                async (address: string, addrIndex: number) => {
                  const symbol = await readContractFnCall(
                    "symbol",
                    [],
                    address
                  );
                  const balance = await readContractFnCall(
                    "balance",
                    [accountToScVal(connectorWalletAddress)],
                    address
                  );
                  return { address, balance, symbol };
                }
              )
            );

            const now = BigInt(Math.floor(Date.now() / 1000));
            const farmInfo = await readContractFnCall(
              "get_pool_info",
              [numberToSCVU32(0)],
              farms[index].contractAddress
            );
            return {
              ...farmPool,
              farmInfo,
              rewardTokens,
              getUserInfo,
              // reserves,
              bondBalance: shareBalance,
              maturityTimeStamp: maturityDate,
              expiration: dateFormat(maturityDate),
              // position: Number(shareBalance) * 100,
              farmEnabled: BigInt(maturityDate) > now,
            };
          })
        );
        setAllFarms(updatedFarm);
        // setLoadPool(true)
      }
    };

    if (connectorWalletAddress) {
      updatedFarms();
    }
  }, [connectorWalletAddress, transactionsStatus?.deposit, transactionsStatus]);

  const handleFarmDeposit = (farm: any) => {
    setOpenFarmModal(true);
    setSelectedFarmPool(farm);
  };

  const handleFarmWithdraw = (farm: any) => {
    setOpenFarmWithdrawModal(true);
    setSelectedFarmPool(farm);
  };

  const handleWithdrawRewards = (farm: any) => {
    setOpenWithdrawRewardModal(true);
    setSelectedFarmPool(farm);
  };

  console.log({ allFarms });
  const userPositions = () => {
    const depositedFarm = allFarms.filter(
      (farm: any) => farm?.getUserInfo?.deposited > 0
    );
    const sortedPositions = depositedFarm.sort(
      (a: any, b: any) =>
        Number(b.getUserInfo?.deposited) - Number(a.getUserInfo?.deposited)
    );
    setUserFarmPositions(sortedPositions);
    console.log({ sortedPositions });
  };

  useEffect(() => {
    if (allFarms.length > 0) {
      userPositions();
    }
  }, [allFarms]);

  const [togglePool, setTogglepool] = useState<any>([]);

  const handleToggle = (index: number) => {
    setTogglepool((prevToggles: any) => {
      const newToggleArr = [...prevToggles];
      newToggleArr[index] = !newToggleArr[index];
      return newToggleArr;
    });
  };

  const sumAccruedRewards = (farm: any) => {
    const accrued_rewards1 = farm?.getUserInfo.accrued_rewards1
    const accrued_rewards2 = farm?.getUserInfo.accrued_rewards2

    const sumRewards = accrued_rewards1 + accrued_rewards2

    return floatFigure(
      Number(
        ethers.formatUnits(
          sumRewards,
          7
        )
      ),
      2
    )
  }
  // const handleGetInfo = async () => {
  //   try {
  //     const getUserInfo: string[] = await readContractFnCall(
  //       "get_user_info",
  //       [accountToScVal(connectorWalletAddress), numberToSCVU32(0)],
  //       "CCLQZHAB3JMGOVB54JSWMLG6JLGJZE4LIHCYSJGMODJYUIUJBR4O2SHM"
  //     );
  //     console.log({ ETHDEC: getUserInfo });
  //     return getUserInfo;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // handleGetInfo();
  return (
    <>
      <div className="dapp h-screen">
        <DAppHeader />
        <div className="lg:w-10/12 md:max-lg:w-10/12 mx-auto md:pt-24 pt-8 px-5  max-w-[1500px] z-10">
          <div className="md:flex justify-between items-center mb-20 mt-10">
            <div className="max-md:mb-8">
              <h2 className="text-white font-semibold text-lg ">
                Farm Positions
              </h2>
              <p className="text-gray-400 text-sm">
                Farm LP tokens to receive rewards
              </p>
            </div>

            <div className="buttons text-blueish text-sm w-[328px] max-md:w-full border-2 border-border_pri rounded-xl flex">
              {tabOptions.map((tab, index) => (
                <button
                  onClick={() => handleSelect(tab.value)}
                  className={`py-2 max-md:py-3 w-1/2 flex items-center justify-center gap-2  ${
                    selectTabs[tab.value] && "shadow_button"
                  }`}
                  key={`ttab-${index}`}
                >
                  <h2>{tab.name}</h2>
                  {tab?.count && (
                    <span
                      className={`product_button flex justify-center items-center p-[2px] w-6 h-6 gap-2 rounded-full`}
                    >
                      <p className="text-sm text-gray-400 uppercase ">
                        {tab?.countValue}
                      </p>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
          {selectTabs["farm"] && (
            <>
              {allFarms.map((farm: any, index: number) => (
                <div
                  key={`farm-${index * 8}`}
                  className="farm card1 max-w-[1500px] mx-auto px-4 max-md:px-5 py-4 mb-6 border-b border-gray-700 flex max-md:flex-col items-center md:divide-x max-md:divide-y divide-gray-600 rounded-xl"
                >
                  <>
                    {Number(farm?.bondBalance) > 0 ? (
                      <div className="avaliable flex max-md:flex-col max-md:justify-center max-md:items-center max-md:text-center items-start gap-3 md:w-1/2 md:py-3 max-md:pt-7 px-5 ">
                        <div className="token">
                          <Image
                            src={TokenLogo}
                            width={30}
                            height={21}
                            alt="token"
                          />
                        </div>
                        <div className="">
                          <h2 className="text-white md:text-sm text-md mb-1">
                            {farm.name} Available for farming
                          </h2>
                          <div className="text-gray-400 text-lg max-md:text-xl brFirma_font mb-3 max-md:mt-3 max-md:mb-5">
                            <p>
                              <span className="text-white font-semibold">
                                {farm?.bondBalance ? (
                                  farm?.bondBalance
                                ) : (
                                  <div className="w-[60px] skeleton py-3 animate-puls shadow-md"></div>
                                )}
                              </span>
                              <span className="text-blueish text-sm font-normal ml-2">
                                Bonds
                              </span>
                            </p>
                          </div>
                          <h2 className="text-blueish text-sm ">Get More</h2>
                        </div>
                      </div>
                    ) : (
                      <div className="unavaliable flex max-md:flex-col items-center gap-3 md:w-1/2 max-md:text-center py-5">
                        <div className="token max-md:my-4">
                          <Image
                            src={TokenLogo}
                            width={77}
                            height={55}
                            alt="token"
                          />
                        </div>
                        <div className="">
                          <h2 className="text-white font-semibold text-md">
                            You don’t have LP tokens for farm yet
                          </h2>
                          <p className="text-gray-400 text-sm">
                            Your available LP will appear here once you provide
                            liquidity
                          </p>
                        </div>
                      </div>
                    )}
                  </>

                  <div className="get_LP_tokens flex items-center gap-3 w-1/2 max-md:w-full px-5 py-3 justify-between max-md:my-7 max-md:pt-7 ">
                    <div className="rewards text-gray-400 text-md">
                      <h2 className="text-md mb-2 max-sm:text-sm">
                        Rewards :bhUSD
                      </h2>
                      <p className="text-md max-sm:text-sm mb-2 ">Farm APR</p>
                      <p className="text-md max-sm:text-sm">Maturity</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-10 ">
                      <div className="APY text-blueish  w-5/12 brFirma_font">
                        <h1 className="text-md">12.65%</h1>
                        <div className="time_tag flex items-center gap-1 py-[3px] px-[5px] w-[150px] my-3">
                          <Image
                            src={ApyArrowIcon}
                            width={14}
                            height={14}
                            alt="right"
                            className=""
                          />{" "}
                          <p className="text-[13px]  text-[#A586FE]">
                            2.1% vs. last month
                          </p>
                        </div>
                        <h1 className="text-md">
                          {farm.expiration ? (
                            farm.expiration
                          ) : (
                            <div className="w-[60px] skeleton py-3 animate-puls shadow-md"></div>
                          )}
                        </h1>
                      </div>
                      {farm?.bondBalance > 0 ? (
                        <button
                          className={`px-5 py-1 text-[12px] max-md:hidden ${
                            !connectorWalletAddress || !farm.farmEnabled
                              ? "hover:bg-transparent button1"
                              : "button2"
                          }`}
                          onClick={() => handleFarmDeposit(farm)}
                          disabled={!farm.farmEnabled}
                        >
                          Farm
                        </button>
                      ) : (
                        <Link href={"/app"} target="_blank">
                          <button className="button2 px-5 py-1 text-[12px] max-md:hidden">
                            Get LP tokens
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                  {farm?.lp > 0 ? (
                    <button
                      className="button2 px-5 py-3 text-md max-md:block hidden w-full "
                      onClick={() => handleFarmDeposit(farm)}
                      disabled={!connectorWalletAddress}
                    >
                      Farm
                    </button>
                  ) : (
                    <button className="button2 px-5 py-3 text-md max-md:block hidden w-full "
                    disabled={!connectorWalletAddress}
                    >
                      Get LP tokens
                    </button>
                  )}
                </div>
              ))}
            </>
          )}

          {selectTabs["myPosition"] && (
            <>
              {userFarmPositions.length > 0 ? (
                userFarmPositions?.map((farm: any, index: number) => (
                  <div key={index} className="farm card1 max-w-[1500px] mx-auto px-7 max-md:px-5 py-4 mb-6 border-b border-gray-700 rounded-xl">
                    <div
                      key={`farm-${index * 8}`}
                      className={`head flex max-md:flex-col items-center justify-between  ${
                        togglePool[index] && "border-b border-gray-700"
                      }`}
                    >
                      <div className="avaliable flex max-md:flex-col max-md:justify-center items-center max-md:text-center items-start gap-3 md:py-3 max-md:pt-7  ">
                        <Image
                          src={TokenLogo}
                          width={60}
                          height={21}
                          alt="token"
                        />
                        <h1 className="text-white md:text-sm text-lg font-semibold">
                          {farm.name} Position
                        </h1>
                      </div>

                      <div className="get_LP_tokens flex items-center gap-3 max-md:w-full py-3 justify-between max-md:my-7 max-md:pt-7 ">
                        <div className="flex flex-wrap items-center justify-between gap-10 ">
                          <div className="APY text-blueish  w-5/12 brFirma_font">
                            <p>
                              <span className="text-blueish text-sm font-normal mr-2">
                                Deposited
                              </span>
                              <span className="text-white font-semibold">
                                {Number(
                                  ethers.formatUnits(
                                    farm?.getUserInfo?.deposited,
                                    7
                                  )
                                )}
                              </span>
                              <span className="text-blueish text-sm font-normal ml-2">
                                BONDS
                              </span>
                            </p>
                            <div className="time_tag flex items-center gap-1 py-[3px] px-[5px] w-[150px] my-1">
                              <Image
                                src={ApyArrowIcon}
                                width={14}
                                height={14}
                                alt="right"
                                className=""
                              />{" "}
                              <p className="text-[13px]  text-[#A586FE]">
                                2.1% vs. last month
                              </p>
                            </div>
                          </div>
                          <motion.button
                            className="farmToggleBtn w-8 h-8 text-[12px] max-md:hidden"
                            initial={false}
                            animate={{ rotate: togglePool[index] ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            onClick={() => handleToggle(index)}
                          >
                            <ChevronUpIcon width={24} height={22} />
                          </motion.button>
                        </div>
                      </div>

                      {/* Mobile Button */}
                      <motion.button
                        className="button2 px-5 py-3 text-md hidden w-full max-md:flex items-center justify-center gap-1"
                        onClick={() => handleToggle(index)}
                      >
                        <motion.div
                          className=""
                          initial={false}
                          animate={{ rotate: togglePool[index] ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronUpIcon width={24} height={22} />
                        </motion.div>

                        <p>
                          {togglePool[index] ? "Less Details" : "More Details"}
                        </p>
                      </motion.button>
                    </div>

                    {togglePool[index] && (
                      <div className="positionDetails flex justify-between mt-5 md:items-end max-md:flex-col-reverse max-md:mt-10">
                        <div className="">
                          <button
                            className="button1 px-10 py-2 text-[12px] max-md:w-full max-md:py-4"
                            onClick={() => handleFarmWithdraw(farm)}
                          >
                            Remove From Farm
                          </button>

                          <button
                            className="button1 px-10 py-2 text-[12px] max-md:w-full max-md:py-4 ml-2"
                            onClick={() => handleWithdrawRewards(farm)}
                          >
                            Withdraw Rewards Only
                          </button>
                        </div>

                        <div className="md:w-4/12">
                          <div className="usdtProvided flex justify-between text-gray-400 text-md ">
                            <h2 className="text-md mb-2 max-sm:text-sm">
                              Last Time Deposited
                            </h2>
                            <p className="text-md max-sm:text-sm mb-2 ">
                              {dateFormat(farm?.getUserInfo.deposit_time)}
                            </p>
                          </div>

                          {/* ACCRUED ONE & TWO */}
                          <div className="usdtProvided flex justify-between text-gray-400 text-md ">
                            <h2 className="text-md mb-2 max-sm:text-sm">
                              Accrued Reward One
                            </h2>
                            <p className="text-md max-sm:text-sm mb-2 ">
                              {floatFigure(
                                Number(
                                  ethers.formatUnits(
                                    farm?.getUserInfo.accrued_rewards1,
                                    7
                                  )
                                ),
                                2
                              )}{" "}
                              USDT
                            </p>
                          </div>
                          <div className="usdtProvided flex justify-between text-gray-400 text-md ">
                            <h2 className="text-md mb-2 max-sm:text-sm">
                              Accrued Reward Two
                            </h2>
                            <p className="text-md max-sm:text-sm mb-2 ">
                              {floatFigure(
                                Number(
                                  ethers.formatUnits(
                                    farm?.getUserInfo.accrued_rewards2,
                                    7
                                  )
                                ),
                                2
                              )}{" "}
                              USDT
                            </p>
                          </div>

                          {/* ACCRUED ONE & TWO */}
                          <div className="usdtProvided flex justify-between text-gray-400 text-md ">
                            <h2 className="text-md mb-2 max-sm:text-sm">
                              Accrued Rewards (USDT)
                            </h2>
                            <p className="text-md max-sm:text-sm mb-2 ">
                              {sumAccruedRewards(farm)}
                              USDT
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="farm card1 max-w-[1500px] mx-auto px-4 py-4 mb-6 border-b border-gray-700 flex items-center divide-x divide-gray-600 h-[437px]">
                  <div className="h-52 text-white text-center flex justify-center items-center flex-col mb-20 mx-auto gap-6">
                    <Image src={TokenLogo} width={200} height={164} alt="" />
                    <div className="">
                      <h2 className="text-white font-semibold text-md">
                        You don’t have any positions yet
                      </h2>
                      <p className="text-gray-400 text-sm">
                        Once you stake LP tokens, your farming positions will
                        appear here
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {openFarmModal && <FarmDeposit setOpenState={setOpenFarmModal} />}
        {openFarmWithdrawModal && (
          <FarmWithdraw setOpenState={setOpenFarmWithdrawModal} />
        )}
        {openWithdrawRewardModal && <RewardsWithdraw setOpenState={setOpenWithdrawRewardModal}/>}
        <MobileNav />
        <DappFooter />
      </div>
    </>
  );
};

export default FarmPage;
