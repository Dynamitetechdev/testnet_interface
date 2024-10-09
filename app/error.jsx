"use client"

import Link from "next/link";
import Header from "./components/navigations/header";
const error = () => {
    return ( 
        <div className="text-center text-white">
                <Header />
        <h1 className="md:text-4xl text-2xl mt-60 md:w-10/12 w-11/12 mx-auto">We are Working on Bondhive Server, we will be back up in few hours. thank you</h1>
        {/* <Link href={'https://civfund.org/'} className="underline">https://civfund.org/</Link> */}
        </div>
      );
}
 
export default error;