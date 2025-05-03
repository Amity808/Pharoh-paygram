// import { cookieStorage, createStorage, http } from '@wagmi/core'
import Navbar from "@/components/Navbar";


export default function Home() {

  return (
    <div className={"pages"}>
      <Navbar />
      <div className=" text-center">
        <div className=" flex justify-center items-center">
        <p className=" text-3xl ">
        Paygram Chain  <br />
        Allow You To Settle Your Employee Payment <br /> on Chain backed by stablecoin.
        </p>
        </div>
        
      </div>
    </div>
  );
}