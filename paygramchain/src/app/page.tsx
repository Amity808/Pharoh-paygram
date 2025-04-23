// import { cookieStorage, createStorage, http } from '@wagmi/core'
import { ConnectButton } from "@/components/ConnectButton";
import { InfoList } from "@/components/InfoList";
import { ActionButtonList } from "@/components/ActionButtonList";
import Navbar from "@/components/Navbar";
import Image from 'next/image';

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