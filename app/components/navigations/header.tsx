import Image from "next/image";
import style from "./styles.module.scss";
import { ArrowRight, BondHiveLogo, TGLogo, TwitterLogo } from "../assets";
import { GridLight, GridLightMobile, LightRay } from "../assets/bg";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowLongRightIcon } from "@heroicons/react/24/outline";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) { // You can adjust the scroll threshold value here
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <motion.div
    className="w-full pt-7 top-0 left-0 right-0 z-50 "
    initial={{ y: 0 }}
    animate={{ y: 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
  >
      <div className="-z-10]">
        <Image
          src={GridLight}
          width={1152}
          height={380}
          alt="bondhive"
          className="absolute -top-20 max-md:-top-7 left-1/2 transform -translate-x-1/2 max-md:hidden"
        />
        <Image
          src={GridLightMobile}
          width={1152}
          height={380}
          alt="bondhive"
          className="absolute max-md:block  top-0 left-1/2 transform -translate-x-1/2 hidden mobile_grid -z-10"
        />
        <Image
          src={LightRay}
          width={1152}
          height={800}
          alt="bondhive"
          className="absolute top-0 right-[220px] max-md:right-[0px] flex justify-center left-1/2 transform -translate-x-1/2 -z-10"
        />
      </div>
      <motion.div
    initial={{ y: -100 }}
    animate={{ y: 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }} className={`${style.header} ${isScrolled ? "md:fixed inset-x-0 mt-3" : "md:w-9/12 "} md:max-lg:w-11/12  w-11/12 h-[64px] flex justify-between items-center px-6 max-md:px-4 z-99 md:bg-dappHeaderBg max-md:bg-[#0D021C]`}>
      <Link href={"/"}>
      <div className="logo flex items-center">
          <Image src={BondHiveLogo} width={29} height={29} alt="bondhive" />
          <p className="text-lg font-semibold text-white max-sm:text-[16px]">Bondhive<span className="text-sm max-sm:hidden">(Testnet)</span></p>
        </div>
      </Link>
        <div className="max-md:hidden">
          <ul className="flex justify-between gap-7 text-[16px]">
            <Link href={"/#howitworks"}> <li>How it works</li></Link>
            <Link href={"/#features"}>  <li>Features</li></Link>
            <Link href={"/#historicalyields"}> <li>Historical Yields</li></Link>
            <Link href={"/#ourproducts"}> <li>Our products</li></Link>
            {/* <Link href={"/faq"}>  <li>FAQs</li></Link> */}
          </ul>
        </div>
        <div className="flex justify-between items-center gap-5 max-md:gap-2">
          <Link href={"https://bond-hive.gitbook.io/bond-hive/"} target="_blank"> <p className="max-md:hidden">Docs</p></Link> 
          <Link href={"/app"} target="_blank">
          <button
              className={` button2 inline-flex items-center px-[16px] py-[5px] gap-3`}
            >
              <div className="">Launch dApp</div>
              {/* <Image src={ArrowRight} width={13} height={13} alt="bondhive" /> */}
              <ArrowLongRightIcon className="w-[15px] h-[20px]"/>
            </button>
          </Link>
          <Link href={"https://t.me/+AjBlPFAjjLYyNWNl"} target="_blank">
          <div className="each-socials w-[40px] h-[40px] max-md:w-[33px] max-md:h-[33px] hidden max-md:flex">
            <Image src={TGLogo} width={18} height={18} alt="bondhive" />
            </div>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Header;
