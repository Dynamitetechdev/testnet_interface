import Image from "next/image";
import {
  BondHiveLogo,
  DiscordLogo,
  LinkedInLogo,
  RedditLogo,
  StellarBrand,
  StellarWhiteLogo,
  TGLogo,
  TwitterLogo,
} from "../assets";
import styles from "./styles.module.scss";
import Link from "next/link";
const DappFooter = () => {
  return (
    <div className={`${styles.footer} footer w-full relative px-20 py-8`}>
      <div className=" mx-auto flex items-center justify-between max-md:flex-col-reverse max-md:gap-10">
        <div className="flex items-center max-md:flex-col gap-5">
          <div className="socials flex  gap-4">
            <Link href={"https://t.me/+AjBlPFAjjLYyNWNl"} target="_blank">
              <div className="each-socials w-[40px] h-[40px]">
                <Image src={TGLogo} width={16} height={24} alt="bondhive" />
              </div>
            </Link>
            <Link href={"https://x.com/BondHive"} target="_blank">
              <div className="each-socials w-[40px] h-[40px]">
                <Image
                  src={TwitterLogo}
                  width={16}
                  height={24}
                  alt="bondhive"
                />
              </div>
            </Link>
            {/* <Link href={"https://x.com/BondHive"} target="_blank">
              <div className="each-socials w-[40px] h-[40px]">
                <Image src={RedditLogo} width={20} height={20} alt="bondhive" />
              </div>
            </Link>
            <Link href={"https://x.com/BondHive"} target="_blank">
              <div className="each-socials w-[40px] h-[40px]">
                <Image
                  src={DiscordLogo}
                  width={20}
                  height={20}
                  alt="bondhive"
                />
              </div>
            </Link>
            <Link href={"https://x.com/BondHive"} target="_blank">
              <div className="each-socials w-[40px] h-[40px]">
                <Image
                  src={LinkedInLogo}
                  width={20}
                  height={20}
                  alt="bondhive"
                />
              </div>
            </Link> */}
          </div>
          <p className="xl:w-[334px] text-sm">
            @ 2024 Bondhive; All Rights Reserved
          </p>
        </div>
        <div className="flex items-center gap-1">
          <p>Built and managed on</p>
          <Image
            src={StellarWhiteLogo}
            width={79}
            height={29}
            alt="right"
            className="arrow"
          />
        </div>
      </div>
    </div>
  );
};

export default DappFooter;
