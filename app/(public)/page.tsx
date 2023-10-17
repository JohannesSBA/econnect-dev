'use client'
import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider } from 'next-themes'
import  Navbar  from '../components/Navbar'
import Image from 'next/image'
import Main from '../components/Main'
import About from '../components/About'
import Progress from '../components/Progress'

export default function Home() {
  return (
    <div className='w-full dark:bg-blue-900 bg-indigo-400'>
      <NextUIProvider>
        <ThemeProvider attribute='class'>
          <Progress />
          <Navbar />
          <Main />
          <About />
        </ThemeProvider>
        </NextUIProvider>
    </div>
    
  )
}
