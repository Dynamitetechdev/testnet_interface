"use client";
import { useEffect, useRef, useState } from "react";
// import {  useInView } from "../page";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChervonUp, Dot } from "../components/assets";
import Header from "../components/navigations/header";
import Footer from "../components/navigations/footer";
import emailjs from "@emailjs/browser";
import Loading from "../components/UI-assets/loading";
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
const Contact = () => {
  const faqRef: any = useRef(null);
  const faqInView = useInView(faqRef);
  const form: any = useRef();
  const [isPending, setIsPending] = useState(false);
  const sendEmail = (e: any) => {
    e.preventDefault();
    setIsPending(true);
    emailjs
      .sendForm(
        "service_6yeh64l",
        "template_ae6ft2j",
        form.current,
        "4-3mciVijUFC0HE--"
      )
      .then(
        (result: any) => {
          console.log(result.text);

          setIsPending(false);
        },
        (error: any) => {
          console.log(error.text);
        }
      );
  };
  return (
    <>
      <Header />
      <main className="w-full md:pb-20 md:pt-16 z-[99]">
        {/* FAQ Profit */}
        <motion.div
          ref={faqRef}
          variants={getAnimationVariants(0)}
          initial="out"
          animate={faqInView ? "in" : "out"}
          className="faq_section w-full md:pt-40 pt-20"
          id="faqs"
        >
          <div className="xl:w-[1060px] mx-auto w-11/12">
            <div className="md:flex justify-between items-center">
              <h1 className="gradient_text md:w-[440px] md:text-[44px] text-[32px] md:leading-[58px] leading-[45px] max-md:mb-2 ">
                Want to integrate <span>in your DAPP? </span>
              </h1>
              <p className="subtitle_p md:w-[455px]">
                Unlock the full potential of your decentralized application by
                integrating with BondHive’s robust API. Our tools are designed
                to provide seamless connectivity, allowing you to incorporate
                our innovative financial products directly into your platform.
              </p>
            </div>

            <form className="md:w-9/12 mx-auto mt-10" ref={form} onSubmit={sendEmail}>
              <p className="text-sm my-7 text-center text-secText">Request more information, schedule a meeting or share your thoughts on Bondhive</p>
            <div className="mb-6 grid gap-6 gap-y-5 md:grid-cols-2">
              <div>
                <input
                  type="text"
                  id="name"
                  className="text-secText max-md:py-[16px] block w-full p-2 py-4 pl-3 text-[16px] outline-none bg-dappHeaderBg border-border_pri border rounded-md"
                  placeholder="Name*"
                  name="name"
                  // value={input.common}
                  // onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div>
                <input
                  type="text"
                  id="email"
                  className="text-secText max-md:py-[16px] block w-full p-2 py-4 pl-3 text-[16px] outline-none bg-dappHeaderBg border-border_pri border rounded-md"
                  placeholder="Email*"
                  name="email"
                  // value={input.common}
                  // onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div>
                <input
                  type="text"
                  id="company"
                  className="text-secText max-md:py-[16px] block w-full p-2 py-4 pl-3 text-[16px] outline-none bg-dappHeaderBg border-border_pri border rounded-md"
                  placeholder="Company*"
                  name="company"
                  // value={input.common}
                  // onChange={(e) => handleInputChange(e)}
                />
              </div>
              <div>
                <input
                  type="text"
                  id="reason"
                  className="text-secText max-md:py-[16px] block w-full p-2 py-4 pl-3 text-[16px] outline-none bg-dappHeaderBg border-border_pri border rounded-md"
                  placeholder="Reason*"
                  name="reason"
                  // value={input.common}
                  // onChange={(e) => handleInputChange(e)}
                />
              </div>
            </div>
            <div>
                <textarea
                  id="message"
                  className="text-secText max-md:py-[16px] h-[300px] block w-full p-2 py-4 pl-3 text-[16px] outline-none bg-dappHeaderBg border-border_pri border rounded-md"
                  placeholder="Message*"
                  name="message"
                  // value={input.common}
                  // onChange={(e) => handleInputChange(e)}
                />
              </div>

              <button className="button2 w-full py-4 my-5">{ isPending ? <div className="w-[20px] mx-auto">
                <Loading/> 
              </div> : "Submit"}</button>
          </form>
          </div>
        </motion.div>
      </main>
      <Footer />
    </>
  );
};

export default Contact;

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
