import React from 'react'
import { ConnectButton } from "@/components/ConnectButton";
import Link from 'next/link';


const Navbar = () => {
    return (
       <div className=' flex justify-between flex-row p-[20px]'>
        <div>
            <h1 className=' font-bold text-3xl'>PayGram</h1>
        </div>
        <div>
            <ul className=' flex flex-row gap-5 cursor-pointer'>
                <li>
                    <Link href="/dashboard">Dashboard</Link>
                </li>
                <li>
                <Link href="/register">Register</Link>
                </li>
                <li>
                <Link href="/employee">Add Employee</Link>
                </li>
            </ul>
        </div>
        <div>
            <ConnectButton />
        </div>
        </div>
    )
}

export default Navbar