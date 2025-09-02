import Link from 'next/link';

export default function Area(){
  return(

    <main className='m-10 flex flex-col'>
      <p className="text-3xl font-bold">Area Management</p>
      <div className='flex gap-6 p-8 w-5xl  bg-white mt-[30px] rounded-lg shadow-md'>
         <div className='flex flex-row w-4xl justify-between'>
            <div className='flex flex-row justify-between'>
               <Link href="/interfaces/area/add">
                <div className='p-3 flex justify-center align-middle border h-[50px] w-[] rounded-xl cursor-pointer hover:shadow-lg bg-[#5145E7] border-none text-white'>
                    Add New Area
                </div>
              </Link>
              <Link href="/interfaces/subarea">
                <div className='p-3 flex justify-center align-middle border h-[50px] w-[] rounded-xl cursor-pointer hover:shadow-lg bg-[#5145E7] border-none text-white ml-2'>
                    Add New Sub-area
                </div>
              </Link>
            </div>

            <div className='flex flex-row justify-between' >
              <Link href="/interfaces/area/update">
                <div className='p-3 flex justify-center align-middle border h-[50px] w-[] rounded-xl cursor-pointer hover:shadow-lg bg-[#5145E7] border-none text-white'>
                    Update Area
                </div>
              </Link>
              <Link href="/interfaces/subarea/update">
                <div className='p-3 flex justify-center align-middle border h-[50px] w-[] rounded-xl cursor-pointer hover:shadow-lg bg-[#5145E7] border-none text-white ml-2'>
                    Update Sub-area
                </div>
              </Link>
            </div>
         </div>
            
      
      </div>
    </main>
  )
}

 