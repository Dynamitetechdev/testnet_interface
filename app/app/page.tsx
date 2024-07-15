"use client"
import Image from "next/image";
import DAppHeader, { kit } from "../components/navigations/dAppHeader";
import Header from "../components/navigations/header";
import {
  AnalyticsIcon,
  ApyArrowIcon,
  BTCBgLogo,
  Calendar,
  ChervonUp,
  EthBgWhiteLogo,
  InvestIcon,
  SortIcon,
  UsdcBgLogo,
  chervonRight,
} from "../components/assets";
import { DappChart, MediumChartBg, MobileDappChart } from "../components/assets/bg";
import { ChevronRightIcon, RectangleGroupIcon } from "@heroicons/react/24/outline";
import DappFooter from "../components/navigations/dAppFooter";
import DepositFunds from "../components/modals/deposit";
import React, { memo, useEffect, useState } from "react";
import { BASE_FEE, accountToScVal, getEstimatedFee, getServer, getTxBuilder, mintTokens, simulateTx, submitTx } from "../helpers/soroban";
import { TESTNET_DETAILS, signTx } from "../helpers/network";
import { Contract, TransactionBuilder } from "@stellar/stellar-sdk";
import UseStore from "@/store/UseStore";
import { ethers } from "ethers";
import { stroopToXlm, xlmToStroop } from "../helpers/format";
import { ERRORS } from "../helpers/error";
import { pool } from "../constants/poolOptions";
import WithdrawFunds from "../components/modals/withdraw";
import Link from "next/link";
import { formatFigures } from "../components/web3FiguresHelpers";
import { GetAPY } from "../dataService/dataServices";
import Loading from "../components/UI-assets/loading";
import { Tooltip } from "react-tooltip";
import { getNetworkDetails } from "@stellar/freighter-api";
const MainDapp = () => {
  const {setConnectorWalletAddress, connectorWalletAddress, poolReserve, setPoolReserve,transactionsStatus,setSelectedPool, selectedPool,selectedNetwork} = UseStore()
  const [openState, setOpenState] = useState(false)
  const [openWithdrawState, setOpenWithdrawState] = useState(false)
  const [shareBalance, setShareBalance] = useState<any>(null)
  const [loadPool, setLoadPool] = useState(false)
  // const [selectedNetwork] = React.useState(TESTNET_DETAILS);
  // const [pools, setPools] = useState<any>(pool ? pool : [])
  const [pools, setPools] = useState(pool);
  const [sortOrder, setSortOrder] = useState('asc'); 
  const [loadingApy, setLoadingApy] = useState(true)

  const provider = getServer(selectedNetwork);
  const getReserveContractCal = async (
    id: string,
    txBuilder: TransactionBuilder,
    connection: any,
    destinationPubKey: string | null = null,
  ) => {
    const contract = new Contract(id);
    if ( !destinationPubKey ) {
      return false;
    }
    const tx = txBuilder
      .addOperation(
        contract.call("total_deposit"),
      )
      .setTimeout(30)
      .build();

    const result = await simulateTx<string>(tx, connection);
    // return ethers.formatUnits(result, pool[[0].tokenDecimals);
    return ethers.formatUnits(result, 7);
  }; 


  const getPoolReserve = async (poolIndex: number) => {
    const txBuilderBalance = await getTxBuilder(
      connectorWalletAddress!,
      BASE_FEE,
      provider,
      selectedNetwork.networkPassphrase
    );

    const poolReserve: any = await getReserveContractCal(pool[poolIndex].contractAddress, txBuilderBalance, provider, connectorWalletAddress);
    setPoolReserve({[poolIndex]: parseFloat(poolReserve).toFixed(2).toString()})
    return poolReserve
  }
  // console.log({allPools: allPools[0]})

  // Share Balance
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

    const shareBalance: any = await getShareCont(pool[poolIndex].shareId, txBuilderBalance, provider, connectorWalletAddress);
    setShareBalance({[poolIndex]:shareBalance})
    return shareBalance
  }

  useEffect(() => {
    const interval = setInterval( async () => {
      const {data} = await GetAPY("https://bondexecution.onrender.com/monitoring/getYields")
      if(data) setLoadingApy(false)
      setPools((prevPools: any) =>
        prevPools.map((pool: any, index: any) => ({ ...pool, apy: data.data[index].averageYieldPostExecution?.upper }))
      );
    }, 10000);
  
    return () => clearInterval(interval);
  }, []);
