"use client"
import { useEffect, useState } from "react"
import Select from "react-select";
import BackButton from "@/app/components/backButton/backButton";
import Spinner from '@/app/components/Spinner/loadSpinner';

export default function SubArea(){
  
    const [areas, setAreas] = useState([]);
    const [selectedArea, setSelectedArea] = useState("");
    const [subAreaName, setSubAreaName] = useState("");
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState("");

     useEffect(() => {
    async function fetchAreas() {
      try {
        const res = await fetch("/api/areas"); 
        const json = await res.json();
        if (res.ok) {
          setAreas(json.data);
        } else {
          setMsg(json.error || "Failed to load areas");
        }
      } catch (err) {
        setMsg(err.message);
      }
    }
    fetchAreas();
  }, []);
 
  const combo_options_id = areas.map((a) =>({
        value: a.area_id,
        label: a.area_id
  })) 
  const combo_options = areas.map((a) =>({
        value: a.area_id,
        label: a.area_name
  }));

  const onSave = async () => {
    if (!selectedArea) {
      setMsg("Please select a parent area");
      return;
    }
    if (!subAreaName.trim()) {
      setMsg("Subarea name is required");
      return;
    }

    try {
      setSaving(true);
      setMsg("");
      const res = await fetch("/api/subareas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          areaId: selectedArea,
          subareaName: subAreaName.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");

      setMsg(`Saved! Subarea ID ${json.subareaId}`);
      setSubAreaName("");
      setSelectedArea("");
    } catch (e) {
      setMsg(e.message);
    } finally {
      setSaving(false);
    }
  };


  return(
    
    <main className='m-10 flex flex-col'>
     <div className='flex flex-row'>
                 <BackButton />
                <p className="text-3xl font-bold">Add New Subarea</p></div>
      <div className='flex flex-col gap-6 p-8 w-5xl  bg-white mt-[30px] rounded-lg shadow-md'>
         <div className='w-full'>
           <p>Parent Area ID</p>
            <Select 
            options = {combo_options_id}
             value={combo_options_id.find((o) => o.value === selectedArea)}
             onChange={(option) => setSelectedArea(option.value)}
                placeholder="Select an Area by ID..."
                isSearchable
                styles={{
                  menu: (provided) => ({
                    ...provided, 
                    overflowY: "auto",
                  }),
                }}
             />
            <p>Parent Area Name</p>
            <Select 
            options = {combo_options}
             value={combo_options.find((o) => o.value === selectedArea)}
             onChange={(option) => setSelectedArea(option.value)}
                placeholder="Select an Area by name..."
                isSearchable
                styles={{
                  menu: (provided) => ({
                    ...provided, 
                    overflowY: "auto",
                  }),
                }}
             />
         </div>
       <div>
        <p>Sub-area</p>
        <input className="h-[50px] border-2 border-solid border-[#F3F6F8] rounded-lg p-3 w-full"
            type="text"
            placeholder="Subarea Name"
            value={subAreaName}
            onChange={(e) => setSubAreaName(e.target.value)}/>

        </div>     
        {msg && <div className="text-sm mt-[-10px]">{msg}</div>}
        <div className='flex flex-row justify-end'>
            <button className='p-3 flex justify-center align-middle border-2 border-solid border-[#e7ebee] rounded-lg shadow-md cursor-pointer w-[100px] font-semibold hover:shadow-lg'
            type="button"
             onClick={() => {
              setSelectedArea("");
              setSubAreaName("");
              setMsg("");
            }}
            disabled={saving}>Cancel</button>
            <button className='p-3 flex justify-center align-middle border h-[50px] w-[] rounded-xl cursor-pointer hover:shadow-lg bg-[#5145E7] border-none text-white ml-2 w-[140px]'
             type="button"
            onClick={onSave}
            disabled={saving} 
            >
               {saving ? <Spinner /> : "Save Sub-area"}
            </button>
        </div>
      
      </div>
    </main>
  )
}

 

{/* <select  className="h-[50px] border-2 border-solid border-[#F3F6F8] rounded-lg p-3 w-full"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}>
               <option value="">-- Select an Area --</option>
              {areas.map((a) => (
                <option key={a.area_id} value={a.area_id}>
                  {a.area_name}
              </option>
            ))}
            </select> */}