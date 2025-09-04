import Link from 'next/link';
import AreaPic from './assets/home/Area.png'
import MateralPic from './assets/home/material.png'
import SalesmanPic from './assets/home/salesman.png'
import Image from 'next/image';

export default function Home(){
  return(
    <main className='flex flex-row'>
    <div className="flex gap-6 p-8">
      <Link href="/interfaces/area">
       <div className='flex flex-col items-center p-8 border-2 border-solid border-[#F3F6F8] rounded-xl shadow-md cursor-pointer bg-white hover:scale-102 transition-transform duration-200 w-3xs'>
        <Image height={50} src={AreaPic} alt='Area Pic' />
        <p className='font-bold mt-[20px]'>Area Management</p>
       </div>
      </Link>
    </div>
    <div className="flex gap-6 p-8">
      <Link href="/interfaces/material">
       <div className='flex flex-col items-center p-8 border-2 border-solid border-[#F3F6F8] rounded-xl shadow-md cursor-pointer bg-white hover:scale-102 transition-transform duration-200 w-3xs'>
        <Image height={50} src={MateralPic} alt='Area Pic' />
        <p className='font-bold mt-[20px]'>Material Management</p>
       </div>
      </Link>
    </div>
    <div className="flex gap-6 p-8">
      <Link href="/interfaces/salesman">
       <div className='flex flex-col items-center p-8 border-2 border-solid border-[#F3F6F8] rounded-xl shadow-md cursor-pointer bg-white hover:scale-102 transition-transform duration-200 w-3xs'>
        <Image height={50} src={MateralPic} alt='Area Pic' />
        <p className='font-bold mt-[20px]'>Salesman Management</p>
       </div>
      </Link>
    </div>
    </main>
  );
}