'use client'
import React, { useState, useCallback, useEffect } from 'react'
import { useAccount, useWriteContract, useReadContract } from 'wagmi'
import { truuncateAddress } from '@/lib/utils'
import PAYMENTABI from "@/contract/abi.json"
import { contractAddress } from '@/helper/constant'
import { IdenticonAddress } from './Blockies'
import { formatEther } from 'viem'
import { toast } from 'react-toastify'
interface EmployeeInterface {
    company: `0x${string}`;
    metadata: string;
    employeeAddress: `0x${string}`;
    token: `0x${string}`;
    salary: number;
    totalPaid: number;
    lastpayment: number;
    isPaid: boolean;
}

interface PaymentTableProps {
    id: string;
}

const PaymentTable = ({ id }: PaymentTableProps) => {

    const [Employee, setEmployee] = useState<EmployeeInterface | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    // const [dataFetched, setDataFetched] = useState()
    const { address } = useAccount()
    const { writeContractAsync } = useWriteContract()

    const { data: employDetails } = useReadContract({
        abi: PAYMENTABI,
        address: contractAddress,
        functionName: "_employee",
        args: [id]
    })


    const formatedData = useCallback(async () => {
        if (!employDetails || !Array.isArray(employDetails) || employDetails.length < 6) {
            console.error("employDetails is empty or invalid:", employDetails);
            return;
        }
        if (!employDetails) {
            return;
        }
        setEmployee({
            company: employDetails[0],
            metadata: employDetails[1],
            employeeAddress: employDetails[2],
            token: employDetails[3],
            salary: employDetails[4],
            totalPaid: employDetails[5],
            lastpayment: employDetails[6],
            isPaid: employDetails[7]
        })
    }, [employDetails])

    useEffect(() => {
        formatedData()
    }, [formatedData])

    const paySalary = async () => {
        setIsLoading(true)
        try {
            const res = await writeContractAsync({
                abi: PAYMENTABI,
                address: contractAddress,
                functionName: "distributeSalary",
                args: [id]
            })
            if(res) {
                toast.success("Successfully paided");
            }
        } catch (error) {
            console.log(error)
            setIsLoading(false)
        }finally {
            setIsLoading(false)
        }
    }
    // const fetchImage = async () => {
    //     try {
            
    //     } catch (error) {
            
    //     }
    // }

    if (!Employee) return null;
    


    return (
        <div>
            <div className="overflow-x-auto">
                <table className="table">
                    {/* head */}
                    <thead>
                        <tr>
                            <th>
                                Company Address
                            </th>
                            <th>Token</th>
                            <th>Total Paid</th>
                            <th>IsPaid</th>
                            <th>Pay</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* row 1 */}
                        <tr>
                            <th>
                                {truuncateAddress(address as `0x${string}`)}
                            </th>
                            <td>
                                <div className="flex items-center gap-3">
                                    <div className="avatar">
                                        <div className="mask mask-squircle h-12 w-12">
                                            <IdenticonAddress address={Employee?.employeeAddress} size={50} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="font-bold">{truuncateAddress(Employee?.employeeAddress)}</div>
                                        <div className="text-sm opacity-50">United States</div>
                                    </div>
                                </div>
                            </td>
                            <td>
                                Total Paid {Employee?.totalPaid ? formatEther(BigInt(Employee.totalPaid), "wei") : '0'}                                <br />
                                <span className="badge badge-ghost badge-sm px-4">Salary {Employee?.salary ? formatEther(BigInt(Employee.salary), "wei") : '0'} MTK</span>
                            </td>
                            <td>{Employee?.isPaid ? "Paid" : "not paid"}</td>
                            <th>
                                <button className="btn btn-ghost btn-xs" onClick={paySalary} disabled={isLoading}>{ isLoading ? "Paying" : "Pay"}</button>
                            </th>
                        </tr>
                    </tbody>
                    {/* foot */}
                    <tfoot>
                        <tr>
                            <th></th>
                            <th>Name</th>
                            <th>Job</th>
                            <th>Favorite Color</th>
                            <th></th>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}

export default PaymentTable