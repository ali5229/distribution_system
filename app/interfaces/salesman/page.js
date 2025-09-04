import Link from 'next/link';
import Image from 'next/image';
import AddSalesmanPic from '../../assets/salesman/add_salesman.png';
import AssignAreaPic from '../../assets/salesman/assign_area.png';
import BackButton from '@/app/components/backButton/backButton';

export default function SalesmanPage(){
  return(
    <main className='m-10 flex flex-col'>
      <div className='flex flex-row'>
      <BackButton />
      <p className="text-3xl font-bold">Salesman Management</p>
      </div>
    <div className='flex flex-row'>
    <div className="flex gap-6 p-8">
      <Link href="/interfaces/salesman/addSalesman">
       <div className='flex flex-col items-center p-8 border-2 border-solid border-[#F3F6F8] rounded-xl shadow-md cursor-pointer bg-white hover:scale-102 transition-transform duration-200 w-3xs'>
        <Image height={50} src={AddSalesmanPic} alt='Area Pic' />
        <p className='font-bold mt-[20px]'>Add/Edit Salesman</p>
       </div>
      </Link>
    </div>
    <div className="flex gap-6 p-8">
      <Link href="/interfaces/salesman/assignArea">
       <div className='flex flex-col items-center p-8 border-2 border-solid border-[#F3F6F8] rounded-xl shadow-md cursor-pointer bg-white hover:scale-102 transition-transform duration-200 w-3xs'>
        <Image height={50} src={AssignAreaPic} alt='Area Pic' />
        <p className='font-bold mt-[20px]'>Assign Area</p>
       </div>
      </Link>
    </div>
    </div>
    </main>
  );
}