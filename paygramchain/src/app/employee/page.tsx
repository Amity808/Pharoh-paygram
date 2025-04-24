import React from 'react'
import Navbar from '@/components/Navbar'
import Addemployee from '@/components/Addemployee'
type Props = {}

const Employee = (props: Props) => {
  return (
    <div>
        <Navbar />
        <div>
            <Addemployee />
        </div>

    </div>
  )
}

export default Employee