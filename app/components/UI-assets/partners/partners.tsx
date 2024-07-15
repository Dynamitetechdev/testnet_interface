import Image from "next/image";
import { StellarBrand } from "../../assets";

const Partners = () => {
  return (
    <div className="w-full my-10 mb-32 z-[9999]">

    <div className="partners mx-auto">
      <p className="text-center text-priText">Building on and alongside the largest ecosystems</p>
      <div className="brands flex md:gap-[80px] gap-10 justify-center mt-8 flex-wrap">
        {
          Array(1).fill('').map((el, index) => (
            <Image
            src={StellarBrand}
            width={145}
            height={53}
            alt="right"
            className="arrow"
            key={`brand-${index}`}
          />
          ))
        }
      </div>
    </div>
    </div>
  );
};

export default Partners;
