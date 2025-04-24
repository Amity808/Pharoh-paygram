import React from 'react'
import Payment from '@/components/Payment'
import Navbar from '@/components/Navbar'


type Props = {}

const Dashboard = (props: Props) => {
  return (
    <div>
      <div>
        <Navbar />
      </div>
        <Payment />
    </div>
  )
}

export default Dashboard