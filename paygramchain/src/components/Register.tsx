'use client'
import React, { useState } from 'react'
import { useWriteContract, useReadContract } from 'wagmi'
import { contractAddress, tokenAddress } from '@/helper/constant'
import PAYMENTABI from "@/contract/abi.json"
import ERC20Abi from "@/contract/erc20.json"
import { toast } from 'react-toastify'

import { Button } from './ui/button'
import { parseEther } from 'viem'


const Register = () => {

  const [amount, setAmount] = useState(0)
  const [token, setToken] = useState('')
  const [payInterval, setPayInterval] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const { writeContractAsync } = useWriteContract()
  // 0xe238b320A22af4c4EAf607cf30843e6eB7de567C


  const amountformat = parseEther(amount.toString())

  

  const ownerAdd = process.env.NEXT_PUBLIC_OWNER

  const { data: allowanceState } = useReadContract({
    abi: ERC20Abi,
    address: tokenAddress,
    functionName: "allowance",
    args: [ownerAdd, contractAddress]
  })

  console.log(allowanceState)



    /* eslint-disable @typescript-eslint/no-explicit-any */
  const hanldeReg = async (e: any) => {
    setIsLoading(false);
    e.preventDefault()
    try {
      // if (!simulateRegisteration) {
      //   console.error("Simulation failed or not ready");
      //   console.log("Simulation Error:", simulateRegError);
      //   return;
      // }
      // await writeContractAsync(simulateApproveToken!.request);
      // // const response = await writeContractAsync(simulateRegisteration!.request)
      // console.log(response)


      if (Number(allowanceState) > Number(amountformat)) {
      
      const response = await writeContractAsync({
        abi: PAYMENTABI,
        address: contractAddress,
        functionName: "registerCompany",
        args: [tokenAddress, amountformat, payInterval]
      })
      console.log(response);
      } else {
      await writeContractAsync({
        abi: ERC20Abi,
    address: tokenAddress,
    functionName: "approve",
    args: [contractAddress, amountformat]
      });
      const response = await writeContractAsync({
        abi: PAYMENTABI,
        address: contractAddress,
        functionName: "registerCompany",
        args: [tokenAddress, amountformat, payInterval]
      })
      console.log(response)
      // todo: view on pharos scan
      toast.success("Company created successsfully")


      }

      //   toast.success("Approve token spending cap")
      //   const response = await writeContractAsync({
      //     abi: PAYMENTABI,
      //     address: contractAddress, functionName: "registerCompany",
      //     args: [tokenAddress as `0x${string}`, BigInt(amount), payInterval]
      //   })

      //   toast.success("Company created successsfully")
      // }

      // const response = await writeContractAsync({
      //       abi: PAYMENTABI,
      //       address: contractAddress, functionName: "registerCompany",
      //       args: [tokenAddress as `0x${string}`, BigInt(amount), payInterval]
      //     })

    /* eslint-disable @typescript-eslint/no-explicit-any */
    } catch (error) {
      console.log("Error in handleReg:", error)
      toast.error("Get a company role from the protocol or already a registered company")
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <div className=' flex justify-center items-center mt-10'>

      <form action="" className='gap-7 flex justify-items-center flex-col' onSubmit={hanldeReg}>

        <div>
          <label className="floating-label">
            <input type="text" value={token} onChange={
              (e) => setToken(e.target.value)
            } placeholder="Token" className="input input-lg border-2 border-solid" />
            <span>Token</span>
          </label>
        </div>
        <div>
          <label className="floating-label">
            <input type="text" placeholder="Amount" value={amount ?? 0} onChange={
              (e) => setAmount(Number(e.target.value))
            } className="input input-lg border-2 border-solid" />
            <span>Amount</span>
          </label>
        </div>
        <div>
          <label className="floating-label">
            <input type="text" placeholder="Pay Interval" value={payInterval} onChange={
              (e) => setPayInterval(Number(e.target.value))
            } className="input input-lg border-2 border-solid" />
            <span>Pay Interval</span>
          </label>
        </div>
        <Button className=' bg-black' disabled={isLoading} type='submit'>Register</Button>
      </form>
    </div>
  )
}

export default Register