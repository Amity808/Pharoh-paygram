import Register from '@/components/Register'
import React from 'react'
import Navbar from '@/components/Navbar'

type Props = {}

const RegisterPage = (props: Props) => {
  return (
    <div>
        <Navbar />
        <Register />
    </div>
  )
}

export default RegisterPage