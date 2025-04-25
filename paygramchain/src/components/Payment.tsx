'use client'
import React, { useState, useCallback, useEffect } from 'react'
import { useReadContract, useAccount } from 'wagmi'
import PaymentTable from './PaymentTable'
import { contractAddress, tokenAddress } from '@/helper/constant'
import PAYMENTABI from "@/contract/abi.json"
type Props = {}

const Payment = (props: Props) => {

  const [employeeId, setEmployeeId] = useState<Map<string, string>>(new Map());
  const { address } = useAccount();

  const { data: employeeLength } = useReadContract({
    abi: PAYMENTABI,
    address: contractAddress,
    functionName: "employeeLength",
    args: []
  })

 



  const setEmployeeIds = useCallback(() => {
    try {
      if (!employeeLength) {
        console.log("employeeLength is undefined or null");
        return;
      }

      const newMap = new Map<string, string>();
      // Check if employeeLength is a bigint and greater than 0
      if (typeof employeeLength === 'bigint' && employeeLength > 0) {
        // Assuming employee IDs start from 0 and go up to employeeLength - 1
        for (let i = 0; i < employeeLength; i++) { // Use bigint for loop counter
          newMap.set(i.toString(), i.toString()); // Store employee IDs as strings
        }
        setEmployeeId(new Map(newMap));
      } else {
        console.log("employeeLength is not a valid bigint:", employeeLength);
      }
    } catch (error) {
      console.error("Error setting employee IDs:", error);
    }
  }, [employeeLength])

  useEffect(() => {
    setEmployeeIds()
  }, [employeeLength, setEmployeeIds])

  
  return (
    <div>

      {[...employeeId.entries()].map(([key, value]) => (
        <PaymentTable key={key} id={value} />
      ))}
      {/* <PaymentTable key={0} id={0} /> */}

    </div>
  )
}

export default Payment