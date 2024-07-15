"use client"
import { useEffect, useRef, useState } from "react";
// import {  useInView } from "../page";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChervonUp, Dot } from "../components/assets";
import Header from "../components/navigations/header";
import Footer from "../components/navigations/footer";
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
const Faq = () => {
  const faqRef: any = useRef(null);
  const faqInView = useInView(faqRef);
  const faq = [
    {
      id: 1,
      title:
        "How is the yield locked, and can it change with market conditions?",
      content:
        "The yield is locked by simultaneously going short on futures and long on spot positions. This strategy ensures that the yield remains unchanged by market conditions if held until maturity. No matter the price fluctuations or disparity changes, your yield is secure.",
    },
    {
      id: 2,
      title: "What happens at expiration?",
      content:
        "Upon expiration, the funds are returned to your investment wallet. We're developing an auto-reinvest feature that will allow you to set a threshold limit to automatically re-enter the market or take the returns, giving you seamless control over your investments.",
    },
    {
      id: 3,
      title: "What do I receive to claim my investment?",
      content:
        "You'll receive yield-bearing tokens that accrue value over time, similar to a bond. These tokens represent your growing investment.",
    },
    {
      id: 4,
      title: "What are the risks involved in this investment?",
      content:
        "While we strive to mitigate risks, one potential risk is the bankruptcy of a centralized exchange. However, our diversified approach across multiple exchanges aims to reduce this risk.",
    },
    {
      id: 5,
      title: "Which exchanges are being utilized by Bond Hive?",
      content:
        "Currently, we're utilizing Binance, OKX, Bybit, and Deribit for our operations. We are also in the process of continuously onboarding additional exchanges that offer delivery futures to expand our reach and enhance our service.",
    },
    {
      id: 5,
      title: "Can I access my investment before maturity?",
      content:
        "Yes, while our bonds are designed for holding until maturity to realize the full yield potential, you can exit your position early in the secondary market. Keep in mind that this may affect the final yield received.",
    },
  ];
  const [openDetail, setOpenDetail] = useState(Array(faq.length).fill(false));
  const handleClick = (index: number) => {
    const newArr = [...openDetail];
    newArr[index] = !newArr[index];
    setOpenDetail(newArr);
  };
  return (
    <>
      <Header />
      <main className="w-full md:pb-20 pt-16 z-[99]">
        {/* FAQ Profit */}
        <motion.div
          ref={faqRef}
          variants={getAnimationVariants(0)}
          initial="out"
          animate={faqInView ? "in" : "out"}
          className="faq_section w-full pt-40 "
          id="faqs"
        >
          <div className="xl:w-[1060px] mx-auto w-11/12">
            <div className="flex justify-between items-center">
              <h1 className="gradient_text xl:w-[440px] max-md:w-[300px] md:text-[44px] text-[32px]">
                Frequently asked <span>Questions</span>{" "}
              </h1>
            </div>

            <div className="faq">
              {faq.map((x, index) => (
                <div
                  className={`${
                    openDetail[index] && "openState"
                  } mb-2 py-[26px] md:px-8`}
                  key={index}
                >
                  <div
                    className="flex items-center  justify-between  cursor-pointer md:text-[20px] text-white text-[14px] px-2"
                    onClick={() => handleClick(index)}
                  >
                    <p
                      className={`${
                        openDetail[index] && "text-secText"
                      } flex items-center gap-3 `}
                    >
                      {" "}
                      <Image
                        src={Dot}
                        width={8}
                        height={8}
                        alt="right"
                        className=""
                      />
                      {x.title}
                    </p>

                    <motion.div
                      className="toggle ml-3 min-w-[30px]"
                      initial={false}
                      animate={{ rotate: openDetail[index] ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Image
                        src={ChervonUp}
                        width={29}
                        height={29}
                        alt="right"
                        className=""
                      />
                    </motion.div>
                  </div>

                  {openDetail[index] && (
                    <div className="border-t border-secText mt-4 max-md:px-2">
                      <p className=" text-white mt-3">{x.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
      <Footer/>
    </>
  );
};

export default Faq;

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
