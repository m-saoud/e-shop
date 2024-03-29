"use client"
import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'


export const Notification = () => {
  return (
    <ToastContainer
position="bottom-center"
autoClose={3000}
hideProgressBar={false}
closeOnClick
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="colored"
/>
  )
}
