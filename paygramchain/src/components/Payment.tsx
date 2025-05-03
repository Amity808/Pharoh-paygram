'use client'
import React, { useState, useCallback, useEffect } from 'react'
import { useReadContract } from 'wagmi'
import PaymentTable from './PaymentTable'
import { contractAddress } from '@/helper/constant'
import PAYMENTABI from "@/contract/abi.json"


const Payment = () => {

  const [employeeId, setEmployeeId] = useState<Map<string, string>>(new Map());


  const { data: employeeLength } = useReadContract({
    abi: PAYMENTABI,
    address: contractAddress,
    functionName: "employeeLength",
    args: []
  })

  console.log(employeeLength, "empy")
 



  const setEmployeeIds = useCallback(() => {
    try {
      if (!employeeLength) {
        console.log("employeeLength is undefined or null");
        return;
      }

      const newMap = new Map<string, string>();
      // Check if employeeLength is a bigint and greater than 0
      if (typeof employeeLength === 'bigint' && employeeLength > 0) {
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