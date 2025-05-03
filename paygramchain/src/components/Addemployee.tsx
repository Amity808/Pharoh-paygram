'use client'
import React, { useState } from 'react'
import PAYMENTABI from "@/contract/abi.json"
// import ERC20Abi from "@/contract/erc20.json"
import { Button } from './ui/button'
import { contractAddress, tokenAddress } from '@/helper/constant'
import { useWriteContract, useAccount } from 'wagmi'
import { makeContractMetadata } from '@/helper/Upload'
import { parseEther } from 'viem'
import { toast } from 'react-toastify'
import { PayEmailNotification } from '@/helper/mail'
// import Image from 'next/image';


const Addemployee = () => {
    const [employee, setEmployee] = useState('')
    const [salary, setSalary] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [name, setName] = useState('')
    const [emailAddress, setEmailAddress] = useState('')
    const [userImage, setUserImage] = useState<File | null>(null)
    const [description, setDescription] = useState('')
    const { address } = useAccount()


    const { writeContractAsync } = useWriteContract()
    // 0xe238b320A22af4c4EAf607cf30843e6eB7de567C

    const amountformat = parseEther(salary.toString())




    const pharosBaseScan = `https://pharosscan.xyz`

        /* eslint-disable @typescript-eslint/no-explicit-any */
    const handleRegEmployee = async (e: any) => {
        setIsLoading(false)
        e.preventDefault();

        if (!userImage) {
            alert("Please upload an image file.");
            return;
        }

        try {

            const metadata = await makeContractMetadata({
                imageFile: userImage,
                name,
                description
            })

            const proxyData = {
                abi: PAYMENTABI,
                address: contractAddress,
                functionName: "addEmployee",
                args: [address, metadata, employee, amountformat.toString(), tokenAddress]
            }

            const response = await fetch('/api/proxy', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(proxyData)
            })
            console.log(response, "response")
            console.log(metadata, "metadata")
            const responseContract = await writeContractAsync({
                abi: PAYMENTABI,
                address: contractAddress,
                functionName: "addEmployee",
                args: [address, metadata, employee, amountformat, tokenAddress]
            })
            console.log(responseContract, "response")
            const link = `${pharosBaseScan}/tx/${responseContract}`
            const mailSent = await PayEmailNotification({link, recipentName: name, address: employee, email: emailAddress, subjectLine: description})
            console.log(mailSent, "mailSent")
            toast.success("Employee added Successfully")
                /* eslint-disable @typescript-eslint/no-explicit-any */
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
                        <input type="text" value={name} onChange={
                            (e) => setName(e.target.value)
                        } placeholder="Name" className="input input-lg border-2 border-solid" />
                        <span>Employee Name</span>
                    </label>
                </div>
                <div>
                    <label className="floating-label">
                        <input type='file'
                            accept='image/*' onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                if (e.target.files && e.target.files[0]) {
                                    setUserImage(e.target.files[0]);
                                }
                            }} placeholder="Employee Image" className="input input-lg border-2 border-solid" />
                        <span>Employee Image</span>
                    </label>
                </div>
                <div>
                    <label className="floating-label">
                        <input type="text" value={description} onChange={
                            (e) => setDescription(e.target.value)
                        } placeholder="Employee Description" className="input input-lg border-2 border-solid" />
                        <span>Employee Description</span>
                    </label>
                </div>
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
                        <input type="text" value={emailAddress} onChange={
                            (e) => setEmailAddress(e.target.value)
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

                <Button className=' bg-black input input-lg cursor-pointer' type='submit' disabled={isLoading}>{isLoading ? "Adding" : "Register"}</Button>
            </form>
        </div>
    )
}

export default Addemployee