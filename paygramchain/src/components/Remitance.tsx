
import React, { useState } from 'react'
import { makeRemitanceContractMetadata } from '@/helper/Upload';
import { contractAddress, tokenAddress } from '@/helper/constant'
import { useWriteContract } from 'wagmi'
import { parseEther } from 'viem'
import PAYMENTABI from "@/contract/abi.json"

const Remitance = () => {
    const [receiver, setReceiver] = useState('');
    const [name, setName] = useState('');
    const [emailAddress, setEmailAddress] = useState('');
    const [amount, setAmount] = useState(0);
    // const [isLoading, setIsLoading] = useState(false);


    const { writeContractAsync } = useWriteContract()

    const amountformat = parseEther(amount?.toString());


    const handleRemitance = async () => {

        try {
            const metadata = await makeRemitanceContractMetadata({
                name, emailAddress
            })

            const response = await writeContractAsync({
                abi: PAYMENTABI,
                address: contractAddress,
                functionName: "initiateRemittance",
                args: [receiver, metadata, amountformat, tokenAddress, amountformat]
            })
            console.log(response, "response")

                /* eslint-disable @typescript-eslint/no-explicit-any */
        } catch (error) {
            console.log(error,"error")
        }

    }


  return (
    <div>
        <form action="" className='gap-7 flex justify-items-center flex-col' onSubmit={handleRemitance}>
        <div>
                    <label className="floating-label">
                        <input type="text" value={name} onChange={
                            (e) => setName(e.target.value)
                        } placeholder="Reciepent Name" className="input input-lg border-2 border-solid" />
                        <span>Reciepent Name</span>
                    </label>
                </div>
                <div>
                    <label className="floating-label">
                        <input type="text" value={emailAddress} onChange={
                            (e) => setEmailAddress(e.target.value)
                        } placeholder="Reciepent Email" className="input input-lg border-2 border-solid" />
                        <span>Reciepent Email</span>
                    </label>
                </div>
                <div>
                    <label className="floating-label">
                        <input type="text" value={amount} onChange={
                            (e) => setAmount(Number(e.target.value))
                        } placeholder="Amount" className="input input-lg border-2 border-solid" />
                        <span>Amount</span>
                    </label>
                </div>
                <div>
                    <label className="floating-label">
                        <input type="text" value={receiver} onChange={
                            (e) => setReceiver(e.target.value)
                        } placeholder="Receiver Address" className="input input-lg border-2 border-solid" />
                        <span>Receiver Address</span>
                    </label>
                </div>
        </form>
    </div>
  )
}

export default Remitance