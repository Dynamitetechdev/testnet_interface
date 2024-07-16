import Image from "next/image";
import { BondHiveLogo, DiscordLogo, LinkedInLogo, RedditLogo, TGLogo, TwitterLogo } from "../assets";
import styles from "./styles.module.scss"
import Link from "next/link";
const Footer = () => {
  return (
    <div className={`${styles.footer} footer w-full relative border-t border-border_pri`}>
          <Image
              src={"/PNG/footer-falling-light.png"}
              width={1990}
              height={323}
              alt="right"
              className="absolute left-0 right-0 top-0 md:w-[1300px] -z-10" 
            />
      <div className="xl:w-[1060px] mx-auto flex max-md:flex-col max-md:gap-10 md:max-lg:px-10 items-center justify-between border-b border-border_pri py-8 pt-16 max-md:pb-16">
        <div className="max-sm:px-5">
          <div className="logo flex items-center mb-4">
            <Image src={BondHiveLogo} width={29} height={29} alt="bondhive" />
            <p className="text-md font-semibold text-white">Bondhive</p>
          </div>
          <p className="md:w-[434px] text-sm">
            BondHive uses blockchain technology to bring traditional bonds into DeFi, offering stable, predictable returns like fixed deposits with the flexibility and efficiency of decentralized finance.
          </p>
        </div>
        <div className="">

          <div className="socials flex gap-4">
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
        </div>
      </div>

      <div className="text-center pt-5 pb-10 ">
        <p>Copyright ©2024 Bondhive</p>
      </div>
    </div>
  );
};

export default Footer;
