import React from 'react'
import Link from 'next/link'

export default function NotFound() {
  return (
  <div className ='container h-screen flex flex-col gap-5 justify-center items-center  '>
    <h2>Not Found</h2>
    <p>Could not find requested resource</p>
    <Link href='/' className='hover:underline hover:underline-offset-2 '>Return Home</Link>
  </div>
)
}   