console.log({selectedNetwork})
  useEffect(() => {
      const updatedPool = async () => {
        if(connectorWalletAddress && pool){
          const updatedPools = await Promise.all(pools.map(async (pool: any, index: number) => {
            const reserves = await getPoolReserve(index)
            const shareBalance = await getShareBalance(index)
            const maturityDate = await readContract("maturity", index)
            const now = BigInt(Math.floor(Date.now() / 1000))
            return {
              ...pool,
              reserves,
              shareBalance,
              position: Number(shareBalance) * 100,
              depositEnabled: BigInt(maturityDate) > now
            }
          }))
          setPools(updatedPools)
          setLoadPool(true)
        }
      }
      updatedPool()
  }, [connectorWalletAddress,  transactionsStatus?.deposit, transactionsStatus])

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
      const readContract = async (functName: string, index: number) => {
        const txBuilderBalance = await getTxBuilder(
          connectorWalletAddress!,
          BASE_FEE,
          provider,
          selectedNetwork.networkPassphrase
        );
    
        const result: any = await readContIntr(pool[index].contractAddress, txBuilderBalance, provider, connectorWalletAddress, functName);
        const now = BigInt(Math.floor(Date.now() / 1000))
        return result
      }

  const sortFunc = (type: string) => {
    if(type === "apy"){
      setPools((prevPools: any) => {
        const sortedPools = [...prevPools].sort((a, b) => {
          if (sortOrder === 'asc') {
            return parseFloat(a.apy) - parseFloat(b.apy);
          } else {
            return parseFloat(b.apy) - parseFloat(a.apy);
          }
        });
        console.log({sortedPools})
        return  {sortedPools};
      });
      setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
    } else{
      setPools((prevPools: any) => {
        const sortedPools = [...prevPools].sort((a, b) => {
          if (sortOrder === 'asc') {
            return parseFloat(a.reserves) - parseFloat(b.reserves);
          } else {
            return parseFloat(b.reserves) - parseFloat(a.reserves);
          }
        });
        console.log({sortedPools})
        return {sortedPools};
      });
      setSortOrder(prevOrder => (prevOrder === 'asc' ? 'desc' : 'asc'));
    }
  };
  const [isTestnet, setIsTestnet] = useState<any>(null)
  useEffect(() => {
    const getNetwork = async () => {
      const networkDetails = await getNetworkDetails()
      console.log({networkDetails})
      if(networkDetails.network == "PUBLIC"){
        setIsTestnet(false)
      } else if(networkDetails.network == "TESTNET"){
        setIsTestnet(true)
      } else{
        setIsTestnet(null)
      }
      console.log({networkDetails: networkDetails.network})
    }
    getNetwork()
  }, [])
  return (
    <>
    <div className="dapp">
      <DAppHeader />

      <div className="md:w-9/12 md:max-lg:w-11/12 mx-auto md:pt-24 pt-8 px-5">
      {
        !isTestnet && <div className="card max-w-[1100px] mx-auto px-4 text-lg text-center py-9 mb-6">
        <p className="text-red-500 text-3xl">You are connected to the wrong network.</p>
        <Link href={"https://mainnet-bondhive.vercel.app/app"} target="_blank"><p className=" text-white underline">Link to use Mainnet</p></Link>
      </div>
      }
      <div className="card max-w-[1100px] mx-auto px-4 text-center py-3 mb-6 flex items-center justify-center gap-3">
        <p className="text-white">Use Mainnet</p>
        <Link href={"/"}><p className=" text-white underline ">Link to use Mainnet</p></Link>
      </div>
      <div className="card max-w-[1100px] mx-auto px-4 text-center py-3 mb-6 flex items-center justify-center gap-3">
        <p className="text-white text-1xl">Go to Faucet for 100 USDC (test token)</p>
        <Link href={"/app/faucet"}><p className=" text-white underline ">Faucet</p></Link>
      </div>
        {/* three cards */}
        <div className="max-sm:max-w-10/12 max-sm:overflow-x-scroll max-w-[1100px] mx-auto">
          <div className=" max-sm:gri flex grid-cols-3 md:gap-6 gap-3 max-sm:w-[850px ">
            <div className="eth_avg max-sm:w-6/12 max-sm:h-[184px] w-6/12 h-[136px] card relative overflow-hidden">
              <div className="flex justify-between items-center md:p-4 p-2">
                <div className="">
                  <div className="flex items-center gap-2">
                    <Image
                      src={EthBgWhiteLogo}
                      width={16}
                      height={16}
                      alt="EthBgWhiteLogo"
                    />
                    <h2 className="text-[9px] text-darkPrimText">
                      ETH Avg Yield
                    </h2>
                    <div className="time_tag flex items-center gap-1 py-[3px] px-[5px]">
                      <div className="w-[14px] max-sm:w-[7px] max-sm:h-[7px] h-[14px] relative">
                        <Image
                          src={Calendar}
                          layout="fill"
                          alt=""
                          className="w-full rounded-t-lg object-center object-cover "
                          objectFit="cover"
                          objectPosition="center"
                        />
                      </div>
                      <p className="text-[6px] text-[#A586FE]">Mar-24</p>
                    </div>
                  </div>
                  <h1 className="text-[20px] text-white mt-2 brFirma_font">13.61%</h1>
                </div>
              </div>
              <div className="mt-7">
                <div className="absolute bottom-0  max-sm:hidden">
                <div className="w-[534px] h-[134px] relative">
                        <Image
                          src={DappChart}
                          layout="fill"
                          alt=""
                          className="object-center"
                          objectFit="cover"
                          objectPosition="center"
                        />
                      </div>
                </div>
                <Image
                  src={MobileDappChart}
                  width={274}
                  height={104}
                  alt="right"
                  className="absolute bottom-0 max-sm:block hidden"
                />
              </div>
            </div>
            <div className="btc_avg max-sm:w-6/12 max-sm:h-[184px] w-6/12 h-[136px] card relative overflow-hidden">
              <div className="flex justify-between items-center md:p-4 px-2 max-sm:py-2">
                <div className="">
                  <div className="flex items-center gap-2">
                    <Image
                      src={BTCBgLogo}
                      width={16}
                      height={16}
                      alt="EthBgWhiteLogo"
                    />
                    <h2 className="text-[9px] text-darkPrimText">
                      BTC Avg Yield
                    </h2>
                    <div className="time_tag flex items-center gap-1 py-[3px] px-[5px]">
                      <div className="w-[14px] max-sm:w-[7px] max-sm:h-[7px] h-[14px] relative">
                        <Image
                          src={Calendar}
                          layout="fill"
                          alt=""
                          className="w-full rounded-t-lg object-center object-cover "
                          objectFit="cover"
                          objectPosition="center"
                        />
                      </div>
                      <p className="text-[8px] text-[#A586FE]">March-24</p>
                    </div>
                  </div>
                  <h1 className="text-[20px] text-white mt-2 brFirma_font">20.61%</h1>
                </div> 
              </div>
              <div className="mt-7">
                <div className="absolute bottom-0  max-sm:hidden">
                <div className="w-[534px] h-[134px] relative">
                        <Image
                          src={DappChart}
                          layout="fill"
                          alt=""
                          className="object-center"
                          objectFit="cover"
                          objectPosition="center"
                        />
                      </div>
                </div>
                <Image
                  src={MobileDappChart}
                  width={274}
                  height={104}
                  alt="right"
                  className="absolute bottom-0 max-sm:block hidden"
                />
              </div>
            </div>
            {/* <div className="liquid_staking max-sm:h-[184px] w-[538px] w-6/12 card relative overflow-hidden">
              <div className="flex justify-between items-center p-4">
                <div className="">
                  <div className="flex items-center">
                    <p className="inner-tag text-center shadowBackDrop text-secText px-3 py-1 text-[12px]">
                      Ecosystem update
                    </p>
                  </div>
                  <h1 className="text-[20px] text-white mt-5">
                    Liquid Staking Vaults are Live!
                  </h1>
                </div>
              </div>
              <div className="">
                <div className="w-[159px] max-sm:w-[200px] max-sm:h-[180px] h-[136px] absolute bottom-0 right-0 max-sm:-right-5">
                  <Image
                    src={"/PNG/dappEnergy.png"}
                    layout="fill"
                    alt=""
                    className="w-full rounded-t-lg object-center object-cover "
                    objectFit="cover"
                    objectPosition="center"
                  />
                </div>
              </div>
            </div> */}
          </div>
        </div>
        {/* Investment pools */}
        <div className="my-16 max-w-[1100px] mx-auto">
          <div className="title_arrange flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <h1 className="text-white">Investment pools</h1>
              <p className="text-secText inner-tag shadowBackDrop text-center py-1 px-3 text-[12px]">
                {pool.length} available{" "}
              </p>
            </div>
          </div>
          <div className="table w-full mt-5">
            <div className="table_heading text-blueish p-4 flex justify-between items-center mb-5">
              <div className="flex items-center gap-2 w-4/12  max-sm:w-7/12">
                <h2 className="text-[15px]">Strategy</h2>
              </div>
              <div className="flex items-center gap-2 w-3/12  max-sm:w-5/12">
                <h2 className="text-[15px]">APY</h2>
                <div className="cursor-pointer" onClick={() => sortFunc("apy")}>
                <Image
                  src={SortIcon}
                  width={14}
                  height={14}
                  alt="right"
                  className="apy_sort"
                />
                </div>
              </div>
              <div className="flex items-center gap-2 w-3/12 max-lg:hidden">
                <h2 className="text-[15px]">Deposit Asset</h2>
              </div>
              <div className="flex items-center gap-2 w-3/12 max-lg:hidden">
                <h2 className="text-[15px]">Reserves</h2>
                <div className="cursor-pointer" onClick={() => sortFunc("reserves")}>
                <Image
                  src={SortIcon}
                  width={14}
                  height={14}
                  alt="right"
                  className=""
                />
              </div>
              </div>
              <div className="flex items-center gap-2 w-3/12 max-lg:hidden">
                <h2 className="text-[15px]">Maturity</h2>
              </div>
              <div className="flex items-center gap-2 w-3/12 max-lg:hidden">
                <h2 className="text-[15px]">Actions</h2>
              </div>
            </div>
            {
          loadPool && isTestnet ? (
            <div className="table_pool_container max-lg:hidden">
              {pools.map((pool: any, index: number) => (
                <div
                  className={`table_pool flex items-start px-4 border-border_pri pb-3 pt-6 ${
                    index !== 0 && "border-t"
                  }`}
                  key={`${index}--pool`}
                >
                  <div className="strategy_Names w-4/12 bg-red-60">
                    <div className="flex items-center mb-3 gap-2">
                      <Image
                        src={pool.img}
                        width={38}
                        height={38}
                        alt="right"
                        className=""
                      />
                      <div className="">
                        <h1 className="text-white text-[16px]">
                          {pool.name}
                        </h1>
                        <p className="text-darkPrimText text-sm mt-2">Minimum <span className="text-blueish">${pool.minimum}</span></p>
                      </div>
                    </div>

                  </div>
                  <div className="APY text-blueish  w-3/12">
                    <h1 className="text-[16px] mb-1 ">                      {loadingApy ? <div className="w-[60px] skeleton py-3 animate-puls shadow-md"></div> : pool.apy}</h1>
                    <div className="time_tag flex items-center gap-1 py-[3px] px-[5px] w-[150px]">
                      {" "}
                      <Image
                        src={ApyArrowIcon}
                        width={14}
                        height={14}
                        alt="right"
                        className=""
                      />{" "}
                      <p className="text-[13px] text-[#A586FE]">
                        2.1% vs. last month
                      </p>
                    </div>
                  </div>
                  <div className="Deposit_asset text-blueish w-3/12 flex items-center">
                    <div className="asset_logo ">
                      <Image
                        src={UsdcBgLogo}
                        width={25}
                        height={25}
                        alt="token-img"
                        className=""
                      />
                    </div>
                    <h1 className="text-[15px] ">{pool.tokenSymbol}</h1>
                  </div>
                  <div className="minimum text-blueish w-3/12">
                    <h1 className="text-[16px] mb-2 ">${formatFigures(pool.reserves,2)}</h1>
                  </div>
                  <div className="maturity text-blueish w-3/12">
                    <h1 className="text-[16px] mb-2 ">{pool.expiration}</h1>
                  </div>
                  <div className="flex flex-col gap-4 items-cente w-3/12">
                  <button
                      className={"button1 px-9 py-[7px] gap-1 hover:bg-transparent cursor-pointer"}
                      onClick={() => {
                        setOpenWithdrawState(true)
                        setSelectedPool(pool)
                      }}
                      disabled={!connectorWalletAddress || Number(selectedPool.shareBalance) <= 0}
                    >
                      {
                        !shareBalance && connectorWalletAddress ? <div className="flex justify-center">
                          <Loading/>
                        </div>  :                      <p className="text-sm text-center"> My position</p>
                      }
                    </button>
                    <button
                      className={` inline-flex items-center px-[60px] py-[7px] gap-1 mx-auto ${!connectorWalletAddress || !pool.
                        depositEnabled ? "hover:bg-transparent button1": "button2" }`}
                      onClick={() => {
                        setOpenState(true)
                        setSelectedPool(pool)
                      }}
                      disabled={!connectorWalletAddress || !pool.
                        depositEnabled}
                        id={!pool.
                        depositEnabled ? "depositDisabled" : ''}
                    >
                      <p className="text-sm">Invest</p>
                      <Image
                        src={chervonRight}
                        width={13}
                        height={13}
                        alt="chervonRight"
                      />
                    </button>
                    </div>
                </div>
              ))}
            </div>
                      ) : <div className="h-80 flex justify-center items-center gap-2"> <Loading/><p className="text-white">Loading Pools...</p></div>
                    }
            {/*Mobile Pool Strategies */}
            {
          loadPool && isTestnet ? (
            <div className="table_pool_container_mobile flex-col gap-4 hidden max-lg:flex">
              {pool.map((pool: any, index:number) => (
                <div
                  className="table_pool_container p-5 text-secText"
                  key={`${index}--pool`}
                >
                  <div className="flex border-border_pri border-b pb-3 justify-between">
                    <div className="flex items-center mb-4 gap-2 ">
                      <Image
                        src={pool.img}
                        width={38}
                        height={38}
                        alt="right"
                        className=""
                      />
                      <div className="">
                        <h1 className="text-white text-[16px]">
                          {" "}
                          {pool.name}
                        </h1>
                      </div>
                    </div>
                    <div className="APY text-blueish  ">
                      <h1 className="text-[16px] mb-1 ">
                      {loadingApy ? <div className="w-[60px] skeleton py-3 animate-puls shadow-md"></div> : pool.apy}
                        </h1>
                      <div className="time_tag flex items-center gap-1 py-[3px] px-[5px] w-[150px]">
                        {" "}
                        <Image
                          src={ApyArrowIcon}
                          width={14}
                          height={14}
                          alt="right"
                          className=""
                        />{" "}
                        <p className="text-[12px] text-[#A586FE]">
                          2.1% vs. last month
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-[16px] py-4">
                    <div className="maturity flex justify-between">
                      <p className="">Maturity</p>
                      <p className=" text-paraDarkText">
                        <span className="text-blueish mr-2 text-right">
                          {pool.expiration}
                        </span>
                      </p>
                    </div>
                    <div className="deposit_assets flex justify-between items-center my-4">
                      <p className="">Deposit assets</p>
                      <div className="Deposit_asset text-blueish  flex flex items-center gap-1">
                        <div className="asset_logo ">
                          <Image
                            src={UsdcBgLogo}
                            width={25}
                            height={25}
                            alt="token-img"
                            className="relative z-9"
                          />
                        </div>
                        <h1 className="text-[16px]">
                        {pool.tokenSymbol}
                        </h1>
                      </div>
                    </div>
                    <div className="min_invest flex justify-between items-center">
                      <p className="">Minimum Inv.</p>
                      <p className=" text-blueish">
                        $100
                      </p>
                    </div>
                  </div>
                  <button
                    className={`w-full button1 flex items-center justify-center px-9 py-3 gap-1 hover:bg-transparent `}
                    onClick={() => {
                      setOpenWithdrawState(true)
                      setSelectedPool(pool)
                    }}
                    disabled={!connectorWalletAddress || Number(selectedPool.shareBalance) <= 0}
                  >
                                          {
                        !shareBalance && connectorWalletAddress ? <div className="flex justify-center">
                          <Loading/>
                        </div>  :  <div className="flex items-center gap-1">
                        <p className="text-sm text-center"> My position</p>
                        <ChevronRightIcon className="w-[13px] h-[20px] "/>
                          </div>
                      }

                  </button>
                  <button
                    className={`w-full mt-3 flex items-center justify-center px-9 py-3 gap-1 ${!connectorWalletAddress || !pool.
                        depositEnabled ? "hover:bg-transparent button1": "button2" }`}
                    onClick={() => {
                      setOpenState(true)
                      setSelectedPool(pool)
                    }}
                    disabled={!connectorWalletAddress || !pool.
                      depositEnabled}
                      id={!pool.
                      depositEnabled? "depositDisabled" : ''}
                  >
                    <p className="text-sm">Invest Now</p>
                    <ChevronRightIcon className="w-[13px] h-[13px] h-[20px] pt-1"/>
                  </button>
                </div>
              ))}
            </div>
            ) : <div className="h-80 justify-center items-center gap-2 hidden max-lg:flex"> <Loading/><p className="text-white">Loading Pools...</p></div>
          }

          </div>
        </div>
      </div>
      <div className="bg-[#170a28] border-t border-dappHeaderBorder fixed z-[999] w-full bottom-0 py-6 hidden max-lg:block">
          <ul className="flex justify-center gap-10 pl-3">
          <Link href={"/app"}>
            <li className="flex items-center gap-2">
              <Image
                src={InvestIcon}
                width={20}
                height={20}
                alt="InvestIcon"
                className=""
              />
              <p className="text-[#937ED6]">Invest</p>
            </li>
            </Link>
            <Link href={"/app/markets"}>
              <li className="flex items-center gap-2">
                <Image
                  src={AnalyticsIcon}
                  width={20}
                  height={20}
                  alt="InvestIcon"
                  className=""
                />
                <p className="text-paraDarkText">Markets</p>
              </li>
            </Link>
          </ul>
        </div>
      <DappFooter />
    </div>

    {
      openState &&     <DepositFunds setOpenState={setOpenState}/>
    }
    {
      openWithdrawState && <WithdrawFunds setOpenState={setOpenWithdrawState}/>
    }
    {/* {
      !pool.
      depositEnabled &&                 <div className="text-[13px] ">
      <Tooltip anchorSelect="#depositDisabled" content="Pool Has Expired." className="max-w-[200px] text-center text-[10px]" />
      </div>
    } */}
    </>
  );
};

export default MainDapp;
