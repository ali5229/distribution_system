"use client"
import Link from 'next/link';
import BackButton from '@/app/components/backButton/backButton';

export default function MaterialForm(){
  return(

    <main className='m-10 flex flex-col'>
      <div className='flex flex-row'>
       <BackButton />
      <p className="text-3xl font-bold">Material Management</p></div>
      <div className='flex gap-6 p-8 w-5xl  bg-white mt-[30px] rounded-lg shadow-md'>
            
      
      </div>
    </main>
  )
}

 