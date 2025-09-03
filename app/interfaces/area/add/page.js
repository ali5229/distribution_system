"use client"
import {useState, useEffect} from 'react'
import BackButton from '@/app/components/backButton/backButton';
import Spinner from '@/app/components/Spinner/loadSpinner';

export default function Area(){
   const [areaName, setAreaName] = useState('');
   const [saving, setSaving] = useState(false);
   const [msg, setMsg] = useState("");
   const [areaId, setAreaId] = useState("");
    const fetchNextId = async () => {
    try {
      const res = await fetch("/api/areas");
      const data = await res.json();
      if (res.ok) {
        setAreaId(data.nextId);
      } else {
        console.error(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

     useEffect(() => {
    fetchNextId(); 
  }, []);

   const onSave = async() =>{
    if(!areaName.trim()){
      setMsg("Area name is required");
      return;
    }
    try{
      setSaving(true);
      setMsg("");
      const res = await fetch('/api/areas',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({areaName})
      });
      const json = await res.json();
      if(!res.ok) throw new Error(json.error || "Something went wrong");
       setMsg(
        `Saved! Area ID ${json.areaId}`);
      setAreaName("");
      fetchNextId();
    } catch(e){
      setMsg(e.message);
    } finally{
      setSaving(false);
    }
   }
   
   const onCancel = () => {
    setAreaName("");
    setMsg("");
  };

  return(

    <main className='m-10 flex flex-col'>
      <div className='flex flex-row'>
              <BackButton />
            <p className="text-3xl font-bold">Add New Area</p></div>
      <div className='flex flex-col gap-6 p-8 w-5xl h-80 bg-white mt-[30px] rounded-lg shadow-md relative'>
         <div className='w-full'>
            <p className='font-bold'>ID = {areaId}</p>
            <p className='mt-[20px]'>Area Name</p>
            <input className='h-[50px] border-2 border-solid border-[#F3F6F8] rounded-lg p-3 w-full'
                   type="text" 
                   placeholder='e.g. North Region'
                   value={areaName}
                   onChange={(e) => setAreaName(e.target.value)} />
         </div>  
         {msg && (
          <div className="text-sm mt-[-10px]">
            {msg}
          </div>
        )} 

        <div className='flex flex-row w-5/6 justify-end ml-20 mb-5 absolute bottom-0'>
            <button className='p-3 flex justify-center align-middle border-2 border-solid border-[#e7ebee] rounded-lg shadow-md cursor-pointer w-[100px] font-semibold hover:shadow-lg'
                    type='button'
                    onClick={onCancel}
                    disabled={saving}>Cancel</button>
            <button className='p-3 flex justify-center align-middle border h-[50px] rounded-xl cursor-pointer hover:shadow-lg bg-[#5145E7] border-none text-white ml-2 w-[100px]'
                    type='button'
                    onClick={onSave}
                    disabled={saving} >{saving ? <Spinner/> : "Save Area"}</button>
        </div>

      </div>
    </main>
  )
}

 