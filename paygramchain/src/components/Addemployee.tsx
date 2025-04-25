'use client'
import React, { useState } from 'react'
import PAYMENTABI from "@/contract/abi.json"
import ERC20Abi from "@/contract/erc20.json"
import { Button } from './ui/button'
import { contractAddress, tokenAddress } from '@/helper/constant'
import { useWriteContract, useSimulateContract, useReadContract, useAccount } from 'wagmi'

import { parseEther } from 'viem'
import { toast } from 'react-toastify'


const Addemployee = () => {
    const [employee, setEmployee] = useState('')
    const [salary, setSalary] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const { address } = useAccount()


    const { writeContractAsync } = useWriteContract()
    // 0xe238b320A22af4c4EAf607cf30843e6eB7de567C

    const amountformat = parseEther(salary.toString())


    const { data: simulateRegEmployee, error: simulateRegEmployeeError } = useSimulateContract({
        abi: PAYMENTABI,
        address: contractAddress,
        functionName: "addEmployee",
        args: [address, employee, amountformat, tokenAddress]
    })

    console.log(simulateRegEmployeeError, "simulateRegEmployeeError")

    const handleRegEmployee = async (e: any) => {
        setIsLoading(false)
        e.preventDefault();

        try {
            const response = await writeContractAsync({
                abi: PAYMENTABI,
                address: contractAddress,
                functionName: "addEmployee",
                args: [address, employee, amountformat, tokenAddress]
            })
            toast.success("Employee added Successfully")
        } catch (error) {
            console.log(error)
            toast.error("Unexpected Error")
            setIsLoading(false)
        } finally {
            setIsLoading(false);
        }

    }





    return (
        <div className=' flex justify-center items-center mt-10'>

            <form action="" className='gap-7 flex justify-items-center flex-col' onSubmit={handleRegEmployee}>

                <div>
                    <label className="floating-label">
                        <input type="text" value={employee} onChange={
                            (e) => setEmployee(e.target.value)
                        } placeholder="EmployeeAddress" className="input input-lg border-2 border-solid" />
                        <span>Employee Address</span>
                    </label>
                </div>
                <div>
                    <label className="floating-label">
                        <input type="text" placeholder="Salary" value={salary ?? 0} onChange={
                            (e) => setSalary(Number(e.target.value))
                        } className="input input-lg border-2 border-solid" />
                        <span>Salary</span>
                    </label>
                </div>

                <Button className=' bg-black' type='submit'>Register</Button>
            </form>
        </div>
    )
}

export default Addemployee