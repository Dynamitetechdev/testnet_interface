import { ChartBarIcon, CircleStackIcon, CurrencyEuroIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileNav() {
    const pathName = usePathname()
    return (
        <div className="bg-[#170a28] border-t border-dappHeaderBorder fixed z-[999] w-full bottom-0 py-6 hidden max-lg:block">
        <ul className="flex justify-center gap-10 pl-3">
        <Link href={"/app"}>
          <li className={`flex items-center gap-2 ${pathName === "/app" ? "text-[#937ED6]" : "text-white"}`}>
          <CurrencyEuroIcon className="w-[20px]"/>
            <p>Invest</p>
          </li>
          </Link>
           <Link href={"/app/markets"}>
          <li className={`flex items-center gap-2 ${pathName === "/app/markets" ? "text-[#937ED6]" : "text-white"}`}>

          <ChartBarIcon className="w-[20px]"/>
            <p>Markets</p>
          </li>
          </Link>
           <Link href={"/app/farm"}>
          <li className={`flex items-center gap-2 ${pathName === "/app/farm" ? "text-[#937ED6]" : "text-white"}`}>

          <CircleStackIcon className="w-[20px]"/>
            <p>farm</p>
          </li>
          </Link>
          
        </ul>
      </div>
    );
}