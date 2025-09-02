"use client"
import {useState, useEffect} from 'react'

export default function Area(){
   const [areaName, setAreaName] = useState('');
   const [subareaName, setSubareaName] = useState('');
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
        body: JSON.stringify({areaName, subareaName})
      });
      const json = await res.json();
      if(!res.ok) throw new Error(json.error || "Something went wrong");
       setMsg(
        `Saved! Area ID ${json.areaId}` +
          (json.subareaId ? `, Subarea ID ${json.subareaId}` : "")
      );
      setAreaName("");
      setSubareaName("");
      fetchNextId();
    } catch(e){
      setMsg(e.message);
    } finally{
      setSaving(false);
    }
   }
   
   const onCancel = () => {
    setAreaName("");
    setSubareaName("");
    setMsg("");
  };

  return(

    <main className='m-10 flex flex-col'>
      <p className="text-3xl font-bold">Add New Area</p>
      <div className='flex flex-col gap-6 p-8 w-5xl  bg-white mt-[30px] rounded-lg shadow-md'>
         <div className='w-full'>
            <p>ID </p><p className='bg-[#gray}'>{areaId}</p>
            <p>Area Name</p>
            <input className='h-[50px] border-2 border-solid border-[#F3F6F8] rounded-lg p-3 w-full'
                   type="text" 
                   placeholder='e.g. North Region'
                   value={areaName}
                   onChange={(e) => setAreaName(e.target.value)} />
         </div>
       <div>
            <p>Subarea(optional)</p>
            <input className='h-[50px] border-2 border-solid border-[#F3F6F8] rounded-lg p-3 w-full' 
                   type="text" 
                   placeholder='e.g. Enter a subarea'
                   value={subareaName}
                   onChange={(e) => setSubareaName(e.target.value)} />

        </div>    
         {msg && (
          <div className="text-sm mt-[-10px]">
            {msg}
          </div>
        )} 

        <div className='flex flex-row justify-end'>
            <button className='p-3 flex justify-center align-middle border-2 border-solid border-[#e7ebee] rounded-lg shadow-md cursor-pointer w-[100px] font-semibold hover:shadow-lg'
                    type='button'
                    onClick={onCancel}
                    disabled={saving}>Cancel</button>
            <button className='p-3 flex justify-center align-middle border h-[50px] w-[] rounded-xl cursor-pointer hover:shadow-lg bg-[#5145E7] border-none text-white ml-2 w-[100px]'
                    type='button'
                    onClick={onSave}
                    disabled={saving} >{saving ? "Saving..." : "Save Area"}</button>
        </div>

      </div>
    </main>
  )
}

 