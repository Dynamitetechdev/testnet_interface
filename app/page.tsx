"use client";
import Image from "next/image";
import {
  ApyArrowIcon,
  ArrowRight,
  BTCBgLogo,
  Calendar,
  ChervonUp,
  Dot,
  EthBgWhiteLogo,
  StellarBrand,
  TransparentIcon,
  UsdcBgLogo,
  Vector1,
  Vector2,
  Vector3,
  Vector4,
  chervonRight,
} from "./components/assets";
import Partners from "./components/UI-assets/partners/partners";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Footer from "./components/navigations/footer";
import { EcpliseGlow, MediumChartBg } from "./components/assets/bg";
import Header from "./components/navigations/header";
import Link from "next/link";
import OurProducts from "./components/UI-assets/ourProducts";
import {
  ChevronRightIcon,
  LockClosedIcon,
  SwatchIcon,
} from "@heroicons/react/24/outline";
import { GetAPY } from "./dataService/dataServices";
import { pool } from "./constants/poolOptions";
import UseStore from "@/store/UseStore";
const getAnimationVariants = (delay: Number) => {
  const variants: any = {
    in: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeInOut", delay: delay },
    },
    out: {
      y: 20, // adjust as needed
      opacity: 0,
    },
  };
  return variants;
};
export default function Home() {
  const { setAllPools, selectedNetwork } = UseStore();
  const cardHoverVariants = {
    in: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: "easeInOut", delay: 1.1 },
    },
    out: {
      y: 20, // adjust as needed
      opacity: 0,
    },
    hover: {
      y: -10,
      transition: { duration: 0.3, ease: "easeInOut", delay: 0 },
    },
  };
  const heroRef: any = useRef(null);
  const featuresRef: any = useRef(null);
  const howItWorksRef: any = useRef(null);
  const chartRef: any = useRef(null);
  const historyYield1: any = useRef(null);
  const historyYield2: any = useRef(null);
  const faqRef: any = useRef(null);
  const becomeRef: any = useRef(null);
  const hreoIsInView = useInView(heroRef);
  const featuresIsInView = useInView(featuresRef);
  const howItWorksRefIsInView = useInView(howItWorksRef);
  const chartIsInView = useInView(chartRef);
  const historyYield1InView = useInView(historyYield1);
  const historyYield2InView = useInView(historyYield2);
  const faqInView = useInView(faqRef);
  const becomeInView = useInView(becomeRef);

  const apyRandom = [
    12.2, 13.08, 11.96, 12.83, 12.19, 13.07, 11.96, 12.82, 12.84,
  ];
  const getRandomApy = () => {
    let randomFigure = Math.floor(Math.random() * apyRandom.length);

    return apyRandom[randomFigure];
  };

  const [pools, setPools] = useState(pool);
  console.log({ pools, selectedNetwork });

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await GetAPY(
        "https://bondexecution.onrender.com/monitoring/getYields"
      );
      setPools((prevPools: any) => {
        const updatedPools = prevPools.map((pool: any) => {
          const activePool = data?.data.find((activePool: any) => activePool?.symbolFuture === pool?.symbolFuture)

            return {
              ...pool,
              apy: activePool?.averageYieldPostExecution?.upper || "expired"
            }
        })
        return updatedPools.sort((a: any, b: any) => (a.apy === "expired" ? 1 : -1))
      }
      );
    };

    // Initial fetch
    fetchData();

    // Fetch every 10 seconds
    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, []);
  return (
    <>
      {/* <div className="w-full h-10 bg-red-600 md:max-lg:flex hidden max-sm:bg-blue-500 max-sm:flex"></div> */}
      <Header />
      <main className="w-full md:pt-24 pt-16 z-[99]  max-w-[1500px] mx-auto">
        {/* DAPP */}
        <div className="pb-20" ref={heroRef}>
          {/* <motion.div
            className="tag flex items-center justify-between p-1 shadowBackDrop mx-auto"
            variants={getAnimationVariants(0)}
            initial="out"
            animate={hreoIsInView ? "in" : "out"}
          >
            <p className="inner-tag text-center shadowBackDrop w-[102.55px] h-[24px]">
              Latest release
            </p>
            <p>Bondhive a greater dApp</p>
            <Image
              src={ArrowRight}
              width={13}
              height={13}
              alt="right"
              className="arrow"
            />
          </motion.div> */}

          <div className="w-full mt-14 hero_text flex flex-col justify-center items-center">
            <motion.h1
              className="big_text md:text-[50px] text-[42px] md:w-7/12 md:max-lg:w-10/12  md:leading-[66px] leading-[50px] "
              variants={getAnimationVariants(0.3)}
              initial="out"
              animate={hreoIsInView ? "in" : "out"}
            >
              Secure Your Returns with <span>On-Chain Crypto Bonds</span>
            </motion.h1>
            <motion.p
              className="des mt-4 md:w-7/12 max-md:px-3 md:max-lg:w-9/12"
              variants={getAnimationVariants(0.6)}
              initial="out"
              animate={hreoIsInView ? "in" : "out"}
            >
              Harness the power of futures spread trading with Bondhive&#39;s
              Crypto Bonds which offer a straightforward way to invest with
              fixed terms and guaranteed yields, similar to traditional bank
              deposits
            </motion.p>
          </div>
          {/* <div className="preview mx-auto  bg-black">
            // should be inside preview-container
          // </div> */}
          <Link href={"/app"} target="_blank">
            <motion.div
              className="preview-container w-full relative mt-20 relative cursor-pointer"
              variants={cardHoverVariants}
              initial="out"
              animate={hreoIsInView ? "in" : "out"}
              whileHover="hover"
            >
              <div className="preview mx-auto relative md:w-10/12 w-11/12">
                <div className="table_pool_container_mobile md:grid grid-cols-2 gap-10">
                  {pools.map((pool: any, index: any) => (
                    <div
                      className="table_pool_container p-5 text-secText bg-dappHeaderBg border-border_pri border rounded-md max-md:mb-5"
                      key={`${index}--pool`}
                    >
                      <div className="flex border-border_pri border-b pb-3 justify-between items-center">
                        <div className="flex items-center mb-4 gap-2 ">
                          <Image
                            src={pool.img}
                            width={38}
                            height={38}
                            alt="right"
                            className=""
                          />
                          <div className="">
                            <h1 className="text-white text-[18px]">
                              {" "}
                              {pool.name}
                            </h1>
                            {/* <p className="text-darkPrimText text-[10px] capitalize">
                              {pool.name} Futures and Spot
                            </p> */}
                          </div>
                        </div>
                        <div className="APY text-blueish flex items-end gap-1 text-sm text-secText">
                          <p>APY</p>
                          <AnimatePresence mode="wait">
                            <motion.h1
                              className={`text-3xl font-bold  ${
                                pool.apy == "expired"
                                  ? "text-red-600 uppercase"
                                  : "text-gold"
                              }`}
                              key={pool.apy}
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 10 }}
                              transition={{ duration: 0.3 }}
                            >
                              {pool.apy}
                            </motion.h1>
                          </AnimatePresence>

                          {/* <div className="time_tag flex items-center gap-1 py-[3px] px-[5px] w-[150px]">
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
                      </div> */}
                        </div>
                      </div>
                      <div className="text-[16px] py-4">
                        <div className="maturity flex justify-between">
                          <p className="">Maturity</p>
                          <p className="text-white ">{pool.expiration}</p>
                        </div>
                        <div className="deposit_assets flex justify-between items-center my-4">
                          <p className="">Deposit assets</p>
                          <div className="Deposit_asset text-blueish  flex items-center gap-2">
                            <div className="asset_logo">
                              <Image
                                src={UsdcBgLogo}
                                width={25}
                                height={25}
                                alt="token-img"
                                className="relative"
                              />
                            </div>
                            <h1 className="text-[16px]">{pool.tokenSymbol}</h1>
                          </div>
                        </div>
                        <div className="min_invest flex justify-between items-center">
                          <p className="">Minimum Inv.</p>
                          <p className=" text-blueish">
                            ${pool.minimum}
                            <span className="text-[13px] text-paraDarkText ml-2">
                              - {pool.minimum} USDC
                            </span>
                          </p>
                        </div>
                      </div>
                      <button
                        className={`w-full button2 flex items-center justify-center px-9 py-3 gap-1`}
                        // onClick={() => setOpenState(true)}
                      >
                        <p className="text-sm">Launch dApp</p>
                        <ChevronRightIcon className="w-[13px] h-[13px]" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              {/* <div className="ecplise_blur absolute top-40 left-1/2 transform -translate-x-1/2  lg:block hidden"></div>
              <div className="w-full h-[386px] preview-shadow absolute -bottom-10 z-[999]"></div> */}
            </motion.div>
          </Link>
        </div>

        {/* How it works */}
        <div className=" w-full relative pt-28" id="howitworks">
          <div className="">
            <Image
              src={Vector1}
              width={256}
              height={176}
              alt="right"
              className="absolute left-[140px] max-md:left-0 right-0 top-[200px]"
            />
            <Image
              src={Vector2}
              width={256}
              height={176}
              alt="right"
              className="absolute  right-[120px] top-[150px] max-md:hidden"
            />
            <Image
              src={Vector3}
              width={256}
              height={176}
              alt="right"
              className="absolute max-md:hidden  left-[320px]  top-[550px]"
            />
            <Image
              src={Vector4}
              width={256}
              height={176}
              alt="right"
              className="absolute  right-[310px] top-[550px] max-md:right-0"
            />
          </div>
          <div
            className="flex flex-col justify-center items-center"
            ref={howItWorksRef}
          >
            <motion.div
              className=""
              variants={getAnimationVariants(0)}
              initial="out"
              animate={howItWorksRefIsInView ? "in" : "out"}
            >
              <Image
                src={"/PNG/goldenBondhive.png"}
                width={104}
                height={104}
                alt="right"
                className=""
              />
            </motion.div>
            <motion.h1
              variants={getAnimationVariants(0.3)}
              initial="out"
              animate={howItWorksRefIsInView ? "in" : "out"}
              className="medium_title my-4 md:text-[34px] text-2xl"
            >
              How It Works
            </motion.h1>
            <motion.p
              variants={getAnimationVariants(0.6)}
              initial="out"
              animate={howItWorksRefIsInView ? "in" : "out"}
              className="subtitle_p md:w-4/12 text-center px-6 md:px-0"
            >
              In markets where the price of futures contracts is higher than the
              current market price, known as <i>“contango”</i>, investors have
              the opportunity to profit from this disparity
            </motion.p>
          </div>

          <motion.div className="relative" ref={chartRef}>
            <motion.div
              variants={getAnimationVariants(0)}
              initial="out"
              animate={chartIsInView ? "in" : "out"}
              className="chart mt-36 mx-auto w-7/12 max-md:w-11/12 h-[456px] max-md:h-[441px] max-sm:h-[350px]"
            >
              <motion.div
                variants={getAnimationVariants(0.3)}
                initial="out"
                animate={chartIsInView ? "in" : "out"}
                className="inner mx-auto -mt-32 absolute xCenter top-10 w-10/12 xl:h-[390px] max-md:h-[218px] h-[290px]"
              >
                <Image
                  src={"/PNG/staticChartt.svg"}
                  layout="fill"
                  alt=""
                  className="w-full rounded-t-lg object-center object-contain "
                  objectFit="contain"
                  objectPosition="center"
                />
              </motion.div>
              <motion.div
                variants={getAnimationVariants(0.6)}
                initial="out"
                animate={chartIsInView ? "in" : "out"}
                className="subtitle_p xl:text-center absolute bottom-10 px-20 max-md:text-left max-md:px-5 xl:leading-[26px] max-md:text-[16px]"
              >
                They can do this by selling futures contracts while
                simultaneously buying the underlying asset at its current price,
                thereby securing a guaranteed profit from the difference. If
                this position is maintained until maturity, at which point the
                prices converge, allowing investors to realize a profit from the
                difference.
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Assured Profit */}
          <div
            className="flex flex-col justify-center items-center md:pt-32 mt-28 w-full relative"
            id="features"
            ref={featuresRef}
          >
            <motion.div className="flex flex-col justify-center items-center gap-2 max-md:px-5">
              <motion.h1
                className="medium_title text-center md:text-[44px] text-2xl md:leading-[51px]"
                variants={getAnimationVariants(0)}
                initial="out"
                animate={featuresIsInView ? "in" : "out"}
              >
                Features
              </motion.h1>
            </motion.div>

            <motion.div className="flex flex-wrap max-md:flex-col gap-7 md:mt-16 mt-10 assured_profit mx-auto relative px-5">
              <Image
                src={"/PNG/falling-light.png"}
                width={1490}
                height={330}
                alt="right"
                className="absolute left-0 right-0 top-5"
              />
              <motion.div
                variants={getAnimationVariants(0.6)}
                initial="out"
                animate={featuresIsInView ? "in" : "out"}
                className="card w-[363px] h-[146px] py- px-7"
              >
                <LockClosedIcon className="arrow my-3 mt-5 w-[23px] h-[24px] text-priText" />
                <h2 className="text-priText mb-1">Secured Arbitrage</h2>
                <p className="text-secText  text-[14px]">
                  Lock in yields with BondHives arbitrage strategy
                </p>
              </motion.div>
              <motion.div
                variants={getAnimationVariants(0.9)}
                initial="out"
                animate={featuresIsInView ? "in" : "out"}
                className="card w-[363px] h-[146px] py- px-7"
              >
                <Image
                  src={TransparentIcon}
                  width={23}
                  height={24}
                  alt="right"
                  className="arrow my-3 mt-5"
                />
                <h2 className="text-priText mb-1">
                  Liquidity in Secondary Market
                </h2>
                <p className="text-secText  text-[14px]">
                  Trading and Bond buybacks provide liquidity to bond holders
                </p>
              </motion.div>
              <motion.div
                variants={getAnimationVariants(1.2)}
                initial="out"
                animate={featuresIsInView ? "in" : "out"}
                className="card w-[363px] h-[146px] py- px-7"
              >
                <SwatchIcon className="arrow my-3 mt-5 w-[23px] h-[24px] text-priText" />
                <h2 className="text-priText mb-1">
                  Systematic Risk Mitigation
                </h2>
                <p className="text-secText  text-[14px]">
                  Third party custodian provides off-exchange settlement
                </p>
              </motion.div>
            </motion.div>
          </div>
          <div className=" pt-52 historical_yields" id="historicalyields">
            <motion.div
              ref={historyYield1}
              variants={getAnimationVariants(0)}
              initial="out"
              animate={historyYield1InView ? "in" : "out"}
              className="xl:w-[1060px] w-10/12 mx-auto md:flex justify-between items-center "
            >
              <h1 className="gradient_text md:w-[440px] md:text-[44px] text-[32px] md:leading-[58px] leading-[45px] max-md:mb-2 ">
                Some amazing <span>Historical Yields</span>{" "}
              </h1>
              <p className="subtitle_p md:w-[455px]">
                One could tap into the opportunity and enter positions that
                yield consistently, even through bear markets, and find
                significantly enhanced prospects during bull markets
              </p>
            </motion.div>
            <div className="relative w-full md:max-lg:px-1" ref={historyYield2}>
              <Image
                src={"/PNG/falling-light2.png"}
                width={1990}
                height={330}
                alt="right"
                className="absolute left-0 right-0 top-0 w-[1500px] opacity-15 hidden md:block -z-10"
              />
              <div className="flex flex-wrap items-center gap-10 my-20 justify-center md:max-lg:justify-start md:px-0 px-10">
                {/* <motion.div
                  variants={getAnimationVariants(0.3)}
                  initial="out"
                  animate={historyYield2InView ? "in" : "out"}
                  className="btc_avg w-[430px] max-md:w-[390px] h-[400px] card relative"
                >
                  <div className="avg_inner absolute right-0 bottom-0 pt-5 w-[384px] max-md:w-11/12 h-[364px] overflow-hidden">
                    <div className="flex justify-between items-center px-5">
                      <div className="">
                        <div className="flex">
                          <h2 className="text-[16px] text-darkPrimText mr-3">
                            BTC Avg Yield
                          </h2>
                          <div className="time_tag flex items-center gap-1 px-[5px] py-[2px]">
                            {" "}
                            <Image
                              src={Calendar}
                              width={14}
                              height={14}
                              alt="right"
                              className=""
                            />{" "}
                            <p className="text-[13px] text-[#A586FE]">
                              June-28
                            </p>
                          </div>
                        </div>
                        <h1 className="text-3xl text-white mt-2 brFirma_font">
                          15.69%
                        </h1>
                      </div>
                      <Image
                        src={"/PNG/smallChart.png"}
                        width={98}
                        height={54}
                        alt="right"
                        className="max-sm:hidden"
                      />
                    </div>
                    <div className="mt-5">
                      <Image
                        src={"/PNG/btc_table.png"}
                        width={394}
                        height={248}
                        alt="right"
                        className=""
                      />
                    </div>
                  </div>
                </motion.div> */}
                <motion.div
                  variants={getAnimationVariants(0.3)}
                  initial="out"
                  animate={historyYield2InView ? "in" : "out"}
                  className="btc_avg w-[340px] max-md:w-[390px] h-[400px] card relative"
                >
                  <div className="avg_inner absolute right-0 bottom-0 pt-5 w-[300px] max-md:w-11/12 h-[364px]">
                    <div className="flex justify-between items-center px-5">
                      <div className="">
                        <div className="flex">
                          <h2 className="text-[16px] text-darkPrimText mr-3">
                            BTC Avg Yield
                          </h2>
                          <div className="time_tag flex items-center gap-1 px-[5px] py-[2px]">
                            {" "}
                            <Image
                              src={Calendar}
                              width={14}
                              height={14}
                              alt="right"
                              className=""
                            />{" "}
                            <p className="text-[13px] text-[#A586FE]">
                              Sept-28
                            </p>
                          </div>
                        </div>
                        <h1 className="text-3xl text-white mt-2 brFirma_font">
                          15.69%
                        </h1>
                      </div>
                    </div>
                    <div className="mt-7">
                      <p className="text-white absolute bottom-5 w-[270px] text-[14px] ml-2">
                        Displaying the average APY for the BTC futures contract
                        expiring on September
                      </p>
                      <Image
                        src={MediumChartBg}
                        width={394}
                        height={248}
                        alt="right"
                        className="absolute bottom-0"
                      />
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  variants={getAnimationVariants(0.6)}
                  initial="out"
                  animate={historyYield2InView ? "in" : "out"}
                  className="eth_avg w-[340px] max-md:w-[390px] h-[400px] card relative"
                >
                  <div className="avg_inner absolute right-0 bottom-0 pt-5 w-[300px] max-md:w-11/12 h-[364px]">
                    <div className="flex justify-between items-center px-5">
                      <div className="">
                        <div className="flex">
                          <h2 className="text-[16px] text-darkPrimText mr-3">
                            ETH Avg Yield
                          </h2>
                          <div className="time_tag flex items-center gap-1 px-[5px] py-[2px]">
                            {" "}
                            <Image
                              src={Calendar}
                              width={14}
                              height={14}
                              alt="right"
                              className=""
                            />{" "}
                            <p className="text-[13px] text-[#A586FE]">
                              March-24
                            </p>
                          </div>
                        </div>
                        <h1 className="text-3xl text-white mt-2 brFirma_font">
                          13.61%
                        </h1>
                      </div>
                    </div>
                    <div className="mt-7">
                      <p className="text-white absolute bottom-5 w-[270px] text-[14px] ml-2">
                        Displaying the average APY for the ETH futures contract
                        expiring on March
                      </p>
                      <Image
                        src={MediumChartBg}
                        width={394}
                        height={248}
                        alt="right"
                        className="absolute bottom-0"
                      />
                    </div>
                  </div>
                </motion.div>
                {/* <motion.div
                  variants={getAnimationVariants(0.9)}
                  initial="out"
                  animate={historyYield2InView ? "in" : "out"}
                  className="max-md:w-[390px] w-[250px] h-[400px] card relative overflow-hidden"
                >
                  <Image
                    src={"/PNG/energy.png"}
                    width={207}
                    height={299}
                    alt="right"
                    className="absolute top-0 max-md:-top-10 left-1/2 transform -translate-x-1/2 "
                  />
                  <div className="px-5 absolute bottom-5">
                    <h1 className="text-3xl text-white my-2">30% Fast!</h1>
                    <p className="text-white subtitle_p w-[210px] text-[12px]">
                      Built for speed with 50ms interactions and real-time sync.
                    </p>
                  </div>
                </motion.div> */}
              </div>
            </div>
            <motion.div
              variants={getAnimationVariants(1.2)}
              initial="out"
              animate={historyYield2InView ? "in" : "out"}
              className="md:flex justify-between items-center xl:w-[1060px] mx-auto md:px-0 px-10"
            >
              <p className="subtitle_p md:w-[592px]">
                For a closer look, please visit our Dune Analytics dashboard.
                Summarizing, ETH and BTC bonds have shown promising average
                yields of 13.61% and 16.42% for ETH, and 13.75% and 15.69% for
                BTC, over the past six months
              </p>
              <Link
                href={
                  "https://dune.com/socratesstable_sigma/bond-hive-yield-opportunities"
                }
                target="_blank"
              >
                <button className="mt-10 md:px-5 max-md:w-full">
                  Open Dune Dashboard
                </button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* products */}
        <OurProducts />

        {/* Become A Partner */}
        <motion.div
          ref={becomeRef}
          className="flex flex-col justify-center items-center my-36 w-full"
        >
          <div className="flex flex-col justify-center items-center max-md:w-11/12">
            <motion.div
              className=""
              variants={getAnimationVariants(0)}
              initial="out"
              animate={becomeInView ? "in" : "out"}
            >
              <Image
                src={"/PNG/blueBondhive.png"}
                width={104}
                height={104}
                alt="right"
                className=""
              />
            </motion.div>
            <motion.h1
              variants={getAnimationVariants(0.3)}
              initial="out"
              animate={becomeInView ? "in" : "out"}
              className="medium_title my-4 md:w-[850px] md:text-[44px] text-[28px] md:leading-[51px]"
            >
              Become a partner and integrate bondhive in your app?
            </motion.h1>
            <motion.p
              className="subtitle_nosize text-[18px] text-center"
              variants={getAnimationVariants(0.6)}
              initial="out"
              animate={becomeInView ? "in" : "out"}
            >
              Join us now and let&apos;s work wonders together to build a better
              future
            </motion.p>
            <motion.div
              className=""
              variants={getAnimationVariants(0.9)}
              initial="out"
              animate={becomeInView ? "in" : "out"}
            >
              <Link href={"/contact"}>
                <button
                  className={`button1 mt-3 inline-flex items-center px-[20px] py-[10px] gap-3 mr-3`}
                >
                  <div className="">Reach Out</div>
                </button>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <Partners />

        <Footer />
      </main>
    </>
  );
}

const useInView: React.FC<{
  current: any;
  ref: any;
  options: any;
}> = (ref) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [ref]);

  return isIntersecting;
};
