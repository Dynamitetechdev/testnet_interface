// import {  useInView } from "@/app/page";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  ArrowRight,
  ArrowRightUpGrey,
  ArrowRightUpWhite,
  OnChainLogo,
  StableReturnsIcon,
} from "../assets";
import Link from "next/link";
import { Candles, DynamicPhone, SampleBhusd } from "../assets/bg";
import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
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
const OurProducts = () => {
  const ourProductsRef: any = useRef(null);
  const ourProductsCardRef: any = useRef(null);
  const ourProductsIsInView = useInView(ourProductsRef);
  const ourProductsCardRefIsInView = useInView(ourProductsCardRef);
  const ourProducts = [
    {
      name: "Crypto Bonds (Fixed Deposits)",
      value: "depositBond",
      tag: 'live',
    },
    {
      name: "Secondary Trading Market",
      value: "secondaryMarket",
      tag: 'soon',
    },
    {
      name: "bhUSD Stablecoin",
      value: "bhUSD",
      tag: 'soon',
    },
  ];
  const [selectTabs, setSelectTabs] = useState<any>({
    depositBond: true,
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
  return (
    <>
      <div className="w-full pt-36 products" ref={ourProductsRef} >
        <motion.div
          className="pt-16"
          variants={getAnimationVariants(0.3)}
          initial="out"
          animate={ourProductsIsInView ? "in" : "out"}
          id="ourproducts"
        >
          <h1 className="text-white mt-5 md:text-[34px] text-2xl text-center font-semibold mb-10">
            Our Products
          </h1>
        </motion.div>
        {/* <motion.p
              variants={getAnimationVariants(0)}
              initial="out"
              animate={howItWorksRefIsInView ? "in" : "out"}
              className="subtitle_p md:w-4/12 text-center px-6 md:px-0"
            >
              In markets where the price of futures contracts is higher than the
              current market price, known as contango, investors have the
              opportunity to profit from this disparity.
            </motion.p> */}
        <div className="xl:w-[1060px] w-11/12 mx-auto">
          <div className="overflow-x-auto mb-16">
            <div className="selectTab text-darkPrimText flex justify-center max-lg:w-[880px] max-md:mx-auto bg-red-60">
              <ul className="flex p-[6px] bg-selectTabBg rounded-md max-md:-ml-5 ">
                {ourProducts.map((el, index) => (
                  <li
                  key={index}
                    className={` md:px-7 px-6 py-3 rounded-md lg:text-md text-sm cursor-pointer flex item-center gap-2 ${
                      selectTabs[el.value] ? "bg-dappHeaderBg" : "less_opacity"
                    }`}
                    onClick={() => handleSelect(el.value)}
                  >
                    <p className="capitalize">{el.name}</p>
                    {(
                      <p className={`capitalize px-2 text-[12px] rounded-md  ${el.tag == "soon" ? "bg-[#57B6FA] text-white" : "bg-gold text-[#000000]"}`}>
                        {el.tag}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {selectTabs["depositBond"] && (
            <motion.div
              className="text-white flex md:h-[464px] items-center flex-reverse max-md:flex-col-reverse max-md:gap-5"
              variants={getAnimationVariants(0)}
              initial="out"
              animate={selectTabs["depositBond"] ? "in" : "out"}
            >
              <div className="md:w-1/2 md:pr-8">
                <h1 className="text-3xl mb-4">Crypto Bonds (Fixed Deposits)</h1>
                <p className="text-darkPrimText text-sm ">
                Discover the stability of Bondhive Crypto Bonds, your on-chain solution for fixed-term, guaranteed returns. Just like traditional fixed deposits, but secured on the blockchain for transparency and safety

                </p>
                <div className="flex items-center text-darkPrimText gap-5 my-5">
                  <div className="flex items-center gap-1">
                    <Image
                      src={StableReturnsIcon}
                      width={22}
                      height={22}
                      alt="right"
                      className=""
                    />
                    <p className="lg:text-lg text-sm">Stable Returns</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Image
                      src={OnChainLogo}
                      width={22}
                      height={22}
                      alt="right"
                      className=""
                    />
                    <p className="lg:text-lg text-sm">On-Chain Security</p>
                  </div>
                </div>
                <Link href={"/app"} target="_blank">
                <button
                    className={`product_button inline-flex items-center px-10 py-3 gap-2 button2`}
                  >
                    <ArrowUpRightIcon className="w-[17px] h-[17px]"/>
                    <p className="text-[15px] ">Launch dApp</p>
                  </button>
                </Link>
              </div>
              <div className="product_bg md:w-1/2 md:h-[464px] h-[460px] w-full relative">
              <div className="w-full h-96 absolute top-0 right-0 left-0 mx-auto">
                  <Image
                    src={DynamicPhone}
                    layout="fill"
                    alt=""
                    className="rounded-t-lg object-center "
                    objectFit="contain"
                    objectPosition="center"
                  />
                </div>
              </div>
            </motion.div>
          )}
          {selectTabs["secondaryMarket"] && (
            <motion.div
              className="text-white flex md:h-[464px] items-center max-md:flex-col max-md:gap-5"
              variants={getAnimationVariants(0)}
              initial="out"
              animate={selectTabs["secondaryMarket"] ? "in" : "out"}
            >
              <div className="product_bg md:w-1/2 md:h-[464px] h-[460px] w-full relative">
              <div className="w-full h-full absolute top-0 right-0 left-0">
                  <Image
                    src={Candles}
                    layout="fill"
                    alt=""
                    className="w-full rounded-t-lg object-center object-cover "
                    objectFit="cover"
                    objectPosition="center"
                  />
                </div>

                <div className="circle absolute w-[56px] h-[56px] right-3 top-3 flex justify-center items-center">
                  <Image
                    src={ArrowRightUpWhite}
                    width={22}
                    height={22}
                    alt="right"
                    className=""
                  />
                </div>
              </div>
              <div className="md:w-1/2 md:pl-8">
                <h1 className="text-[33px] mb-4">Secondary Trading Market</h1>
                <p className="text-darkPrimText text-sm ">
                Prepare for the launch of BondHive’s Secondary Trading Market, where issued bonds can be actively traded or bought back depending on market conditions. This platform will not only enhance liquidity but also allow for real-time price discovery, offering bondholders the flexibility to optimize their investment strategies in response to changing financial landscapes.
                </p>
                <div className="flex items-center text-darkPrimText gap-5 my-5">
                  <div className="flex items-center gap-1">
                    <Image
                      src={StableReturnsIcon}
                      width={22}
                      height={22}
                      alt="right"
                      className=""
                    />
                    <p className="text-[18px]">Efficient Bond Trading</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Image
                      src={OnChainLogo}
                      width={22}
                      height={22}
                      alt="right"
                      className=""
                    />
                    <p className="text-[18px]">Liquidity</p>
                  </div>
                </div>
                <Link href={"/app"} target="_blank">
                <button
                    className={`product_button inline-flex items-center px-10 py-3 gap-2 button2`}
                  >
                    <ArrowUpRightIcon className="w-[17px] h-[17px]"/>
                    <p className="text-[15px] ">Launch dApp</p>
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
          {selectTabs["bhUSD"] && (
            <motion.div
              className="text-white flex md:h-[464px] items-center flex-reverse max-md:flex-col-reverse max-md:gap-5"
              variants={getAnimationVariants(0)}
              initial="out"
              animate={selectTabs["bhUSD"] ? "in" : "out"}
            >
              <div className="md:w-1/2 md:pr-8">
                <h1 className="text-3xl mb-4">bhUSD Stablecoin</h1>
                <p className="text-darkPrimText text-sm ">
                In conjunction with our secure bonds, anticipate the introduction of bhUSD, BondHive’s proprietary stablecoin. Built on the stability of our bonds, bhUSD aims to provide a dependable medium of exchange within the blockchain space. This integration ensures that the underlying value of bhUSD is as stable as the bonds backing it, facilitating smoother transactions and offering a solid foundation for financial operations on our platform.
                </p>
                <div className="flex items-center text-darkPrimText gap-5 my-5">
                  
                  <div className="flex items-center gap-1">
                    <Image
                      src={OnChainLogo}
                      width={22}
                      height={22}
                      alt="right"
                      className=""
                    />
                    <p className="lg:text-lg text-sm">
                      Reliable Stability on Blockchain
                    </p>
                  </div>
                </div>
                <Link href={"/app"} target="_blank">
                <button
                    className={`product_button inline-flex items-center px-10 py-3 gap-2 button2`}
                  >
                    <ArrowUpRightIcon className="w-[17px] h-[17px]"/>
                    <p className="text-[15px] ">Launch dApp</p>
                  </button>
                </Link>
              </div>
              <div className="product_bg md:w-1/2 md:h-[464px] h-[460px] w-full relative">
              <div className="w-full h-96 absolute bottom-0 right-0 left-0 mx-auto">
                  <Image
                    src={SampleBhusd}
                    layout="fill"
                    alt=""
                    className="rounded-t-lg object-center "
                    objectFit="contain"
                    objectPosition="center"
                  />
              </div>
                {/* <div className="circle absolute w-[56px] h-[56px] right-3 top-3 flex justify-center items-center">
                  <Image
                    src={ArrowRightUpWhite}
                    width={22}
                    height={22}
                    alt="right"
                    className=""
                  />
                </div> */}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default OurProducts;
