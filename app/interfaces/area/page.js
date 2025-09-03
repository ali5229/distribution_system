"use client"
import Link from 'next/link';
import BackButton from '@/app/components/backButton/backButton';
import AddBlue from '../../assets/area/add-blue.png'
import UpdateBlue from '../../assets/area/update-blue.png'
import AddOrange from '../../assets/area/add-orange.png'
import UpdateOrange from '../../assets/area/update-orange.png'
import Image from 'next/image';

export default function Area(){
  return(

    <main className='m-10 flex flex-col'>
      <div className='flex flex-row'>
       <BackButton />
      <p className="text-3xl font-bold">Area Management</p></div>
      <div className='flex gap-6 p-8 w-5xl  bg-white mt-[30px] rounded-lg shadow-md'>
         <div className='flex flex-row w-4xl justify-between'>
            <div className='flex flex-row justify-between'>
               <Link href="/interfaces/area/add">
                <div className='p-3 flex justify-center align-middle border h-[50px]  rounded-xl cursor-pointer hover:shadow-lg bg-[#5145E7] border-none text-white'>
                  <Image height={30} width={25} src={AddBlue} alt='Add-icon'/>Add New Area
                </div>
              </Link>
              <Link href="/interfaces/subarea">
                <div className='p-3 flex justify-center align-middle border h-[50px] w-[] rounded-xl cursor-pointer hover:shadow-lg bg-[#CA3C25] border-none text-white ml-2'>
                  <Image height={30} width={25} src={AddOrange} alt='Add-icon'/>Add New Sub-area
                </div>
              </Link>
            </div>

            <div className='flex flex-row justify-between' >
              <Link href="/interfaces/area/update">
                <div className='p-3 flex justify-center align-middle border h-[50px] w-[] rounded-xl cursor-pointer hover:shadow-lg bg-[#5145E7] border-none text-white'>
                   <Image height={30} width={25} src={UpdateBlue} alt='Add-icon'/> Update Area
                </div>
              </Link>
              <Link href="/interfaces/subarea/update">
                <div className='p-3 flex justify-center align-middle border h-[50px] w-[] rounded-xl cursor-pointer hover:shadow-lg bg-[#CA3C25] border-none text-white ml-2'>
                  <Image height={30} width={25} src={UpdateOrange} alt='Add-icon'/>  Update Sub-area
                </div>
              </Link>
            </div>
         </div>
            
      
      </div>
    </main>
  )
}

 